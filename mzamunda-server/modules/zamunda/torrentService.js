/*jslint node: true */
var http = require("http");
var Promise = require("bluebird");
var cheerio = require('cheerio');
var request = require('request');
var iconv = require('iconv-lite');
// Main modules
var TorrentParser = require('./TorrentParser'); // Return "class function" - use with `new`
var torrentTypeParser = require('./torrentTypes.js');
var uri = require('../uri');
var unicodeToWin1251_UrlEncoded = require('../unicodeToWin1251_UrlEncoded');

var torrentService = (function() {
    "use strict";
    
    // Private
    
    // TODO: Cache some common results!
    // HTML parser operations are slow. Requests to zamunda.net too.
    var cache = {};
    
    var ZAMUNDA_URL = 'www.zamunda.net',
        ZAMUNDA_URI = 'https://zamunda.net',
        // Movie categories
        C_MOVIES = ['c31', 'c28', 'c35', 'c25', 'c24', 'c42', 'c20', 'c19', 'c46', 'c5'];
    
    // Exposed

    /**
     * Get recommended torrents
     * @param  {String} cookies  Cookies for user authentication
     * @return {Promise}         Promise that resolves with Array of torrents
     */
    var getRecommended = function getRecomenddedTorrents(cookies) {
        return new Promise(function(resolve, reject) {
            var options = {
                url: ZAMUNDA_URI + '/bananas',
                headers: {
                    cookie: cookies
                },
                encoding: 'binary'
            };

            request(options, function(err, res, body) {
                if (err) reject(err);
                if (!body) reject({status: 503, message: 'Няма връзка с замунда.'});

                var utf8_body = binaryToUtf8(body);
                var $ = cheerio.load(utf8_body);
                var torrentParser = new TorrentParser();
                var torrents = [];
                if (cookies && cookies.indexOf('uid=') > -1) { // logged in
                    torrents = torrentParser.parseTable($('#div1 tr'));
                } else {
                    torrents = torrentParser.parseTable($('.test.bottom tr'));
                }
                resolve(torrents);
            });
        });
    };

    /**
     * @param  {JSON} reqData [The data sent in the request]
     * @param  {String} cookies [Cookies for specific user]
     * @return {Promise}
     */
    var search = function search(reqData, cookies) {
        return new Promise(function(resolve, reject) {
            if (typeof reqData.searchString === 'undefined') {
                reject({status: 400, error: 'reqData.searchString is not defined'});
            }
            if (typeof reqData.page !== 'number') {
                reject({status: 400, error: 'Page must be a number'});
            }
            if (reqData.page > 30000) {
                reject({status: 400, error: 'The page cannot be accessed.'});
            }

            var searchString = decodeURIComponent(reqData.searchString);
            searchString = unicodeToWin1251_UrlEncoded(searchString);

            var options = {
                url: ZAMUNDA_URI + '/bananas',
                headers: {
                    cookie: cookies
                },
                qs: {
                    search: searchString,
                    page: encodeURIComponent(reqData.page) || 0, // Zamunda pages start from 0
                    field: 'name'
                },
                qsStringifyOptions: {
                    encode: false
                },
                encoding: 'binary'
            };

            request(options, function(err, res, body) {
                if (err) reject(err);
                if (!body) reject({status: 503, message: 'Няма връзка с замунда.'});

                // body = new Buffer(body || '', 'binary');
                // var conv = new iconv.Iconv('windows-1251', 'utf-8//IGNORE');
                var utf8_body = binaryToUtf8(body);

                var $ = cheerio.load(utf8_body);
                var torrentParser = new TorrentParser();
                var torrents = torrentParser.parseTable($('.test.bottom tr'));
                var pagesEl = $('font>a>b').parent().parent();
                var pagination = torrentParser.getPagination(pagesEl);
                resolve({
                    torrents: torrents,
                    pagination: pagination
                });
            });
        });
    };

    var serveCategory = function(reqData, cookies) {
        return new Promise(function(resolve, reject) {
            if (isNaN(reqData.page)) throw {status: '400', error: 'page must be a number'};
            reqData.page = reqData.page | 0;

            var queryString = {field: 'name'}; // defaults;
            var typeCategoryStrings = [];
            // If no type is presented - usually it will show all torrents.
            if (reqData.type == 'movies') typeCategoryStrings = C_MOVIES;
            for (var i = 0; i < typeCategoryStrings.length; i++) {
                queryString[typeCategoryStrings[i]] = 1;
            }
            queryString.page = reqData.page;

            var options = {
                url: ZAMUNDA_URI + '/bananas',
                headers: {
                    cookie: cookies || '',
                },
                qs: queryString,
                encoding: 'binary'
            };
            request(options, function(err, res, body){
                if (err) reject(err);
                if (!body) reject({status: 503, message: 'Няма връзка с замунда.'});

                // body = new Buffer(body || '', 'binary');
                // var conv = new iconv.Iconv('windows-1251', 'utf-8//IGNORE');
                var utf8_body = binaryToUtf8(body);

                var $ = cheerio.load(utf8_body);
                var torrentParser = new TorrentParser();
                var torrents = torrentParser.parseTable($('.test.bottom tr'));
                var pagesEl = $('font>a>b').parent().parent();
                var pagination = torrentParser.getPagination(pagesEl);
                resolve({
                    torrents: torrents,
                    pagination: pagination
                });
            });
        });
    };

    function getTorrentDescriptionHTML(url, cookies) {
        if (!url) throw new ReferenceError('url is not defined');

        return new Promise(function(resolve, reject) {
            var options = {
                url: url,
                headers: {
                    cookie: cookies
                },
                encoding: 'binary'
            };
            request(options, function(err, res, body){
                if (err) reject(err);
                if (!body) reject({status: 503, message: 'Няма връзка с замунда.'});

                // body = new Buffer(body || '', 'binary');
                // var conv = new iconv.Iconv('windows-1251', 'utf-8//IGNORE');
                var utf8_body = binaryToUtf8(body);

                resolve(utf8_body);
            });
        });
    }

    function autoComplete(str) {
        // TODO
    }

    function binaryToUtf8(body, bodyEncoding) {
        body = new Buffer(body || '', 'binary');
        var output = iconv.decode(body, bodyEncoding || 'windows-1251');
        return iconv.encode(output, 'utf-8');
    }
    
    

    return {
        getRecommended: getRecommended,
        getTorrentDescriptionHTML: getTorrentDescriptionHTML,
        search: search,
        category: serveCategory
    };
}());


module.exports = torrentService;
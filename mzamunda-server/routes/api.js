/*
| All api routes are defined in this file.
*/
var express = require('express');
var router = express.Router();
var path = require("path");
var log = require('../modules/simple-logger');

/*
|------------------------------
| Authentication
|------------------------------
*/

var auth = require(path.normalize(__dirname + '/../modules/zamunda/auth'));

router.get('/auth/login', function(req, res){
    auth.login(req.query).then(function(cookies) {
        res.setHeader("Set-Cookie", cookies);
        // res.json(cookies);
        res.end();
    }, errorHandler);

    function errorHandler(err) {
        if (err.messageBG) {
            res.status(err.status || 500);
            res.end(err.messageBG);
        }
        else {
            res.status(500);
            res.end('Server hitted an unknown error while processing your request.');
        }
    }
});



/*
|------------------------------
| Torrent
|------------------------------
*/
var torrentService = require('../modules/zamunda/torrentService');

router.get('/torrent/recommended', function(req, res) {
    torrentService.getRecommended(req.headers.cookie).then(function(data) {
        res.end(JSON.stringify(data));
    }/*Error handling TODO*/);
});

router.post('/torrent/search', function(req, res) {
    function sendResponse(torrentList) {
        res.send(torrentList);
        res.end();
    }
    function sendError(err) {
        res.status(err.status || 500);
        res.json(err || {err: 'Server hitted an unknown error.'});
        res.end();
    }
    torrentService.search(req.body, req.headers.cookie).then(sendResponse, sendError);
});

router.get('/torrent/description', function(req, res) {
    torrentService.getTorrentDescriptionHTML(req.query.url, req.headers.cookie)
    .then(function(html){
        res.end(html);
    });
});

router.get('/torrent/category', function(req, res) {
    torrentService.category(req.query, req.headers.cookie)
    .then(function(data) {
        res.send(data);
        res.end();
    }, function(err) {
        res.status = err.status || 500;
        res.json(err || {err: 'Server hitted an unknow error.'});
        res.end();
    });
});

/*
|------------------------------
| fileService
|------------------------------
*/
var fileService = require('../modules/zamunda/fileService');
router.get('/get/file', function(req, res) {
    var url = req.query.url;
    if (!url) {
        res.status = 400;
        res.end('url is not presented.');
    }
    fileService.respondFile(req.query.url, req.headers.cookie, res);
});

module.exports = router;

var request = require('request');
var logger = require('../simple-logger');
var os = require('os');
var uri = require('../uri');

var fileService = (function() {

    // Exposed

    function respondFile(url, cookies, resObj) {
        var options = {
            method: 'GET',
            url: url,
            headers: {
                cookie: cookies
            }
        };
        if (url.indexOf('.torrent')) {
            resObj.header('Content-Type', 'application/x-bittorrent');
        }
        var filename = uri.getFileName(url) || 'unnamed';
        resObj.header('Content-Disposition', 'attachment; filename="'+filename+'"');

        
        request(options)
        .on('error', function(err) {
            logger.warn(os.EOL + url + os.EOL + err.toString() + os.EOL + err.stack);
        })
        .pipe(resObj);
    }


    return {
        respondFile: respondFile
    };
}());

module.exports = fileService;
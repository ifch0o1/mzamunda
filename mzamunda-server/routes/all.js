
function routing(app) {
    var routes = {
        index: require('./'),
        api: require('./api'),
        test: require('./test')

    };

    app.use('/', routes.index);
    app.use('/api', routes.api);
    app.use('/test', routes.test);
    
    
    /**
     * Client-side routes rewriting
     * 
     * This routes are needed for client-side routing.
     */
    app.all('/search/*', function(req, res, next){
        res.sendFile(express.static('public') + '/index.html');
    });
}

module.exports = routing;
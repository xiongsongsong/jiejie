/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path');

require('db');

var app = express();


app.configure(function () {
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    //todo:wrong
    app.use(express.bodyParser({uploadDir: 'd:\\', limit: "30000mb", hash: "md5"}));
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'assets')));
    app.use(express.static(path.join(__dirname, 'static')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

routes.init(app);

app.get(/\/file\/([\w]+)/, require('./routes/fs').file);

app.get('/fsfilter', require('./routes/filter').find);

//监控使用，返回服务器日志
app.get('/server-log', function (req, res) {
    res.header('content-type', 'text/plain;charset=gbk');
    res.sendfile('./log.txt', function (err, data) {
        res.end(data);
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

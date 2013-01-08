/*
 * GET home page.
 */

function index(req, res) {
    res.sendfile('./static/index.htm');
}

exports.init = function (app) {

    app.get('/', index);

    //后台管理的路由
    require('./admin').init(app);


};
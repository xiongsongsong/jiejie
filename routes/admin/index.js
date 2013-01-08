/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-6
 * Time: 下午2:07
 * To change this template use File | Settings | File Templates.
 */

function index(req, res) {
    res.render('admin/index', {title: 'HOME', main: '/admin/psd/init', css: ['/admin/psd/psd.css']})
}


exports.init = function (app) {

    app.get('/admin', index);

};
/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-9
 * Time: 下午12:10
 * To change this template use File | Settings | File Templates.
 */

var DB = require('db');
var path = require('path');
var ObjectID = DB.mongodb.ObjectID;

exports.file = function (req, res) {


    if (req.params.length < 1) {
        res.end('wrong');
        return;
    }

    var gs = new DB.mongodb.GridStore(DB.dbServer, req.params[0], "r");

    gs.open(function (err, gs) {
        if (!err) {
            gs.read(gs.length, function (err, data) {
                res.end(data);
            });
        } else {
            res.end('read error');
        }

    });
};

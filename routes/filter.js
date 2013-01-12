/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-9
 * Time: 下午2:44
 * To change this template use File | Settings | File Templates.
 */

var DB = require('db');
var path = require('path');


exports.find = function (req, res) {

    var query = req.query;

    var collection = new DB.mongodb.Collection(DB.client, 'files');

    collection.find(query, {_id: 1, fileName: 1, width: 1, height: 1}).sort([
            ['_id', -1]
        ]).toArray(function (err, docs) {
            res.header('content-type', 'application/json;charset=utf-8');
            res.end(JSON.stringify({docs: docs}, undefined, '\t'));
        })
};


exports.getCategory = function (req, res) {
    var collection = new DB.mongodb.Collection(DB.client, 'files');
    res.header('Content-Type', 'application/json;charset=utf-8');

    var field = req.query.field;

    if (!field || field.toString().trim().length < 1) {
        res.end('wrong,require field');
        return;
    }

    collection.distinct(field, function (err, docs) {
        res.end(JSON.stringify(docs));
    });
};

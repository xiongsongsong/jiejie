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

    var fields = {_id: 1, fileName: 1, width: 1, height: 1, title: 1, describe: 1};

    if (query._id) {
        fields.title = 1;
        fields.describe = 1;
    }

    collection.find(query, fields).sort([
            ['ts', -1]
        ]).toArray(function (err, docs) {
            res.jsonp({docs: docs});
        })
};


exports.getCategory = function (req, res) {
    var collection = new DB.mongodb.Collection(DB.client, 'files');
    var field = req.query.field;
    if (!field || field.toString().trim().length < 1) {
        res.end('wrong,require field');
        return;
    }

    collection.distinct(field, function (err, docs) {
        res.jsonp(docs);
    });
};

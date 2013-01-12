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

    collection.find(query, {}).sort([
            ['_id', -1]
        ]).toArray(function (err, docs) {
            res.header('content-type', 'application/json;charset=utf-8');
            res.end(JSON.stringify({docs: docs}, undefined, '\t'));
        })
};

/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-9
 * Time: 下午2:44
 * To change this template use File | Settings | File Templates.
 */

var DB = require('db');
var path = require('path');
var ObjectID = DB.mongodb.ObjectID;

exports.find = function (req, res) {

    var query = req.query;
    var callback = query.callback
    delete query.callback

    var allowField = ['category', 'color', 'date', 'series', 'company']

    var param = {}

    allowField.forEach(function (item) {
        if (allowField.indexOf(item) >= 0 && req.query[item] !== undefined) param[item] = req.query[item]
    })

    if (Object.keys(req.query).length > 10) {
        res.end()
        return
    }
    
    if(param._id){
        param._id=ObjectID(param._id)
    }

    var collection = new DB.mongodb.Collection(DB.client, 'files');

    var fields = {_id: 1, fileName: 1, width: 1, height: 1, title: 1, describe: 1};

    if (query._id) {
        fields.title = 1;
        fields.describe = 1;
    }

    collection.find(param, fields).sort([
            ['ts', -1]
        ]).toArray(function (err, docs) {
            res.header('content-type', 'application/javascript;charset=utf-8');
            res.end(callback + '(' + JSON.stringify({docs: docs}) + ')');
        })
};

exports.getCategory = function (req, res) {
    var collection = new DB.mongodb.Collection(DB.client, 'files');
    var field = req.query.field;
    if (!field || field.toString().trim().length < 1) {
        res.end(req.query.callback + '(null)');
        return;
    }

    collection.distinct(field, function (err, docs) {
        res.header('content-type', 'application/javascript;charset=utf-8');
        res.end(req.query.callback + '(' + JSON.stringify(docs) + ')');
    });
};

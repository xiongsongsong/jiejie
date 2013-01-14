/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-11
 * Time: 下午12:10
 * To change this template use File | Settings | File Templates.
 */

var DB = require('db');

exports.update = function (req, res) {

    var body = req.body;
    var collection = new DB.mongodb.Collection(DB.client, 'files');

    //只对以下字段进行处理
    var type = ['category', 'color', 'date', 'series', 'title', 'describe'];

    var update = Object.create(null);

    Object.keys(body).forEach(function (k) {
        if (type.indexOf(k) > -1) {
            if (body[k] && body[k].trim().length > 0) update[k] = body[k]
        }
    });

    collection.update(
        {
            _id: {$in: req.body.id.split(',')}
        },
        {
            $set: update
        }, {multi: true}, function (err, docs) {
            res.end('done');
        }
    )

};
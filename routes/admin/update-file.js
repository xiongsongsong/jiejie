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

    var type = ['category', 'color', 'date', 'series'];
    if (type.indexOf(body.type) < 0) {
        res.end({error: 'deny type'});
        return;
    }
    var update = Object.create(null);
    update[body.type] = body.value;

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
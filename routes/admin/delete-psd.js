/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-12
 * Time: 上午11:02
 * To change this template use File | Settings | File Templates.
 */


var DB = require('db');
var GridStore = DB.mongodb.GridStore;
var ObjectID = DB.mongodb.ObjectID;


exports.delete = function (req, res) {

    var id = req.query.id;

    res.header('Content-Type', 'text/plain;charset=utf-8');

    if (!id || /^[\w]+$/.test(id) === false) {
        res.end('非法参数');
        return;
    }

    //先找出所有的文件
    var collection = new DB.mongodb.Collection(DB.client, 'fs.files');
    collection.find({ filename: new RegExp(id + '.*','gi')}, {_id: 1}).toArray(function (err, docs) {
        res.end('即将删除' + docs.length + '个文件');
        console.log('即将删除' + docs.length + '个文件', docs);
        deletePSD(docs, id);
    })
};


function deletePSD(docs, id) {
    function del() {
        if (docs.length < 1) {
            console.log('全部删除完毕，开始删除主记录');
            var collection = new DB.mongodb.Collection(DB.client, 'fs.files');
            collection.remove({_id: id}, {w: 1}, function (err, numberOfRemovedDocs) {
                if (!err) {
                    console.log('已经删除' + numberOfRemovedDocs + '条记录,deletePSD,id:' + id);
                } else {
                    console.log('无法删除ID为' + id + '的记录', numberOfRemovedDocs);
                }
            });
            return;
        }
        var curDocs = docs.shift();
        GridStore.unlink(DB.dbServer, curDocs._id, function (err) {
            if (!err) {
                console.log('成功删除' + curDocs._id);
            } else {
                console.log('无法删除' + curDocs._id, err);
            }
            del();
        });
    }

    del();

}

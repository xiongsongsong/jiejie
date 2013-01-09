/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-6
 * Time: 下午2:07
 * To change this tem
 * plate use File | Settings | File Templates.
 */

function index(req, res) {
    res.render('admin/index', {title: 'HOME', main: '/admin/psd/init', css: ['/admin/psd/psd.css']})
}

var fs = require('fs');
var DB = require('db');
var path = require('path');
var im = require('imagemagick');
var GridStore = DB.mongodb.GridStore;
var ObjectID = DB.mongodb.ObjectID;


function savePsd(req, res) {

    if (!req.files.file) {
        res.end('error');
        return;
    }

    var files;

    if (Array.isArray(req.files.file)) {
        files = req.files.file;
    } else if (req.files.file.path) {
        files = [req.files.file]
    }

    _savePsd(files, function (pass, error) {

        var collection = new DB.mongodb.Collection(DB.client, 'log');

        var docs = [];

        pass.forEach(function (item) {
            docs.push({
                _id: item._id,
                fileName: item.name,
                wh: item.wh,
                path: path.basename(item.path),
                length: item.length,
                category: [],
                color: [],
                data: [],
                series: [],
                timestamp: Date.now(),
                sort: Date.now(),
                author: 'songsong',
                status: 1 // 0；被删除文件，1：待编辑文件  2：私人文件，3：正常的文件，4：缩略图文件
            })
        });

        collection.insert(docs, {safe: true},
            function () {
                res.end(JSON.stringify({images: pass.map(function (file) {
                    return path.basename(file.path)
                }), err: error}, undefined, '    '));
            });
    })
}

//都是宽度按比例缩放
var resizeParam = [24, 30, 40, 60, 70, 80, 100, 110, 120, 160, 170, 200, 210, 250, 310, 620, 670];


function _savePsd(arr, cb) {

    var errorMsg = [];
    var pass = [];

    function save() {
        if (arr.length < 1) {
            cb(pass, errorMsg);
            return;
        }
        var cur = arr.shift();

        var allowFile = {
            'jpg': 'image/jpg',
            'jpeg': 'image/jpg',
            'gif': 'image/gif',
            'png': 'image/png'
        };

        var extName = path.extname(cur.name).substring(1);

        console.log('检查扩展名' + extName);
        if (!allowFile[extName]) {
            return;
        }

        //检查是否为有效图片
        im.identify(['-format', '%wx%h', cur.path], function (err, output) {
            if (!err) {
                cur.wh = output;

                // Our file ID
                var fileId = new ObjectID();

                // Open a new file

                var gs = new GridStore(DB.dbServer, fileId, "w", {
                    "chunk_size": 1024 * 64
                });

                cur._id = fileId;

                pass.push(cur);

                gs.writeFile(cur.path, function (err, data) {
                    //console.log(err, data);
                    //生成缩略图
                    resize(cur, fileId, function () {
                        save();
                    });

                });


            } else {
                errorMsg.push(cur.name + ' wrong picture file');
                save();
            }
        });
    }

    function resize(cur, fileId, cb) {
        var w = parseInt(cur.wh.substring(0, cur.wh.indexOf('x')), 10);
        var _resizeParam = resizeParam.filter(function (item) {
            return w > item;
        });

        function _resize() {
            if (_resizeParam.length < 1) {
                cb();
                return;
            }
            var curSize = _resizeParam.shift();
            im.resize({
                srcPath: cur.path,
                dstPath: cur.path + '_' + curSize,
                width: curSize
            }, function (err, stdout, stderr) {
                if (err) throw err;
                console.log('resized kittens.jpg to fit within' + curSize);
                _resize();
            });
        }
        _resize();
    }

    save();
}

exports.init = function (app) {

    app.get('/admin', index);
    app.post('/admin/save-psd', savePsd);

};
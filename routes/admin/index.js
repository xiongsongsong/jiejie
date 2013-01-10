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
        res.end('你必须上传至少一个文件');
        return;
    }
    var files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];

    //过滤掉后缀名不正确的文件
    files = files.filter(function (item) {
        return allowFile[ path.extname(item.name).substring(1) ];
    });

    //存为数组以方便递归处理
    _savePsd(files, req, res);
}

//按比例缩放，只针对宽度
var resizeParam = [24, 30, 40, 60, 70, 80, 100, 110, 120, 160, 170, 200, 210, 250, 310, 620, 670];

var allowFile = {
    'jpg': 'image/jpg',
    'jpeg': 'image/jpg',
    'gif': 'image/gif',
    'png': 'image/png',
    'psd': 'image/psd'
};

//递归保存每个文件日志、文件实体和对应缩略图
function _savePsd(files, req, res) {

    var errorMsg = [];
    var pass = [];
    var tempFile = [];

    function save() {

        if (files.length < 1) {
            res.end(JSON.stringify({pass: pass, err: errorMsg}, undefined, '    '));
            unlink(tempFile);
            return;
        }

        var cur = files.shift();

        tempFile.push(cur.path);

        var extName = path.extname(cur.name).substring(1).toLocaleLowerCase();

        if (!allowFile[extName]) {
            return;
        }

        //检查是否为有效图片
        im.identify(['-format', '%wx%h', cur.path], function (err, output) {
            if (!err) {

                cur.wh = output;

                var fileId = new ObjectID().toString();

                var collection = new DB.mongodb.Collection(DB.client, 'files');

                //先保存上传日志，在将文件保存到GridFS
                collection.insert({
                        _id: fileId,
                        fileName: cur.name,
                        wh: extName === 'psd' ? 'psd' : output,
                        path: path.basename(cur.path),
                        length: cur.length,
                        category: [],
                        color: [],
                        data: [],
                        series: [],
                        tag: [],
                        timestamp: Date.now(),
                        sort: Date.now(),
                        author: 'songsong',
                        status: 1 // 0；被删除文件，1：待编辑文件  2：私人文件，3：正常的文件，4：缩略图文件
                    }, {safe: true},
                    function (err /*,result*/) {
                        if (!err) {

                            pass.push(fileId);

                            var gs;

                            if (extName === 'psd') {
                                console.log('即将处理PSD');
                                //首先保存PSD，注意后缀
                                gs = new GridStore(DB.dbServer, fileId + '_psd', "w", {
                                    chunk_size: 10240
                                });
                                gs.writeFile(cur.path, function (err) {
                                    if (!err) {
                                        console.log('保存PSD成功');
                                        console.log('正在转换PSD文件为jpg');


                                        var jpgPath = path.join(path.dirname(cur.path), fileId + '.jpg');

                                        im.convert([cur.path + '[0]', jpgPath], function (err) {
                                            if (!err) {

                                                console.log('成功转换psd-->jpg');

                                                tempFile.push(jpgPath);

                                                //将PSD转换为JPG
                                                gs = new GridStore(DB.dbServer, fileId, "w", {
                                                    chunk_size: 10240
                                                });
                                                console.log('开始保存psd生成的jpg');

                                                gs.writeFile(jpgPath, function (err) {
                                                    if (!err) {
                                                        console.log('保存psd生成的jpg成功！');
                                                        //用新生成的jpg来生成缩略图
                                                        cur.path = jpgPath;
                                                        resize(cur, fileId, function () {
                                                            save();
                                                        });
                                                    } else {
                                                        console.log('无法保存jpg' + fileId + Date.now());
                                                    }
                                                });
                                            } else {
                                                console.log('转换PSD到jpg失败', err);
                                            }
                                        });
                                    } else {
                                        console.log('PSD保存失败');
                                    }
                                });
                            } else {
                                gs = new GridStore(DB.dbServer, fileId, "w", {
                                    chunk_size: 10240
                                });

                                gs.writeFile(cur.path, function (err) {
                                    //先生成上传记录，再保存到gridFS
                                    resize(cur, fileId, function () {
                                        save();
                                    });
                                });
                            }

                        } else {
                            errorMSG.push('无法保存该条记录' + Date.now() + ',');
                            console.log(err);
                        }
                    });

            } else {
                errorMsg.push(cur.name + ' wrong picture file');
                save();
            }
        });
    }

    //对上传的图片生成不同规格的缩略图
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

            //生成缩略图并存入库中
            var dstSrc = cur.path + '_' + curSize;
            im.resize({
                srcPath: cur.path,
                dstPath: dstSrc,
                width: curSize
            }, function (err) {
                if (!err) {

                    tempFile.push(dstSrc);

                    var gs = new GridStore(DB.dbServer, fileId + '_' + curSize, "w", {
                        "chunk_size": 10240
                    });
                    gs.writeFile(dstSrc, function (err) {
                        if (err) console.log(err);
                        _resize();
                    });
                } else {
                    console.log(err);
                    _resize();
                }

            });
        }

        _resize();
    }

    save();
}

/*
 该方法并不能完全解决问题
 此处应该使用定时程序，来做处理
 */
function unlink(list) {
    var cur = list.shift();
    fs.unlink(cur, function (err) {
        if (!err) {
            console.log(cur + 'already unlink');
        } else {
            console.log('unlink fail');
        }
        if (list.length > 0) unlink(list);
    })
}

exports.init = function (app) {

    app.get('/admin', index);
    app.post('/admin/save-psd', savePsd);

};
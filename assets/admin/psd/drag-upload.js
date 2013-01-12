/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-8
 * Time: 下午3:58
 * To change this template use File ' Settings ' File Templates.
 */

define(function (exports, require, module) {

    var $pic = $('#pic');
    var allowFile = ['jpg', 'jpeg', 'png', 'gif', 'psd'];
    var $p = $('#p');

    var cl;

    //拖进
    $pic.bind('dragenter', function (e) {
        e.preventDefault();
    });

    //拖来拖去 , 一定要注意dragover事件一定要清除默认事件
    //不然会无法触发后面的drop事件
    $pic.bind('dragover', function (e) {
        e.preventDefault();
    });

    //扔
    $pic.bind('drop', function (e) {
        dropHandler(e);
    });

    var dropHandler = function (e) {
        //将本地图片拖拽到页面中后要进行的处理都在这
        e.preventDefault();
        var fileList = e.originalEvent.dataTransfer.files;

        var images = [];

        Object.keys(fileList).forEach(function (item) {
            var f = fileList[item];
            if (!f.name) return;
            var ext = f.name.substring(f.name.lastIndexOf('.') + 1).toLowerCase();
            if (ext && allowFile.indexOf(ext) > -1) {
                images.push(f);
            }
        });

        var formData = new FormData($('#psd-form')[0]);

        console.log($('#psd-form')[0])

        images.forEach(function (file) {
            formData.append('file', file);
        });

        var xhr = new XMLHttpRequest();
        var url = '/admin/save-psd';

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                $p.html(xhr.responseText);
                cl = setTimeout(function () {
                    $p.parent().slideUp();
                    $p.html('');
                    $p.width('0');
                }, 5000);
            }
        };

        if (images.length > 0) {
            xhr.open('post', url);

            xhr.upload.addEventListener("progress", function (evt) {
                var percent = Math.round(evt.loaded * 100 / evt.total);
                $p.html(percent + '%').css('width', percent + '%');
            }, false);


            xhr.send(formData);

            if (cl) {
                clearTimeout(cl);
                cl = undefined;
            }

            $p.parent().slideDown();
        }
    };
});



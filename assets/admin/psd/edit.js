/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-14
 * Time: 下午2:05
 * To change this template use File | Settings | File Templates.
 */


define(function (require, exports, module) {

    var $imgContainer = $('#img-container');
    var $edit = $('#edit');
    var $form = $(document.forms['edit']);

    $imgContainer.find('b.edit').live('click', function (ev) {
        ev.stopPropagation();
        var $target = $(ev.currentTarget);
        $edit.addClass('show');
        var data = $target.parents('div.pic');
        $.getJSON('filter?_id=' + data.attr('data-id'), function (serverDocs) {
            if (serverDocs.docs.length > 0) {
                edit(data, serverDocs.docs[0]);
            }
        });
    });

    $form.find('button.save').live('click', function (ev) {
        $edit.removeClass('show');
        update();
    });

    $form.find('button.continue').live('click', function (ev) {
        update();
        var id = $form.find('input.id').val();
        var cur = $imgContainer.find('div.pic[data-id=' + id + ']');
        var next = cur.next();
        if (next.length > 0) {
            next.find('b.edit').trigger('click');
        }
        ev.preventDefault();
        ev.stopPropagation();
    });

    $form.find('button.cancel').live('click', function (ev) {
        $form[0].reset();
        $edit.removeClass('show');
    });

    function edit(data, docs) {
        var $img = data.find('img');
        $form.find('img').attr('src', $img.attr('src'));
        $form.find('a.img').attr('href', '/file/' + data.attr('data-id'));
        $form.find('span.tips').html($img.attr('alt').replace(/[\w.-]/gmi, ''));
        $form.find('input.id').val(data.attr('data-id'));
        $form.find('input[name=title]').val($.trim(docs.title).length > 0 ? docs.title : '');
        $form.find('textarea[name=describe]').val($.trim(docs.describe).length > 0 ? docs.describe : '');
    }

    $form.submit(function () {
        return false;
    });

    function update() {
        var data = {
            id: $.trim($form.find('input.id').val()),
            title: $.trim($form.find('input[name=title]').val()),
            describe: $.trim($form.find('textarea[name=describe]').val())
        };

        $.post("/admin/update-file", data, function (data) {

        });

    }

});
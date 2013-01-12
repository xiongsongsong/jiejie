/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-12
 * Time: 下午12:17
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    $("#img-container").find("b.close").live('click', function (e) {
        var $this = $(this);
        var $pic = $this.parents('div.pic');
        var id = $pic.attr('data-id');
        $.get('/admin/delete-psd?id=' + id, function (data) {
            console.log(data);
            $pic.slideUp(function () {
                $pic.remove();
            })
        })
    })
});
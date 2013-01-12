/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-11
 * Time: 上午10:14
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var $imgContainer = $('#img-container');

    $imgContainer.find('.pic').live('click', function () {
        $this = $(this);
        $this.toggleClass('checked');
    });

    var $control = $('#control');

    $control.find('[t]').live('click', function (e) {
        $this = $(this);
        var type = $this.attr('t');
        var value = $this.attr('value');
        var $pic = $imgContainer.find('div.pic.checked');

        var id = [];
        $pic.each(function (index, item) {
            id.push(item.getAttribute('data-id'));
        });

        $.post("/admin/update-file", {
                type: type,
                value: value,
                id: id.join(',')
            },
            function (data) {
                require('./filter').update();
            });

        e.preventDefault();
    });

});

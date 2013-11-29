/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-11
 * Time: 下午1:59
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var $filter = $('#filter');
    $filter.html($('#control').html());

    $filter.find('[t]').live('click', function () {
        var $this = $(this);
        var t = $this.attr('t');
        var v = $this.attr('value');
        $this.siblings().removeClass('active');
        $this.addClass('active');

        exports.update();

    });

    exports.update = function () {

        getData(getFilter());

    };

    function getData(filter) {
        $.ajax("/filter", { data: filter, dataType: 'jsonp'}).done(function (data) {
            render(data);
        });
    }

    function getFilter() {

        var arr = {};
        $filter.find('.active').each(function (index, item) {
            var $item = $(item);
            arr[$item.attr('t')] = $item.attr('value')
        });
        return arr;
    }

    //exports.update();

    function render(data) {
        var li = '';
        for (var i = 0; i < data.docs.length; i++) {
            var cur = data.docs[i];
            li += '<div class="pic" data-id="' + cur._id + '"><div class="img"><i></i><img src="/file/' + cur._id + (cur.width > 170 ? '_170' : '') + '" alt="' + cur.fileName + '"></div>' +
                '<b class="edit">编辑</b></div>';
        }
        $('#img-container').html(li);
    }

});

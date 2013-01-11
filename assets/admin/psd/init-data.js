/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-10
 * Time: 下午3:59
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var container = $('#filter').html();

    $.getJSON('/filter', function (data) {
        var li = '';
        for (var i = 0; i < data.docs.length; i++) {
            var cur = data.docs[i];
            li += '<div class="pic" data-id="' + cur._id + '"><div class="img"><i></i><img src="/file/' + cur._id + (cur.width > 170 ? '_170' : '') + '"></div></div>';
        }
        $('#img-container').html(li);
    });

    $('#filter').tooltip({
        selector: 'span'
    })

});

/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-3-21
 * Time: 上午10:35
 * To change this template use File | Settings | File Templates.
 */

if ('undefined' == typeof(document.body.style.maxHeight)) {
    $(function () {
        $('#nav div.content>div.nav>ul>li').hover(function (ev) {
            $(this).addClass('hover');
        }, function () {
            $(this).removeClass('hover');
        });
    })
}
/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-8
 * Time: 上午10:53
 * To change this template use File | Settings | File Templates.
 */

/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 12-12-17
 * Time: 下午7:36
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    require('./update');

    require('./filter');

    //require('./sort');

    require('./drag-upload');

    $('#filter,#control').tooltip({
        selector: '.color span'
    });

    require('./helper');

    require('./delete');


});

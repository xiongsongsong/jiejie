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

        var $document = $(document);
        var $window = $(window);
        var $container = $('#container');

        function addDragListener(ev) {
            ev.preventDefault();
        }

        var x, y, offsetX, offsetY, $currentTarget,
            $dragTips = $('#drag-tips');

        //绑定事件
        var tempPicNode = $('<div class="temp-pic"></div>');
        $container.find('div.pic').live('mousemove', function (ev) {
            if (!$currentTarget) return;
            $container.find('div.temp-pic').remove();
            var $target = $(ev.currentTarget);
            if (ev.offsetX > $target.width() / 2) {
                $target.after(tempPicNode);
            } else {
                $target.before(tempPicNode);

            }
        });

        $container.find('div.pic').live('mousedown', function (event) {

            x = event.pageX;
            y = event.pageY;

            $dragTips.show();
            $dragTips.css({
                left: x,
                top: y
            });

            offsetX = event.offsetX;
            offsetY = event.offsetY;
            $currentTarget = $(event.currentTarget);

            //判断是放大还是拖放模式
            $(document).mousemove(move);
            $(document).one('mouseup', function () {
                $(document).off("mousemove", move);
            });

            //拖动是禁止选中文字，以避免“扫黑”影响体验
            $document.on('select', addDragListener);
            $document.on('selectstart', addDragListener);
            $document.on('dragstart', addDragListener);
            $(document).one('mouseup', function () {
                $(document).off("select", addDragListener);
                $document.off('selectstart', addDragListener);
                $(document).off("dragstart", addDragListener);
                $dragTips.hide();
                $currentTarget = undefined;
            });

        });

        //移动图片
        function move(event) {

            var _x = event.pageX;
            var _y = event.pageY;
            $dragTips.css(
                {
                    left: _x,
                    top: _y
                }
            );

        }


    }

)
;

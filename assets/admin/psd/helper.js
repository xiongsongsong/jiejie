/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 13-1-11
 * Time: 下午3:09
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var $control = $('div.control-panel');

    var $document = $(document);

    $control.find('b.switch').live('click', function () {
        $this = $(this);
        $curPanel = $this.parents('div.control-panel');

        hide($curPanel);
    });

    function hide($curPanel) {
        $curPanel.stop();
        $this = $curPanel.find('b.switch');
        if ($curPanel.hasClass('min')) {
            $curPanel.removeClass('min');
            $curPanel.animate({top: '0'}, 100, function () {
                if (!$control.not($curPanel).hasClass('min'))  $control.not($curPanel).find('b.switch').trigger('click')
            });
            $this.html($curPanel.attr('data-off'));
        } else {
            $curPanel.addClass('min');
            $curPanel.animate({top: -$curPanel.height()}, 100);
            $this.html($curPanel.attr('data-on'));
        }
    }

    $control.find('b.switch').trigger('click');

    var pageX, left, $currentControl;

    function documentMouseMove(ev) {

        $currentControl.css(
            {
                left: left + (ev.pageX - pageX)
            }
        )
    }

    function select(ev) {
        ev.preventDefault();
    }

    $control.live('mousedown', function (ev) {
        $currentControl = $(this);
        pageX = ev.pageX;
        left = parseInt($currentControl.css('left'), 10);
        $document.bind('select selectstart', select);
        $document.bind('mousemove', documentMouseMove);
        $document.one('mouseup', function (ev) {
            $document.unbind('mousemove', documentMouseMove);
            $document.unbind('select selectstart', select);
            $currentControl = null;
        });
    });

    var $imgContainer = $('#img-container');
    $('#select-control').find('a').live('click', function (e) {
        var $this = $(this);
        var action = $this.attr('action');
        switch (action) {
            case "all":
                $imgContainer.find('.pic').addClass('checked');
                break;
            case "inverse":
                $imgContainer.find('.pic').toggleClass('checked');
                break;
            case "cancel":
                $imgContainer.find('.pic').removeClass('checked');
                break;
        }

    });

    $imgContainer.find('.pic').live('mouseenter mouseleave', function (e) {
        var $this = $(this);
        if (e.type === 'mouseenter') {
            $this.append($('<b class="close">&times;</b>'));
        } else {
            $this.find('b.close').remove();
        }

    })
});
(function($) {
    // internals
    var fnGetImgHtml = function(num, isTop, isFront) {
        var html = '<img src="img/'+num+'_0'+(isTop ? '1' : '2')+'.png" class="'+
                (isFront ? 'front' : 'back')+'" />';

        return html;
    };
    var fnFlipTop = function($img, cb) {
        var dur = 62;
        $img.height('51px');                // 90%
        setTimeout(function() {
            $img.height('43px');            // 75%
            setTimeout(function() {
                $img.height('21px');        // 37.5%
                setTimeout(function() {
                    $img.height('0px');
                    cb();
                }, dur);
            }, dur);
        }, dur);
    };
    var fnFlipBot = function($img, cb) {
        var dur = 62;
        $img.height('22px');                // 37.5%
        setTimeout(function() {
            $img.height('45px');            // 75%
            setTimeout(function() {
                $img.height('54px');        // 90%
                setTimeout(function() {
                    $img.height('60px');
                    cb();
                }, dur);
            }, dur);
        }, dur);
    };
    var fnChange = function(target, num) {
        var $target = $(target),
            $top = $target.find('.top'),
            $bot = $target.find('.bot');

        if ($target.data('num') == num) {
            return;     // already at number
        }
        $target.data('num', num);

        $top.append(fnGetImgHtml(num, true, false));
        $bot.append(fnGetImgHtml(num, false, false));
        setTimeout(function() {
            // animate
            /* * /
            var duration = 500;
            $top.find('img.front').css({bottom: 0}).animate({height: 0, width: '100px'}, duration, 'easeInExpo', function() {
                $top.find('img.front').remove().end()
                    .find('img.back').removeClass('back').addClass('front');

                var $botFront = $bot.find('img.front'),
                    $botBack = $bot.find('img.back');
                $botFront.removeClass('front').addClass('back');
                $botBack.removeClass('back').addClass('front').css({height: 0, width: '100px'}).animate({height: '60px', width: '100px'}, duration, 'easeOutExpo', function() {
                        $botFront.remove();
                    });
            });
            /* */
            
            /* */
            fnFlipTop($top.find('img.front').css({bottom: 0, width: '100px'}), function() {
                $top.find('img.front').remove().end()
                    .find('img.back').removeClass('back').addClass('front');

                var $botFront = $bot.find('img.front'),
                    $botBack = $bot.find('img.back');
                $botFront.removeClass('front').addClass('back');
                fnFlipBot($botBack.removeClass('back').addClass('front').css({height: 0, width: '100px'}), function() {
                    $botFront.remove();
                });
            });
            /* */
        }, 1);
    };

    // setup
    var fnGetDigitHtml = function(num) {
        return '<div class="digit" data-num="'+num+'"><div class="top"><img src="img/'+num+'_01.png" class="front" /></div><div class="bot"><img src="img/'+num+'_02.png" class="front" /></div></div>';
    };
    var fnInit = function(target, defaultNum) {
        var $target = $(target),
            html = '',
            defaultNumStr = defaultNum.toString();
        for (var i = 0; i < defaultNumStr.length; i++) {
            html += fnGetDigitHtml(defaultNumStr.charAt(i));
        }
        html += '<div style="clear:both;"></div>';
        $target.empty().append(html).data('flipcounter', {
            "$target" : $target,
            "currentNum" : defaultNum
        });
    };
    var fnUpdateTotal = function(target, num) {
        var $target = $(target),
            data = $target.data('flipcounter') || {};

        if (data.currentNum != num) {
            var strNum = num.toString();
            if (data.currentNum && data.currentNum.toString().length == strNum.length) {
                var $digits = $target.find('.digit');
                for (var i = 0; i < strNum.length; i++) {
                    fnChange($digits.eq(i), strNum.charAt(i));
                }
            } else {
                fnInit(target, num);
            }
        }
    }

    // install plugin to jquery
    $.fn.flipcounter = function() {
        var fnToRun = null,
            target = this;
        if (arguments.length === 1 && typeof arguments[0] === 'object' && 'num' in arguments[0]) {
            var params = arguments[0];
            fnToRun = function() { fnInit(target, params['num']); };
        } else if (arguments.length === 2) {
            var command = arguments[0],
                value = arguments[1];
            switch (command) {
                case 'update':
                    fnToRun = function() { fnUpdateTotal(target, value); }
                    break;
            }
        }
        $.isFunction(fnToRun) && fnToRun();
        return this;
    };
})(jQuery);

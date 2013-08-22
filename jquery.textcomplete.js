;(function ($) {

  'use strict';

  var Completer = (function () {
    var html, css;

    html = {
      wrapper: '<div class="js-textcomplete"></div>',
      list: '<span class="js-textcomplete-list"></span>',
      item: '<span class="js-textcomplete-item"></span>'
    };
    css = {
      wrapper: {
        position: 'relative',
        display: 'inline-block'
      },
      list: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: '100',
        display: 'none'
      },
      item: {
        position: 'relative',
        display: 'block'
      }
    };

    function Completer($el) {
      var $wrapper, $list;

      $wrapper = $(html.wrapper).css(css.wrapper);
      $list = $(html.list).css(css.list);

      $el.wrap($wrapper).before($list);
    }

    return Completer;
  })();

  $.fn.textcomplete = function () {
    new Completer(this);
  };

})(window.jQuery);

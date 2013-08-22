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

    function Completer(el) {
      var $wrapper, $list;

      $wrapper = $(html.wrapper).css(css.wrapper);
      $list = $(html.list).css(css.list);

      this.el = el;
      this.$el = $(el);
      this.$el.wrap($wrapper).before($list);
    }

    $.extend(Completer.prototype, {
      /**
       * Returns caret's relative coordinates from textarea's left top corner.
       */
      getCaretPosition: function () {
        // Browser native API does not provide the way to know the position of
        // caret in pixels, so that here we use a kind of hack to accomplish
        // the aim. First of all it puts a div element and completely copies
        // the textarea's style to the element, then it inserts the text and a
        // span element into the textarea.
        // Consequently, the span element's position is the thing what we want.

        if (!this.el.selectionEnd) return;
        var css, styles, i, l, div, $div, span, position;

        css = {
          position: 'absolute',
          overflow: 'auto',
          'white-space': 'pre-wrap',
          top: 0,
          left: -9999
        };
        styles = ['height', 'width', 'padding-top', 'padding-right',
          'padding-bottom', 'padding-left', 'lineHeight', 'textDecoration',
          'letterSpacing', 'font-family', 'font-size', 'font-style',
          'font-variant', 'font-weight'];
        for (i = 0, l = styles.length; i < l; i++) {
          css[styles[i]] = this.$el.css(styles[i]);
        }

        div = document.createElement('div');
        $div = $(div);
        $div.css(css);
        this.$el.before($div);
        div.textContent = this.getTextFromHeadToCaret();
        div.scrollTop = div.scrollHeight;
        span = document.createElement('span');
        span.textContent = '&nbsp;';
        div.appendChild(span);
        position = $(span).position();
        $div.remove();
        return position;
      },

      getTextFromHeadToCaret: function () {
        return this.el.value.substring(0, this.el.selectionEnd);
      }
    });

    return Completer;
  })();

  $.fn.textcomplete = function () {
    this.each(function () {
      window.c = new Completer(this);
    });
  };

})(window.jQuery);

+function ($) {
  'use strict';

  // Textarea adapter
  // ================
  //
  // Managing a textarea. It doesn't know a Dropdown.
  function Textarea(element, completer, option) {
    this.initialize(element, completer, option);
  }

  Textarea.DIV_PROPERTIES = {
    left: -9999,
    position: 'absolute',
    top: 0,
    whiteSpace: 'pre-wrap'
  }

  Textarea.COPY_PROPERTIES = [
    'border-width', 'font-family', 'font-size', 'font-style', 'font-variant',
    'font-weight', 'height', 'letter-spacing', 'word-spacing', 'line-height',
    'text-decoration', 'text-align', 'width', 'padding-top', 'padding-right',
    'padding-bottom', 'padding-left', 'margin-top', 'margin-right',
    'margin-bottom', 'margin-left', 'border-style', 'box-sizing', 'tab-size'
  ];

  $.extend(Textarea.prototype, $.fn.textcomplete.Adapter.prototype, {
    // Public methods
    // --------------

    // Update the textarea with the given value and strategy.
    select: function (value, strategy) {
      var pre = this.getTextFromHeadToCaret();
      var post = this.el.value.substring(this.el.selectionEnd);
      var newSubstr = strategy.replace(value);
      if ($.isArray(newSubstr)) {
        post = newSubstr[1] + post;
        newSubstr = newSubstr[0];
      }
      pre = pre.replace(strategy.match, newSubstr);
      this.$el.val(pre + post);
      this.el.selectionStart = this.el.selectionEnd = pre.length;
    },

    // Private methods
    // ---------------

    // Returns the caret's relative coordinates from textarea's left top corner.
    //
    // Browser native API does not provide the way to know the position of
    // caret in pixels, so that here we use a kind of hack to accomplish
    // the aim. First of all it puts a dummy div element and completely copies
    // the textarea's style to the element, then it inserts the text and a
    // span element into the textarea.
    // Consequently, the span element's position is the thing what we want.
    _getCaretRelativePosition: function () {
      var dummyDiv = $('<div></div>').css(this._copyCss())
        .text(this.getTextFromHeadToCaret());
      var span = $('<span></span>').text('.').appendTo(dummyDiv);
      this.$el.before(dummyDiv);
      var position = span.position();
      position.top += span.height() - this.$el.scrollTop();
      position.lineHeight = span.height();
      dummyDiv.remove();
      return position;
    },

    _copyCss: function () {
      return $.extend({
        // Set 'scroll' if a scrollbar is being shown; otherwise 'auto'.
        overflow: this.el.scrollHeight > this.el.offsetHeight ? 'scroll' : 'auto'
      }, Textarea.DIV_PROPERTIES, this._getStyles());
    },

    _getStyles: (function ($) {
      var color = $('<div></div>').css(['color']).color;
      if (typeof color !== 'undefined') {
        return function () {
          return this.$el.css(Textarea.COPY_PROPERTIES);
        };
      } else { // jQuery < 1.8
        return function () {
          var $el = this.$el;
          var styles = {};
          $.each(Textarea.COPY_PROPERTIES, function (i, property) {
            styles[property] = $el.css(property);
          });
          return styles;
        };
      }
    })($),

    getTextFromHeadToCaret: function () {
      return this.el.value.substring(0, this.el.selectionEnd);
    }
  });

  $.fn.textcomplete.Textarea = Textarea;
}(jQuery);

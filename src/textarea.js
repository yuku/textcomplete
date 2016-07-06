+function ($) {
  'use strict';

  // Textarea adapter
  // ================
  //
  // Managing a textarea. It doesn't know a Dropdown.
  function Textarea(element, completer, option) {
    this.initialize(element, completer, option);
  }

  $.extend(Textarea.prototype, $.fn.textcomplete.Adapter.prototype, {
    // Public methods
    // --------------

    // Update the textarea with the given value and strategy.
    select: function (value, strategy, e) {
      var pre = this.getTextFromHeadToCaret();
      var post = this.el.value.substring(this.el.selectionEnd);
      var newSubstr = strategy.replace(value, e);
      var regExp;
      if (typeof newSubstr !== 'undefined') {
        if ($.isArray(newSubstr)) {
          post = newSubstr[1] + post;
          newSubstr = newSubstr[0];
        }
        regExp = $.isFunction(strategy.match) ? strategy.match(pre) : strategy.match;
        pre = pre.replace(regExp, newSubstr);
        this.$el.val(pre + post);
        this.el.selectionStart = this.el.selectionEnd = pre.length;
      }
    },

    getTextFromHeadToCaret: function () {
      return this.el.value.substring(0, this.el.selectionEnd);
    },

    // Private methods
    // ---------------

    _getCaretRelativePosition: function () {
      var p = $.fn.textcomplete.getCaretCoordinates(this.el, this.el.selectionStart);
      return {
        top: p.top + this._calculateLineHeight() - this.$el.scrollTop(),
        left: p.left - this.$el.scrollLeft(),
        lineHeight: this._calculateLineHeight()
      };
    },

    _calculateLineHeight: function () {
      var lineHeight = parseInt(this.$el.css('line-height'), 10);
      if (isNaN(lineHeight)) {
        // http://stackoverflow.com/a/4515470/1297336
        var parentNode = this.el.parentNode;
        var temp = document.createElement(this.el.nodeName);
        var style = this.el.style;
        temp.setAttribute(
          'style',
          'margin:0px;padding:0px;font-family:' + style.fontFamily + ';font-size:' + style.fontSize
        );
        temp.innerHTML = 'test';
        parentNode.appendChild(temp);
        lineHeight = temp.clientHeight;
        parentNode.removeChild(temp);
      }
      return lineHeight;
    }
  });

  $.fn.textcomplete.Textarea = Textarea;
}(jQuery);

+function ($) {
  'use strict';

  function ContentEditable (element, completer, option) {
    this.initialize(element, completer, option);
  }

  ContentEditable.prototype = new $.fn.textcomplete.Input();

  $.extend(ContentEditable.prototype, {
    // Private methods
    // ---------------

    select: function (value, strategy) {
      var pre = this._getTextFromHeadToCaret();
      var sel = window.getSelection()
      var range = sel.getRangeAt(0);
      var selection = range.cloneRange();
      selection.selectNodeContents(range.startContainer);
      var content = selection.toString();
      var post = content.substring(range.startOffset);
      var newSubstr = strategy.replace(value);
      if ($.isArray(newSubstr)) {
        post = newSubstr[1] + post;
        newSubstr = newSubstr[0];
      }
      pre = pre.replace(strategy.match, newSubstr);
      range.selectNodeContents(range.startContainer);
      range.deleteContents();
      var node = document.createTextNode(pre + post);
      range.insertNode(node);
      range.setStart(node, pre.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    },

    // Private methods
    // ---------------

    _getCaretRelativePosition: function () {
      var range = window.getSelection().getRangeAt(0).cloneRange();
      var node = document.createElement('span');
      range.insertNode(node);
      range.selectNodeContents(node);
      range.deleteContents();
      var $node = $(node);
      var position = $node.offset();
      position.left -= this.$el.offset().left;
      position.top += $node.height() - this.$el.offset().top;
      position.lineHeight = $node.height();
      var dir = this.$el.attr('dir') || this.$el.css('direction');
      if (dir === 'rtl') { position.left -= this.listView.$el.width(); }
      return position;
    },

    _getTextFromHeadToCaret: function () {
      var range = window.getSelection().getRangeAt(0);
      var selection = range.cloneRange();
      selection.selectNodeContents(range.startContainer);
      return selection.toString().substring(0, range.startOffset);
    }
  });

  $.fn.textcomplete.ContentEditable = ContentEditable;
}(jQuery);

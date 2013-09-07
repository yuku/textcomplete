$(function () {

  var setText = function (textarea, text) {
    var range;
    textarea.focus();
    if (typeof textarea.selectionStart === 'number') {
      textarea.value = text;
      textarea.selectionStart = textarea.selectionEnd = 3;
      return;
    }
    range = textarea.createTextRange();
    range.text = text
    range.select();
  }

  var startsWith = String.prototype.startsWith || function (str, position) {
    position = position || 0;
    return ('' + this).indexOf(str, position) === position;
  };

  var $textarea = $('textarea').textcomplete({
    // emoji strategy
    emoji: {
      match: /(^|\s):([\-+\w]*)$/,
      search: function (term, callback) {
        callback($.map(emojies, function (emoji) {
          return startsWith.call(emoji, term) ? emoji : null;
        }));
      },
      template: function (value) {
        return '<img src="media/images/emoji/' + value + '.png"></img>' + value;
      },
      replace: function (value) {
        return '$1:' + value + ': ';
      },
      maxCount: 5
    }
  });

  setText($textarea.get(0), ':a');
  $textarea.keyup();
});

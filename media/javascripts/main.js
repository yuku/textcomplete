$(function () {

  var $textarea = $('textarea').textcomplete({
    // emoji strategy
    emoji: {
      match: /(^|\s):(\w*)$/,
      search: function (term, callback) {
        var regexp = new RegExp('^' + term);
        callback($.map(emojies, function (emoji) {
          return regexp.test(emoji) ? emoji : null;
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


  var textarea = $textarea.get(0);

  textarea.value = ':a';
  textarea.selectionStart = textarea.selectionEnd = 3;
  textarea.focus();
  $textarea.keyup();
});

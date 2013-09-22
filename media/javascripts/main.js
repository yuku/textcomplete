$(function () {

  $('.script').each(function () {
    eval($(this).text());
  });

  var setText = function ($textarea, text) {
    var range, textarea = $textarea.get(0);
    textarea.focus();
    if (typeof textarea.selectionStart === 'number') {
      textarea.value = text;
      textarea.selectionStart = textarea.selectionEnd = text.length;
      return;
    }
    range = textarea.createTextRange();
    range.text = text
    range.select();
  }

  var $textarea1 = $('#textarea1');
  setText($textarea1, ':a');
  $textarea1.keyup();
  SyntaxHighlighter.all();
});

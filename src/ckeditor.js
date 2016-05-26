// NOTE: TextComplete plugin has contenteditable support but it does not work
//       fine especially on old IEs.
//       Any pull requests are REALLY welcome.

+function ($) {
  'use strict';

  // CKEditor adapter
  // =======================
  //
  // Adapter for CKEditor, based on contenteditable elements.
  function CKEditor (element, completer, option) {
    this.initialize(element, completer, option);
  }

  $.extend(CKEditor.prototype, $.fn.textcomplete.ContentEditable.prototype, {
    _bindEvents: function () {
      var $this = this;
      CKEDITOR.instances["issue_notes"].on('key', function(event) {
        var domEvent = event.data;
        $this._onKeyup(domEvent);
        if ($this.completer.dropdown.shown && $this._skipSearch(domEvent)) {
          return false;
        }
      }, null, null, 1); // 1 = Priority = Important!
    },
  });

  $.fn.textcomplete.CKEditor = CKEditor;
}(jQuery);

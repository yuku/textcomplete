import ContentEditable from '../textcomplete.contenteditable';
import Textcomplete from 'textcomplete';
import hljs from 'highlight.js';

global.Textcomplete = Textcomplete;
global.Textcomplete.editors = { ContentEditable: ContentEditable };

hljs.initHighlightingOnLoad();

(function () {
  let els = document.getElementsByClassName('auto-eval');
  for (let i = 0, l = els.length; i < l; i++) {
    let el = els[i];
    eval(`(function () {${el.innerText || el.textContent}})()`);
  }
})()

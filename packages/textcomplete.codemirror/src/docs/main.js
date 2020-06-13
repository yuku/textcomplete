import CodeMirror from 'codemirror';
import CodeMirrorEditor from '../textcomplete.codemirror';
import Textcomplete from 'textcomplete';
import hljs from 'highlight.js';
import langs from './langs';

require('codemirror/mode/gfm/gfm.js');

global.CodeMirror = CodeMirror;
global.Textcomplete = Textcomplete;
global.Textcomplete.editors = { CodeMirror: CodeMirrorEditor };
global.langs = langs;

hljs.initHighlightingOnLoad();

function initializeTextcompletes() {
  let els = document.getElementsByClassName('auto-eval');
  for (let i = 0, l = els.length; i < l; i++) {
    let el = els[i];
    eval(`(function () {${el.innerText || el.textContent}})()`);
  }
}

window.addEventListener('DOMContentLoaded', initializeTextcompletes);

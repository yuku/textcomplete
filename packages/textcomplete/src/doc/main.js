require('./main.css');

import { Textarea, Textcomplete } from '../index';
import hljs from 'highlight.js';

global.Textarea = Textarea;
global.Textcomplete = Textcomplete;

hljs.initHighlightingOnLoad();

function initializeTextcompletes() {
  let els = document.getElementsByClassName('auto-eval');
  for (let i = 0, l = els.length; i < l; i++) {
    let el = els[i];
    eval(`(function () {${el.innerText || el.textContent}})()`);
  }
}

function runDemo() {
  ['textarea1', 'textarea2', 'textarea3'].forEach(id => {
    let textarea = document.getElementById(id);
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
    let event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    event.keyCode = 65;
    textarea.dispatchEvent(event);
  });

  document.getElementById('textarea1').focus();
}

window.addEventListener('DOMContentLoaded', initializeTextcompletes);
window.addEventListener('load', runDemo);

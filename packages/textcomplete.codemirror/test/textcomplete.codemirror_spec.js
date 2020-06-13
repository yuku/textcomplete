require('./test_helper');

import CodeMirror from '../src/textcomplete.codemirror';

import isNumber from 'lodash.isnumber';

const assert = require('power-assert');

describe('CodeMirror', function () {
  var cm, editor;

  beforeEach(function () {
    var cursorDiv = document.createElement('div');
    cursorDiv.appendChild(document.createElement('div'));
    cm = {
      display: {cursorDiv},
      doc: {
        getCursor: function () { return { line: 0, ch: 0 }; },
        getValue: function () { return ''; },
        lineSeparator: function () { return '\n'; },
        setCursor: function () {},
        setValue: function () {},
      },
      focus: function () {},
      on: function () {},
      off: function () {},
    };
    editor = new CodeMirror(cm);
  });

  context('when keydown event occurs', function () {
    var event;

    beforeEach(function () {
      event = document.createEvent('UIEvents');
      event.initEvent('keydown', true, true);
    });

    function subject() {
      return editor.onKeydown(cm, event);
    }

    [
      [38, 'UP', false, 'up'],
      [40, 'DOWN', false, 'down'],
      [78, 'DOWN', true, 'ctrl-n'],
      [80, 'UP', true, 'ctrl-p'],
    ].forEach(([keyCode, code, ctrlKey, name]) => {
      context(`and it is a ${name} key`, function () {
        beforeEach(function () {
          event.keyCode = keyCode;
          event.ctrlKey = ctrlKey;
        });

        it(`should emit a ${code} move event`, function () {
          var spy = this.sinon.spy();
          editor.on('move', spy);
          subject();
          assert(spy.calledOnce);
          assert(spy.args[0][0].detail.code === code);
        });

        it('should prevent the keydown event when move event is prevented', function () {
          editor.on('move', e => { e.preventDefault(); });
          subject();
          assert(event.defaultPrevented);
        });
      });
    });

    [[9, 'tab'], [13, 'enter']].forEach(([keyCode, name]) => {
      context(`and it is a ${name} key`, function () {
        beforeEach(function () {
          event.keyCode = keyCode;
        });

        it('should emit a enter event', function () {
          var spy = this.sinon.spy();
          editor.on('enter', spy);
          subject();
          assert(spy.calledOnce);
        });
      });
    });

    context('and it is a normal key', function () {
      beforeEach(function () {
        event.keyCode = 65;
      });

      it('should not emit a move event', function () {
        var spy = this.sinon.spy();
        editor.on('move', spy);
        subject();
        assert(!spy.called);
      });
    });
  });

  context('when keyup event occurs', function () {
    var event;

    function subject() {
      return editor.onKeyup(cm, event);
    }

    beforeEach(function () {
      event = document.createEvent('UIEvents');
      event.initEvent('keyup', true, true);
    });

    context('and it is a move key', function () {
      beforeEach(function () {
        event.keyCode = 40; // down
      });

      it('should not emit a change event', function () {
        var spy = this.sinon.spy();
        editor.on('change', spy);
        subject();
        assert(!spy.called);
      });
    });

    context('and it is not a move key', function () {
      beforeEach(function () {
        event.keyCode = 65;
      });

      it('should emit a change event', function () {
        cm.doc.getValue = function () {
          return 'hello world';
        };
        cm.doc.getCursor = function () {
          return { line: 0, ch: 3 };
        };
        var spy = this.sinon.spy();
        editor.on('change', spy);
        subject();
        assert(spy.calledOnce);
        assert(spy.args[0][0].detail.beforeCursor === 'hel');
      });
    });
  });

  describe('#destroy', function () {
    function subject() {
      return editor.destroy();
    }

    it('should return itself', function () {
      assert.strictEqual(subject(), editor);
    });
  });

  describe('#applySearchResult', function () {
    var searchResult;

    function subject() {
      return editor.applySearchResult(searchResult);
    }

    context('when searchResult.replace returns an array', function () {
      beforeEach(function () {
        searchResult = { replace: function () { return ['hello', 'world']; } };
      });

      it('should not throw error', function () {
        subject();
      });
    });

    context('when searchResult.replace returns null', function () {
      beforeEach(function () {
        searchResult = { replace: function () { return null; } };
      });

      it('should not throw error', function () {
        subject();
      });
    });
  });

  describe('#getCursorOffset', function () {
    function subject() {
      return editor.getCursorOffset();
    }

    it('should return an object with top and left number properties', function () {
      var result = subject();
      assert(isNumber(result.top));
      assert(isNumber(result.left));
    });
  });

  describe('#getBeforeCursor', function () {
    beforeEach(function () {
      cm.doc.getCursor = function () {
        return { line: 1, ch: 2 };
      };
      cm.doc.getValue = function () {
        return 'hello\ntextcomplete\ncodemirror!';
      };
    });

    function subject() {
      return editor.getBeforeCursor();
    }

    it('should return string between head to cursor', function () {
      assert.equal(subject(), 'hello\nte');
    });
  });

  describe('#getAfterCursor', function () {
    beforeEach(function () {
      cm.doc.getCursor = function () {
        return { line: 1, ch: 2 };
      };
      cm.doc.getValue = function () {
        return 'hello\ntextcomplete\ncodemirror!';
      };
    });

    function subject() {
      return editor.getAfterCursor();
    }

    it('should return string between cursor to tail', function () {
      assert.equal(subject(), 'xtcomplete\ncodemirror!');
    });
  });
});

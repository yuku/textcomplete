require("../test_helper")

import { createTextarea, createSearchResult } from "../test_utils"
import isNumber from "lodash.isnumber"

const assert = require("power-assert")

describe("Textarea", function() {
  var textarea

  beforeEach(function() {
    textarea = createTextarea()
    document.body.appendChild(textarea.el)
  })

  afterEach(function() {
    document.body.removeChild(textarea.el)
  })

  context("when a keydown event occurs", function() {
    var event

    function subject() {
      return textarea.el.dispatchEvent(event)
    }

    beforeEach(function() {
      event = document.createEvent("UIEvents")
      event.initEvent("keydown", true, true)
    })
    ;[
      [38, "UP", false, "up"],
      [40, "DOWN", false, "down"],
      [78, "DOWN", true, "ctrl-n"],
      [80, "UP", true, "ctrl-p"],
    ].forEach(([keyCode, code, ctrlKey, name]) => {
      context(`and it is a ${name} key`, function() {
        beforeEach(function() {
          event.keyCode = keyCode
          event.ctrlKey = ctrlKey
        })

        it(`should emit a ${code} move event`, function() {
          var spy = this.sinon.spy()
          textarea.on("move", spy)
          subject()
          assert(spy.calledOnce)
          assert.strictEqual(spy.args[0][0].detail.code, code)
        })
      })
    })
    ;[[9, "tab"], [13, "enter"]].forEach(([keyCode, name]) => {
      context(`and it is a ${name} key`, function() {
        beforeEach(function() {
          event.keyCode = keyCode
        })

        it("should emit a enter event", function() {
          var spy = this.sinon.spy()
          textarea.on("enter", spy)
          subject()
          assert(spy.calledOnce)
        })
      })
    })

    context("and it is a normal key", function() {
      beforeEach(function() {
        event.keyCode = 65
      })

      it("should not emit a move event", function() {
        var spy = this.sinon.spy()
        textarea.on("move", spy)
        subject()
        assert(!spy.called)
      })
    })
  })

  context("when a keyup event occurs", function() {
    var event

    function subject() {
      return textarea.el.dispatchEvent(event)
    }

    beforeEach(function() {
      event = document.createEvent("UIEvents")
      event.initEvent("keyup", true, true)
    })
    ;[
      [16, false, "shift"],
      [17, false, "ctrl"],
      [18, false, "alt"],
      [38, false, "up"],
      [40, false, "down"],
      [78, true, "ctrl-n"],
      [80, true, "ctrl-p"],
      [91, false, "command"],
    ].forEach(([keyCode, ctrlKey, name]) => {
      context(`and it is a ${name} key`, function() {
        beforeEach(function() {
          event.keyCode = keyCode
          event.ctrlKey = ctrlKey
        })

        it("should not emit a change event", function() {
          const spy = this.sinon.spy()
          textarea.on("change", spy)
          subject()
          assert(!spy.called)
        })
      })
    })
  })

  describe("#applySearchResult", function() {
    var searchResult

    beforeEach(function() {
      searchResult = createSearchResult()
    })

    context("when SearchResult#replace returns null", function() {
      beforeEach(function() {
        this.sinon.stub(searchResult, "replace").callsFake(function() {
          return null
        })
      })

      it("should not change #el.value", function() {
        var prevValue = (textarea.el.value = "previous value")
        textarea.applySearchResult(searchResult)
        assert.equal(textarea.el.value, prevValue)
      })

      it("should not change #el.selectionStart and selectionEnd", function() {
        textarea.el.value = "value"
        var prevValue = (textarea.el.selectionStart = textarea.el.selectionEnd = 3)
        textarea.applySearchResult(searchResult)
        assert.equal(textarea.el.selectionStart, prevValue)
        assert.equal(textarea.el.selectionEnd, prevValue)
      })
    })

    context(
      "when SearchResult#replace returns an array of strings",
      function() {
        beforeEach(function() {
          this.sinon.stub(searchResult, "replace").callsFake(function() {
            return ["before", "after"]
          })
          textarea.el.value = "previous value"
        })

        it("should change #el.value", function() {
          textarea.applySearchResult(searchResult)
          assert.equal(textarea.el.value, "beforeafter")
        })

        it("should change #el.selectionStart and selectionEnd", function() {
          textarea.applySearchResult(searchResult)
          assert.equal(textarea.el.selectionStart, "before".length)
          assert.equal(textarea.el.selectionEnd, "before".length)
        })

        it("should trigger an input event on #el", function() {
          var changeTriggered = false
          textarea.el.addEventListener("input", function() {
            changeTriggered = true
          })
          textarea.applySearchResult(searchResult)
          assert(changeTriggered)
        })
      },
    )
  })

  describe("#getCursorOffset", function() {
    var textareaEl

    beforeEach(function() {
      textareaEl = textarea.el
    })

    function subject() {
      return textarea.getCursorOffset()
    }

    context('when dir attribute of the element is "ltr"', function() {
      beforeEach(function() {
        textareaEl.dir = "ltr"
      })

      it("should return an object with top and left properties", function() {
        var result = subject()
        ;["top", "left", "lineHeight", "clientTop"].forEach(name => {
          assert(isNumber(result[name]))
        })
        assert(!result.hasOwnProperty("right"))
      })
    })

    context('when dir attribute of the element is "rtl"', function() {
      beforeEach(function() {
        textareaEl.dir = "rtl"
      })

      it("should return an object with top and right properties", function() {
        var result = subject()
        ;["top", "right", "lineHeight", "clientTop"].forEach(name => {
          assert(isNumber(result[name]))
        })
        assert(!result.hasOwnProperty("left"))
      })
    })
  })
})

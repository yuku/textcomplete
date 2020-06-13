require("../test_helper")

import Textcomplete from "../../src/textcomplete"
import Strategy from "../../src/strategy"
import { createCustomEvent } from "../../src/utils"
import { createTextarea, createSearchResult } from "../test_utils"

const assert = require("power-assert")

describe("Textcomplete", function() {
  var editor, textcomplete

  beforeEach(function() {
    editor = createTextarea()
    textcomplete = new Textcomplete(editor)
  })

  describe("#destroy", function() {
    it("should return itself", function() {
      assert.strictEqual(textcomplete.destroy(), textcomplete)
    })

    context("when true is given", function() {
      ;["editor", "completer", "dropdown"].forEach(prop => {
        it(`should destroy its ${prop}`, function() {
          var stub = this.sinon.stub(textcomplete[prop], "destroy")
          textcomplete.destroy(true)
          assert(stub.calledOnce)
        })
      })
    })

    context("when false is given", function() {
      it("should not destroy its editor", function() {
        var stub = this.sinon.stub(textcomplete.editor, "destroy")
        textcomplete.destroy(false)
        assert(!stub.called)
      })
      ;["completer", "dropdown"].forEach(prop => {
        it(`should destroy its ${prop}`, function() {
          var stub = this.sinon.stub(textcomplete[prop], "destroy")
          textcomplete.destroy(false)
          assert(stub.calledOnce)
        })
      })
    })
  })

  describe("#hide", function() {
    function subject() {
      return textcomplete.hide()
    }

    it("should return itself", function() {
      assert.strictEqual(subject(), textcomplete)
    })

    it("should deactivate dropdown", function() {
      var stub = this.sinon.stub(textcomplete.dropdown, "deactivate")

      subject()
      assert(stub.calledOnce)
    })
  })

  describe("#register", function() {
    var props

    function subject() {
      return textcomplete.register([props])
    }

    beforeEach(function() {
      props = {}
    })

    it("should return itself", function() {
      assert.strictEqual(subject(), textcomplete)
    })

    it("should call Completer#registerStrategy", function() {
      var stub = this.sinon.stub(textcomplete.completer, "registerStrategy")
      subject()
      assert(stub.calledOnce)
      assert(stub.calledWith(this.sinon.match.instanceOf(Strategy)))
      assert(stub.calledWith(this.sinon.match.hasOwn("props", props)))
    })
  })

  describe("#trigger", function() {
    it("should return itself", function() {
      assert.strictEqual(textcomplete.trigger(""), textcomplete)
    })

    it("should listen Editor#change", function() {
      var stub = this.sinon.stub(textcomplete, "trigger")
      editor.emit("change", { detail: { beforeCursor: "" } })
      assert(stub.calledOnce)
    })

    it("should call #completer.run exclusively", function() {
      var stub = this.sinon.stub(textcomplete.completer, "run")

      textcomplete.trigger("a")
      textcomplete.trigger("b")
      assert(stub.calledOnce)
      assert(stub.calledWith("a"))

      textcomplete.handleHit({ searchResults: [] })
      assert(stub.calledTwice) // Replay
      assert(stub.calledWith("b"))

      textcomplete.handleHit({ searchResults: [] })
      textcomplete.trigger("c")
      assert(stub.calledThrice)
      assert(stub.calledWith("c"))

      textcomplete.trigger("d")
      assert(stub.calledThrice)
    })
  })

  describe("events", function() {
    ;[
      "show",
      "shown",
      "render",
      "rendered",
      "selected",
      "hide",
      "hidden",
    ].forEach(eventName => {
      context(`when Dropdown#${eventName} occurs`, function() {
        function subject() {
          textcomplete.dropdown.emit(eventName)
        }

        it("should emit a same event on Textcomplete", function() {
          var spy = this.sinon.spy()
          textcomplete.on(eventName, spy)
          subject()
          assert(spy.calledOnce)
        })
      })
    })

    context("when Dropdown#select occurs", function() {
      it("should emit a same event on Textcomplete", function() {
        var searchResult = createSearchResult()
        var event = createCustomEvent("select", { detail: { searchResult } })
        var spy = this.sinon.spy()
        textcomplete.on("select", spy)
        try {
          textcomplete.dropdown.emit("select", event)
        } catch (_) {
          // eventemitter3 throws an error here on Firefox. I don't know why
        }
        assert(spy.calledOnce)
      })
    })
  })
})

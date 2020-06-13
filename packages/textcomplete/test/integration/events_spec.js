require("../test_helper")

import Textcomplete from "../../src/textcomplete"
import Textarea from "../../src/textarea"

import { Keyboard } from "keysim"

const assert = require("power-assert")
const keyboard = Keyboard.US_ENGLISH

describe("Textcomplete events", function() {
  var textareaEl, textarea, textcomplete

  beforeEach(function() {
    textareaEl = document.createElement("textarea")
    document.body.appendChild(textareaEl)
    textarea = new Textarea(textareaEl)
    textcomplete = new Textcomplete(textarea)
    textcomplete.register([
      {
        usernames: ["aby"],
        match: /(\s|^)@(\w+)$/,
        search: function(term, callback) {
          callback(this.usernames.filter(username => username.startsWith(term)))
        },
        replace: function(username) {
          return `$1@${username} `
        },
      },
    ])
  })

  afterEach(function() {
    textcomplete.destroy()
    document.body.removeChild(textareaEl)
  })

  function assertCalled(spy) {
    assert(spy.calledOnce)
  }

  function assertNotCalled(spy) {
    assert(!spy.called)
  }

  it("should be emitted", function() {
    var showSpy = this.sinon.spy()
    var shownSpy = this.sinon.spy()
    var renderedSpy = this.sinon.spy()
    var hideSpy = this.sinon.spy()
    var hiddenSpy = this.sinon.spy()

    textcomplete
      .on("show", showSpy)
      .on("shown", shownSpy)
      .on("rendered", renderedSpy)
      .on("hide", hideSpy)
      .on("hidden", hiddenSpy)

    function reset() {
      ;[showSpy, shownSpy, renderedSpy, hideSpy, hiddenSpy].forEach(spy =>
        spy.reset(),
      )
    }

    textareaEl.value = "Hi, @"
    textareaEl.selectionStart = textareaEl.selectionEnd = 5
    keyboard.dispatchEventsForInput("Hi, @", textareaEl)
    ;[showSpy, shownSpy, renderedSpy, hideSpy, hiddenSpy].forEach(
      assertNotCalled,
    )
    reset()

    textareaEl.value = "Hi, @a"
    textareaEl.selectionStart = textareaEl.selectionEnd = 6
    keyboard.dispatchEventsForInput("a", textareaEl)
    ;[showSpy, shownSpy, renderedSpy].forEach(assertCalled)
    ;[hideSpy, hiddenSpy].forEach(assertNotCalled)
    reset()

    textareaEl.value = "Hi, @ab"
    textareaEl.selectionStart = textareaEl.selectionEnd = 7
    keyboard.dispatchEventsForInput("b", textareaEl)
    ;[renderedSpy].forEach(assertCalled)
    ;[showSpy, shownSpy, hideSpy, hiddenSpy].forEach(assertNotCalled)
    reset()

    keyboard.dispatchEventsForAction("escape", textareaEl)
    ;[hideSpy, hiddenSpy].forEach(assertCalled)
    ;[showSpy, shownSpy, renderedSpy].forEach(assertNotCalled)
    reset()

    textareaEl.value = "Hi, @a"
    textareaEl.selectionStart = textareaEl.selectionEnd = 6
    keyboard.dispatchEventsForAction("backspace", textareaEl)
    ;[showSpy, shownSpy, renderedSpy].forEach(assertCalled)
    ;[hideSpy, hiddenSpy].forEach(assertNotCalled)
    reset()

    textareaEl.value = "Hi, @"
    textareaEl.selectionStart = textareaEl.selectionEnd = 5
    keyboard.dispatchEventsForAction("backspace", textareaEl)
    ;[hideSpy, hiddenSpy].forEach(assertCalled)
    ;[showSpy, shownSpy, renderedSpy].forEach(assertNotCalled)
    reset()
  })
})

require("../test_helper")

import Textcomplete from "../../src/textcomplete"
import Textarea from "../../src/textarea"

import { Keyboard } from "keysim"

const assert = require("power-assert")
const keyboard = Keyboard.US_ENGLISH

describe("Integration test", function() {
  var textareaEl, textarea, textcomplete

  beforeEach(function() {
    textareaEl = document.createElement("textarea")
    document.body.appendChild(textareaEl)
    textarea = new Textarea(textareaEl)
    textcomplete = new Textcomplete(textarea)
    textcomplete.register([
      {
        usernames: ["alice", "amanda", "bob", "carol", "dave"],
        match: /(^|\s)@(\w+)$/,
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

  function expectDropdownIsShown() {
    var dropdownEl = document.querySelector(
      ".dropdown-menu.textcomplete-dropdown",
    )
    var computed = window.getComputedStyle(dropdownEl)
    assert.equal(computed.display, "block")
  }

  function expectDropdownIsHidden() {
    var dropdownEl = document.querySelector(
      ".dropdown-menu.textcomplete-dropdown",
    )
    var computed = window.getComputedStyle(dropdownEl)
    assert.equal(computed.display, "none")
  }

  it("should work with keyboard", function() {
    textareaEl.value = "Hi, @"
    textareaEl.selectionStart = textareaEl.selectionEnd = 5
    keyboard.dispatchEventsForInput("Hi, @", textareaEl)
    expectDropdownIsHidden()

    textareaEl.value = "Hi, @a"
    textareaEl.selectionStart = textareaEl.selectionEnd = 6
    keyboard.dispatchEventsForInput("a", textareaEl)
    expectDropdownIsShown()

    textareaEl.value = "Hi, @ab"
    textareaEl.selectionStart = textareaEl.selectionEnd = 7
    keyboard.dispatchEventsForInput("b", textareaEl)
    expectDropdownIsHidden()

    textareaEl.value = "Hi, @a"
    textareaEl.selectionStart = textareaEl.selectionEnd = 6
    keyboard.dispatchEventsForAction("backspace", textareaEl)
    expectDropdownIsShown()

    textareaEl.value = "Hi, @al"
    textareaEl.selectionStart = textareaEl.selectionEnd = 7
    keyboard.dispatchEventsForInput("l", textareaEl)
    expectDropdownIsShown()

    textareaEl.value = "Hi, @a"
    textareaEl.selectionStart = textareaEl.selectionEnd = 6
    keyboard.dispatchEventsForAction("backspace", textareaEl)
    expectDropdownIsShown()

    keyboard.dispatchEventsForAction("down", textareaEl)
    expectDropdownIsShown()

    keyboard.dispatchEventsForAction("up", textareaEl)
    expectDropdownIsShown()

    keyboard.dispatchEventsForAction("down", textareaEl)
    expectDropdownIsShown()

    keyboard.dispatchEventsForAction("enter", textareaEl)
    expectDropdownIsHidden()

    assert.equal(textareaEl.value, "Hi, @alice ")
    assert.equal(textareaEl.selectionStart, 11)
    assert.equal(textareaEl.selectionEnd, 11)
  })

  xit("should work with touch event", function() {
    textareaEl.value = "Hi, @"
    textareaEl.selectionStart = textareaEl.selectionEnd = 5
    keyboard.dispatchEventsForInput("Hi, @", textareaEl)
    expectDropdownIsHidden()

    textareaEl.value = "Hi, @a"
    textareaEl.selectionStart = textareaEl.selectionEnd = 6
    keyboard.dispatchEventsForInput("a", textareaEl)
    expectDropdownIsShown()

    var dropdownItemEl = document.querySelector(".textcomplete-item")
    var clickEvent = document.createEvent("TouchEvent")
    clickEvent.initEvent("touchstart", true, true)
    dropdownItemEl.dispatchEvent(clickEvent)
    expectDropdownIsHidden()
    assert.equal(textareaEl.value, "Hi, @alice ")
    assert.equal(textareaEl.selectionStart, 11)
    assert.equal(textareaEl.selectionEnd, 11)
  })

  it("should work with mousedown event", function() {
    textareaEl.value = "Hi, @"
    textareaEl.selectionStart = textareaEl.selectionEnd = 5
    keyboard.dispatchEventsForInput("Hi, @", textareaEl)
    expectDropdownIsHidden()

    textareaEl.value = "Hi, @a"
    textareaEl.selectionStart = textareaEl.selectionEnd = 6
    keyboard.dispatchEventsForInput("a", textareaEl)
    expectDropdownIsShown()

    var dropdownItemEl = document.querySelector(".textcomplete-item")
    var clickEvent = document.createEvent("MouseEvent")
    clickEvent.initEvent("mousedown", true, true)
    dropdownItemEl.dispatchEvent(clickEvent)
    expectDropdownIsHidden()
    assert.equal(textareaEl.value, "Hi, @alice ")
    assert.equal(textareaEl.selectionStart, 11)
    assert.equal(textareaEl.selectionEnd, 11)
  })

  it("should work with mouseover event", function() {
    textareaEl.value = "Hi, @"
    textareaEl.selectionStart = textareaEl.selectionEnd = 5
    keyboard.dispatchEventsForInput("Hi, @", textareaEl)
    expectDropdownIsHidden()

    textareaEl.value = "Hi, @a"
    textareaEl.selectionStart = textareaEl.selectionEnd = 6
    keyboard.dispatchEventsForInput("a", textareaEl)
    expectDropdownIsShown()

    var dropdownItemEls = document.querySelectorAll(".textcomplete-item")
    var lastEl = dropdownItemEls[dropdownItemEls.length - 1]
    var mouseEvent = document.createEvent("MouseEvent")
    mouseEvent.initEvent("mouseover", true, true)
    assert(lastEl.getAttribute("class").indexOf("active") === -1)
    lastEl.dispatchEvent(mouseEvent)
    assert(lastEl.getAttribute("class").indexOf("active") !== -1)
  })
})

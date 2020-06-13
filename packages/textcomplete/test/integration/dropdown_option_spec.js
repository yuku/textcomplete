require("../test_helper")

import Textcomplete from "../../src/textcomplete"
import Textarea from "../../src/textarea"
import { DEFAULT_CLASS_NAME } from "../../src/dropdown_item"

import { Keyboard } from "keysim"

const assert = require("power-assert")
const keyboard = Keyboard.US_ENGLISH

describe("Dropdown options integration test", function() {
  var textareaEl, textarea

  beforeEach(function() {
    textareaEl = document.createElement("textarea")
    document.body.appendChild(textareaEl)
    textarea = new Textarea(textareaEl)
  })

  afterEach(function() {
    textarea.destroy()
    document.body.removeChild(textareaEl)
  })

  function setup(option, strategy) {
    var textcomplete = new Textcomplete(textarea, { dropdown: option })
    textcomplete.register([strategy])
    return textcomplete
  }

  describe("className", function() {
    it("should be set as class attribute of dropdown element", function() {
      var className = "hello-world"
      setup(
        { className },
        {
          usernames: ["alice"],
          match: /(\w+)$/,
          search: function(term, callback) {
            callback(
              this.usernames.filter(username => username.startsWith(term)),
            )
          },
          replace: function(username) {
            return `$1@${username} `
          },
        },
      )

      textareaEl.value = "@a"
      textareaEl.selectionStart = textareaEl.selectionEnd = 2
      keyboard.dispatchEventsForInput("@a", textareaEl)

      var dropdownEl = document.getElementsByClassName(className)
      assert.equal(dropdownEl.length, 1)
    })
  })

  describe("style", function() {
    it("should be set as style attribute of dropdown element", function() {
      setup(
        { style: { backgroundColor: "#f0f" } },
        {
          usernames: ["alice"],
          match: /(\w+)$/,
          search: function(term, callback) {
            callback(
              this.usernames.filter(username => username.startsWith(term)),
            )
          },
          replace: function(username) {
            return `$1@${username} `
          },
        },
      )

      textareaEl.value = "@a"
      textareaEl.selectionStart = textareaEl.selectionEnd = 2
      keyboard.dispatchEventsForInput("@a", textareaEl)

      var dropdownEl = document.getElementsByClassName(
        "textcomplete-dropdown",
      )[0]
      assert.equal(dropdownEl.style.backgroundColor, "rgb(255, 0, 255)")
    })
  })

  describe("maxCount", function() {
    it("should truncate the items of dropdown", function() {
      var maxCount = 3
      setup(
        { maxCount },
        {
          match: /(\s|^)@(\w+)$/,
          search: function(term, callback) {
            callback([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
          },
          replace: function(value) {
            return value
          },
        },
      )

      textareaEl.value = "@a"
      textareaEl.selectionStart = textareaEl.selectionEnd = 2
      keyboard.dispatchEventsForInput("@a", textareaEl)

      var items = document.getElementsByClassName(DEFAULT_CLASS_NAME)
      assert.equal(items.length, maxCount)
    })
  })

  describe("rotate", function() {
    context("when it is false", function() {
      var textcomplete

      beforeEach(function() {
        textcomplete = setup(
          { rotate: false },
          {
            match: /(\s|^)@(\w+)$/,
            search: function(term, callback) {
              callback([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
            },
            replace: function(value) {
              return value
            },
          },
        )

        textareaEl.value = "@a"
        textareaEl.selectionStart = textareaEl.selectionEnd = 2
        keyboard.dispatchEventsForInput("@a", textareaEl)
      })

      it("should not rotate on up key", function() {
        // Activate the first dropdown item.
        var firstItem = textcomplete.dropdown.items[0].activate()
        keyboard.dispatchEventsForAction("up", textareaEl)
        assert(firstItem.active)
      })

      it("should not rotate on down key", function() {
        // Activate the last dropdown item.
        var dropdownItems = textcomplete.dropdown.items
        var lastItem = dropdownItems[dropdownItems.length - 1].activate()
        keyboard.dispatchEventsForAction("down", textareaEl)
        assert(lastItem.active)
      })
    })
  })
})

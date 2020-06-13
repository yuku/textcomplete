require("../test_helper")

import Textcomplete from "../../src/textcomplete"
import Textarea from "../../src/textarea"

import { Keyboard } from "keysim"

const assert = require("power-assert")
const keyboard = Keyboard.US_ENGLISH

describe("Dropdown item options integration test", function() {
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
    var textcomplete = new Textcomplete(textarea, {
      dropdown: { item: option },
    })
    textcomplete.register([strategy])
    return textcomplete
  }

  describe("className", function() {
    it("should be set as class attribute of dropdown item element", function() {
      var className = "hello-world-item"
      setup(
        { className },
        {
          usernames: ["alice"],
          match: /(^|\s)@(\w+)$/,
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

      var dropdownItemEl = document.getElementsByClassName(className)
      assert.equal(dropdownItemEl.length, 1)
    })
  })
})

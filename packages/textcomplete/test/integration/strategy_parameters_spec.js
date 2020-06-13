require("../test_helper")

import Textcomplete from "../../src/textcomplete"
import Textarea from "../../src/textarea"

const assert = require("power-assert")

describe("Strategy parameters integration tests", function() {
  var textcomplete, textareaEl, textarea

  beforeEach(function() {
    textareaEl = document.createElement("textarea")
    document.body.appendChild(textareaEl)
    textarea = new Textarea(textareaEl)
  })

  afterEach(function() {
    textcomplete.destroy()
    document.body.removeChild(textareaEl)
  })

  function setup(strategy) {
    textcomplete = new Textcomplete(textarea)
    textcomplete.register([strategy])
  }

  describe("id", function() {
    context("when id parameter is given", function() {
      var id = "strategy-id"

      beforeEach(function() {
        setup({
          id: id,
          usernames: ["alice"],
          match: /(\n|^)@(\w+)$/,
          search: function(term, callback) {
            callback(
              this.usernames.filter(username => username.startsWith(term)),
            )
          },
          replace: function(username) {
            return `$1@${username} `
          },
        })
      })

      it("should set data-strategy attribute to the dropdown's element", function() {
        textcomplete.trigger("@ali")
        assert.equal(textcomplete.dropdown.el.getAttribute("data-strategy"), id)
      })
    })

    context("when id parameter is not given", function() {
      beforeEach(function() {
        setup({
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
        })
      })

      it("should not set data-strategy attribute to the dropdown's element", function() {
        textcomplete.trigger("@ali")
        assert(!textcomplete.dropdown.el.hasAttribute("data-strategy"))
      })
    })
  })
})

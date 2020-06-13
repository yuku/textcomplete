require("../test_helper")

import { createCustomEvent } from "../../src/utils"

const assert = require("power-assert")

describe("createCustomEvent", function() {
  it("should return a CustomEvent", function() {
    var event = createCustomEvent("hello")
    assert(event instanceof document.defaultView.CustomEvent)
    assert.equal(event.type, "hello")
  })

  context("without options", function() {
    it("should not be able to prevent default", function() {
      var event = createCustomEvent("hello")
      event.preventDefault()
      assert(!event.defaultPrevented)
    })

    it("should not have detail", function() {
      var event = createCustomEvent("hello")
      assert.equal(event.detail, null)
    })
  })

  context("with truthy cancelable", function() {
    it("should be able to prevent default", function() {
      var event = createCustomEvent("hello", { cancelable: true })
      event.preventDefault()
      assert(event.defaultPrevented)
    })
  })

  context("with detail", function() {
    it("should be able to prevent default", function() {
      var detail = {}
      var event = createCustomEvent("hello", { detail })
      assert.strictEqual(event.detail, detail)
    })
  })
})

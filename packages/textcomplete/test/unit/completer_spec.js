require("../test_helper")

import Completer from "../../src/completer"
import { createStrategy, createQuery } from "../test_utils"

const assert = require("power-assert")

describe("Completer", function() {
  var completer

  beforeEach(function() {
    completer = new Completer()
  })

  describe("#strategies", function() {
    it("should be an Array", function() {
      assert.ok(completer.strategies instanceof Array)
    })
  })

  describe("#registerStrategy", function() {
    var strategy

    function subject() {
      return completer.registerStrategy(strategy)
    }

    beforeEach(function() {
      strategy = createStrategy()
    })

    it("should return itself", function() {
      assert.strictEqual(subject(), completer)
    })

    it("should append the given strategy to #strategies", function() {
      var prev = completer.strategies.length
      subject()
      var curr = completer.strategies.length
      assert.equal(curr, prev + 1)
      var lastStrategy = completer.strategies.pop()
      assert.strictEqual(lastStrategy, strategy)
    })
  })

  describe("#run", function() {
    var query,
      text = ""

    function subject() {
      return completer.run(text)
    }

    beforeEach(function() {
      this.sinon.stub(completer, "extractQuery").callsFake(() => query)
    })

    context("when a query is extracted", function() {
      beforeEach(function() {
        query = createQuery()
      })

      it("should call Query#execute", function() {
        var stub = this.sinon.stub(query, "execute")
        subject()
        assert(stub.calledOnce)
        assert(stub.calledWith(completer.handleQueryResult))
      })

      it("should emit a hit event", function() {
        var spy = this.sinon.spy()
        completer.on("hit", spy)
        subject()
        assert(spy.calledOnce)
        assert(spy.calledWith({ searchResults: this.sinon.match.array }))
      })
    })

    context("when a query is not extracted", function() {
      beforeEach(function() {
        query = null
      })

      it("should emit a hit event", function() {
        var spy = this.sinon.spy()
        completer.on("hit", spy)
        subject()
        assert(spy.calledOnce)
        assert(spy.calledWith({ searchResults: [] }))
      })
    })
  })
})

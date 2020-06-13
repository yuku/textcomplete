require("../test_helper")

import Strategy from "../../src/strategy"

const assert = require("power-assert")

describe("Strategy", function() {
  describe("#props", function() {
    it("should be an object", function() {
      var object = {}
      var strategy = new Strategy(object)
      assert.strictEqual(strategy.props, object)
    })
  })

  describe("#destroy", function() {
    it("should return itself", function() {
      var strategy = new Strategy({})
      assert.strictEqual(strategy.destroy(), strategy)
    })
  })

  describe("#search()", function() {
    var strategy, term, callback, match, results, searchFunc

    function subject() {
      strategy.search(term, callback, match)
    }

    beforeEach(function() {
      results = []
      searchFunc = this.sinon.spy(function(_t, c) {
        c(results)
      })
    })

    context("with cache", function() {
      beforeEach(function() {
        strategy = new Strategy({ cache: true, search: searchFunc })
        ;[term, callback, match] = ["he", this.sinon.spy(), ["he", "", "he"]]
      })

      it("should cache the search results", function() {
        subject()
        assert(searchFunc.calledOnce)
        assert(callback.calledOnce)
        assert(callback.calledWith(results))

        searchFunc.reset()
        callback.reset()

        subject()
        assert(!searchFunc.called)
        assert(callback.calledOnce)
        assert(callback.calledWith(results))
      })
    })

    context("without cache", function() {
      beforeEach(function() {
        strategy = new Strategy({ cache: false, search: searchFunc })
        ;[term, callback, match] = ["he", this.sinon.spy(), ["he", "", "he"]]
      })

      it("should not cache the search results", function() {
        subject()
        assert(searchFunc.calledOnce)
        assert(callback.calledOnce)
        assert(callback.calledWith(results))

        searchFunc.reset()
        callback.reset()

        subject()
        assert(searchFunc.calledOnce)
        assert(callback.calledOnce)
        assert(callback.calledWith(results))
      })
    })
  })
})

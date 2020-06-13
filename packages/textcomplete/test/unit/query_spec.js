require("../test_helper")

import Strategy from "../../src/strategy"
import SearchResult from "../../src/search_result"
import Query from "../../src/query"
import { createQuery } from "../test_utils"

const assert = require("power-assert")

describe("Query", function() {
  var query, term, match

  beforeEach(function() {
    term = "he"
    match = [term, "", term]
    query = createQuery(undefined, term, match)
  })

  describe(".build()", function() {
    var strategy

    function sharedExamples() {
      context("and given text matches to the function's result", function() {
        it("should return a Query object", function() {
          var result = Query.build(strategy, "@hello")
          assert.ok(result instanceof Query)
          assert.strictEqual(result.strategy, strategy)
          assert.strictEqual(result.term, "hello")
          assert.ok(Array.isArray(result.match))
        })
      })

      context(
        "and given text does not match to the function's result",
        function() {
          it("should return null", function() {
            assert.equal(Query.build(strategy, "hello"), null)
          })
        },
      )
    }

    context("when match param is a function", function() {
      beforeEach(function() {
        strategy = new Strategy({
          match: function(text) {
            return text.match(/(^|\s)@(\w+)$/)
          },
        })
      })

      sharedExamples()
    })

    context("when match param is a regexp", function() {
      beforeEach(function() {
        strategy = new Strategy({ match: /(^|\s)@(\w+)$/ })
      })

      sharedExamples()
    })

    context("when context prop is given", function() {
      var props

      beforeEach(function() {
        props = { match: /(^|\s)@(\w+)$/ }
        strategy = new Strategy(props)
      })

      it("should call the function", function() {
        var spy = (props.context = this.sinon.spy())
        var text = "@hello"
        Query.build(strategy, text)
        assert(spy.calledOnce)
        assert(spy.calledWith(text))
      })

      context("and it returns false", function() {
        beforeEach(function() {
          props.context = this.sinon.spy(function() {
            return false
          })
        })

        it("should return null even if the text matches", function() {
          assert.equal(Query.build(strategy, "@hello"), null)
        })
      })

      context("and it returns a string", function() {
        var returnedString
        beforeEach(function() {
          returnedString = "@world"
          props.context = this.sinon.spy(function() {
            return returnedString
          })
        })

        it("should test match with the returned string", function() {
          var text = "@hello"
          var result = Query.build(strategy, text)
          assert.strictEqual(result.term, "world")
        })
      })
    })
  })

  describe("#strategy", function() {
    it("should be a Strategy", function() {
      assert(query.strategy instanceof Strategy)
    })
  })

  describe("#execute", function() {
    var callbackSpy

    function subject() {
      query.execute(callbackSpy)
    }

    beforeEach(function() {
      callbackSpy = this.sinon.spy()
    })

    it("should call Strategy#search", function() {
      var stub = this.sinon.stub(query.strategy, "search")
      subject()
      assert(stub.calledOnce)
      assert(stub.calledWith(term, this.sinon.match.func, match))
    })

    context("when Strategy#search callbacks with an array", function() {
      var callbackData

      beforeEach(function() {
        this.sinon
          .stub(query.strategy, "search")
          .callsFake(function(str, callback) {
            callbackData = str
            callback([callbackData])
          })
      })

      it("should callback with an array of SearchResults", function() {
        subject()
        assert(callbackSpy.calledOnce)
        assert(callbackSpy.calledWith(this.sinon.match.array))
        var result = callbackSpy.args[0][0][0]
        assert(result instanceof SearchResult)
        assert.strictEqual(result.data, callbackData)
        assert.strictEqual(result.term, term)
        assert.strictEqual(result.strategy, query.strategy)
      })
    })
  })
})

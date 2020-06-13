require("../test_helper")

import { createSearchResult } from "../test_utils"
import isUndefined from "lodash.isundefined"

const assert = require("power-assert")

describe("SearchResult", function() {
  describe("#replace", function() {
    var searchResult

    context("when #strategy.replace returns a string", function() {
      beforeEach(function() {
        searchResult = createSearchResult("hello", "he", {
          replace: function(data) {
            return `$1@${data}`
          },
        })
      })

      it("should return an array of strings", function() {
        assert.deepEqual(searchResult.replace("before he", "after"), [
          "before @hello",
          "after",
        ])
      })
    })

    context("when #strategy.replace returns an array of strings", function() {
      beforeEach(function() {
        searchResult = createSearchResult("hello", "he", {
          replace: function(data) {
            return ["$1@", data]
          },
        })
      })

      it("should return an array of strings", function() {
        assert.deepEqual(searchResult.replace("before he", "after"), [
          "before @",
          "helloafter",
        ])
      })
    })

    context("when #strategy.replace returns null", function() {
      beforeEach(function() {
        searchResult = createSearchResult("hello", "he", {
          replace: function() {
            return null
          },
        })
      })

      it("should return undefined", function() {
        assert(isUndefined(searchResult.replace("", "")))
      })
    })

    context(
      "when #strategy.replace handles numeric strings correctly",
      function() {
        beforeEach(function() {
          searchResult = createSearchResult("0000001", "1")
        })

        it("should sub the numeric value in the string correctly", function() {
          assert.deepEqual(searchResult.replace("1", ""), ["0000001 ", ""])
        })
      },
    )
  })
})

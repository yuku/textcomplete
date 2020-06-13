// @flow

import SearchResult from "./search_result"
import Strategy from "./strategy"
import type { MatchData } from "./strategy"

/**
 * Encapsulate matching condition between a Strategy and current editor's value.
 */
export default class Query {
  strategy: Strategy
  term: string
  match: MatchData

  /**
   * Build a Query object by the given string if this matches to the string.
   *
   * @param {string} text - Head to input cursor.
   */
  static build(strategy: Strategy, text: string): ?Query {
    if (typeof strategy.props.context === "function") {
      const context = strategy.props.context(text)
      if (typeof context === "string") {
        text = context
      } else if (!context) {
        return null
      }
    }
    const match = strategy.matchText(text)
    return match ? new Query(strategy, match[strategy.index], match) : null
  }

  constructor(strategy: Strategy, term: string, match: MatchData) {
    this.strategy = strategy
    this.term = term
    this.match = match
  }

  /**
   * Invoke search strategy and callback the given function.
   */
  execute(callback: (SearchResult[]) => void) {
    this.strategy.search(
      this.term,
      results => {
        callback(
          results.map(result => {
            return new SearchResult(result, this.term, this.strategy)
          }),
        )
      },
      this.match,
    )
  }
}

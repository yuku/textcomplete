// @flow

import Strategy from "./strategy"

/**
 * Encapsulate an result of each search results.
 */
export default class SearchResult {
  data: Object
  term: string
  strategy: Strategy

  /**
   * @param {object} data - An element of array callbacked by search function.
   */
  constructor(data: Object, term: string, strategy: Strategy) {
    this.data = data
    this.term = term
    this.strategy = strategy
  }

  replace(beforeCursor: string, afterCursor: string) {
    let replacement = this.strategy.replace(this.data)
    if (replacement !== null) {
      if (Array.isArray(replacement)) {
        afterCursor = replacement[1] + afterCursor
        replacement = replacement[0]
      }
      const match = this.strategy.matchText(beforeCursor)
      if (match) {
        replacement = replacement
          .replace(/\$&/g, match[0])
          .replace(/\$(\d)/g, (_, p1) => match[parseInt(p1, 10)])
        return [
          [
            beforeCursor.slice(0, match.index),
            replacement,
            beforeCursor.slice(match.index + match[0].length),
          ].join(""),
          afterCursor,
        ]
      }
    }
  }

  render(): string {
    return this.strategy.template(this.data, this.term)
  }
}

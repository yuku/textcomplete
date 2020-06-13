import { SearchResult } from "./SearchResult"
import { Strategy } from "./Strategy"

export class Query<T> {
  static create<U>(
    strategy: Strategy<U>,
    beforeCursor: string
  ): Query<U> | null {
    const context = strategy.context(beforeCursor)
    if (context === false) return null
    const match = strategy.match(context === true ? beforeCursor : context)
    return match ? new Query(strategy, match[strategy.index], match) : null
  }

  constructor(
    private strategy: Strategy<T>,
    private term: string,
    private match: RegExpMatchArray
  ) {}

  execute(callback: (result: SearchResult<T>[]) => void): void {
    this.strategy.search(
      this.term,
      (results: T[]) => {
        callback(
          results.map(
            (result) => new SearchResult(result, this.term, this.strategy)
          )
        )
      },
      this.match
    )
  }
}

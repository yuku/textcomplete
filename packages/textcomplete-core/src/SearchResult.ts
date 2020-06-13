import { Strategy } from "./Strategy"

const MAIN = /\$&/g
const PLACE = /\$(\d)/g

export class SearchResult<T> {
  constructor(
    public readonly data: T,
    private readonly term: string,
    private readonly strategy: Strategy<T>
  ) {}

  replace(beforeCursor: string, afterCursor: string): [string, string] | void {
    let result = this.strategy.replace(this.data)
    if (result == null) return
    if (Array.isArray(result)) {
      afterCursor = result[1] + afterCursor
      result = result[0]
    }
    const match = this.strategy.match(beforeCursor)
    if (match == null || match.index == null) return
    const replacement = result
      .replace(MAIN, match[0])
      .replace(PLACE, (_, p) => match[parseInt(p)])
    return [
      [
        beforeCursor.slice(0, match.index),
        replacement,
        beforeCursor.slice(match.index + match[0].length),
      ].join(""),
      afterCursor,
    ]
  }

  render(): string {
    return this.strategy.renderTemplate(this.data, this.term)
  }

  getStrategyId(): string | null {
    return this.strategy.getId()
  }
}

import { EventEmitter } from "eventemitter3"

import { Strategy, StrategyProps } from "./Strategy"
import { Query } from "./Query"
import { SearchResult } from "./SearchResult"

export class Completer extends EventEmitter {
  private readonly strategies: Strategy<unknown>[]

  constructor(strategyPropsList: StrategyProps<unknown>[]) {
    super()
    this.strategies = strategyPropsList.map((p) => new Strategy(p))
  }

  destroy(): this {
    this.strategies.forEach((s) => s.destroy())
    return this
  }

  run(beforeCursor: string): void {
    const query = this.extractQuery(beforeCursor)
    if (query) {
      query.execute(this.handleQueryResult)
    } else {
      this.handleQueryResult([])
    }
  }

  private extractQuery(beforeCursor: string): Query<unknown> | void {
    for (const strategy of this.strategies) {
      const query = Query.create(strategy, beforeCursor)
      if (query) return query
    }
  }

  private handleQueryResult = <T>(searchResults: SearchResult<T>[]) => {
    this.emit("hit", { searchResults })
  }
}

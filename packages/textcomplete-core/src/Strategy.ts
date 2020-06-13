type SearchCallback<T> = (results: T[]) => void
type ReplaceResult = [string, string] | string | null

export interface StrategyProps<T> {
  match: RegExp | ((regexp: string | RegExp) => RegExpMatchArray | null)
  search: (
    term: string,
    callback: SearchCallback<T>,
    match: RegExpMatchArray
  ) => void
  replace: (data: T) => ReplaceResult
  cache?: boolean
  context?: (text: string) => string | boolean
  template?: (data: unknown, term: string) => string
  index?: number
  id?: string
}

const DEFAULT_INDEX = 2

export class Strategy<T> {
  public readonly index: number

  private cache: Record<string, T[]> = {}

  constructor(private readonly props: StrategyProps<T>) {
    this.index = props.index || DEFAULT_INDEX
  }

  destroy(): this {
    this.cache = {}
    return this
  }

  search(
    term: string,
    callback: SearchCallback<T>,
    match: RegExpMatchArray
  ): void {
    if (this.props.cache) {
      this.searchWithCach(term, callback, match)
    } else {
      this.props.search(term, callback, match)
    }
  }

  replace(data: T): ReplaceResult {
    return this.props.replace(data)
  }

  match(beforeCursor: string): RegExpMatchArray | null {
    return typeof this.props.match === "function"
      ? this.props.match(beforeCursor)
      : beforeCursor.match(this.props.match)
  }

  renderTemplate(data: T, term: string): string {
    if (this.props.template) {
      return this.props.template(data, term)
    }
    if (typeof data === "string") return data
    throw new Error(
      `Unexpected render data type: ${typeof data}. Please implement template parameter by yourself`
    )
  }

  context(beforeCursor: string): string | boolean {
    return this.props.context ? this.props.context(beforeCursor) : true
  }

  getId(): string | null {
    return this.props.id || null
  }

  private searchWithCach(
    term: string,
    callback: SearchCallback<T>,
    match: RegExpMatchArray
  ): void {
    if (this.cache[term] != null) {
      callback(this.cache[term])
    } else {
      this.props.search(
        term,
        (results) => {
          this.cache[term] = results
          callback(results)
        },
        match
      )
    }
  }
}

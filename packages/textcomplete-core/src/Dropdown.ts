import { EventEmitter } from "eventemitter3"

import { SearchResult } from "./SearchResult"
import { createCustomEvent } from "./utils"
import { CursorOffset } from "./Editor"

export interface DropdownOption {
  className?: string
  item?: DropdownItemOption
  footer?: ((results: unknown[]) => string) | string
  header?: ((results: unknown[]) => string) | string
  maxCount?: number
  placement?: "auto" | "top" | "bottom"
  rotate?: boolean
  style?: CSSStyleDeclaration
  parent?: HTMLElement
  dynamicWidth?: boolean
}

interface DropdownItemOption {
  className?: string
  activeClassName?: string
}

// Default constants for Dropdown
export const DEFAULT_DROPDOWN_MAX_COUNT = 10
export const DEFAULT_DROPDOWN_PLACEMENT = "auto"
export const DEFAULT_DROPDOWN_CLASS_NAME = "dropdown-menu textcomplete-dropdown"

// Default constants for DropdownItem
export const DEFAULT_DROPDOWN_ITEM_CLASS_NAME = "textcomplete-item"
export const DEFAULT_DROPDOWN_ITEM_ACTIVE_CLASS_NAME = `${DEFAULT_DROPDOWN_ITEM_CLASS_NAME} active`

export class Dropdown extends EventEmitter {
  private shown = false
  private items: DropdownItem[] = []
  private activeIndex: number | null = null

  static create(option: DropdownOption): Dropdown {
    const ul = document.createElement("ul")
    ul.className = option.className || DEFAULT_DROPDOWN_CLASS_NAME
    Object.assign(
      ul.style,
      {
        display: "none",
        position: "absolute",
        zIndex: "1000",
      },
      option.style
    )
    const parent = option.parent || document.body
    parent?.appendChild(ul)
    return new Dropdown(ul, option)
  }

  private constructor(
    public readonly el: HTMLUListElement,
    private option: DropdownOption
  ) {
    super()
  }

  /**
   * Render the given search results. Previous results are cleared.
   *
   * @emits render
   * @emits rendered
   */
  render(
    searchResults: SearchResult<unknown>[],
    cursorOffset: CursorOffset
  ): this {
    const event = createCustomEvent("render", { cancelable: true })
    this.emit("render", event)
    if (event.defaultPrevented) return this
    this.clear()
    if (searchResults.length === 0) return this.hide()
    this.items = searchResults
      .slice(0, this.option.maxCount || DEFAULT_DROPDOWN_MAX_COUNT)
      .map(
        (r, index) => new DropdownItem(this, index, r, this.option?.item || {})
      )
    this.setStrategyId(searchResults[0])
      .renderEdge(searchResults, "header")
      .renderItems()
      .renderEdge(searchResults, "footer")
      .show()
      .setOffset(cursorOffset)
      .activate(0)
    this.emit("rendered", createCustomEvent("rendered"))
    return this
  }

  destroy(): this {
    this.clear()
    this.el.parentNode?.removeChild(this.el)
    return this
  }

  /**
   * Select the given item
   *
   * @emits select
   * @emits selected
   */
  select(item: DropdownItem): this {
    const detail = { searchResult: item.searchResult }
    const event = createCustomEvent("select", { cancelable: true, detail })
    this.emit("select", event)
    if (event.defaultPrevented) return this
    this.hide()
    this.emit("selected", createCustomEvent("selected", { detail }))
    return this
  }

  /**
   * Show the dropdown element
   *
   * @emits show
   * @emits shown
   */
  show(): this {
    if (!this.shown) {
      const event = createCustomEvent("show", { cancelable: true })
      this.emit("show", event)
      if (event.defaultPrevented) return this
      this.el.style.display = "block"
      this.shown = true
      this.emit("shown", createCustomEvent("shown"))
    }
    return this
  }

  /**
   * Hide the dropdown element
   *
   * @emits hide
   * @emits hidden
   */
  hide(): this {
    if (this.shown) {
      const event = createCustomEvent("hide", { cancelable: true })
      this.emit("hide", event)
      if (event.defaultPrevented) return this
      this.el.style.display = "none"
      this.shown = false
      this.clear()
      this.emit("hidden", createCustomEvent("hidden"))
    }
    return this
  }

  /** Clear search results */
  clear(): this {
    this.items.forEach((i) => i.destroy())
    this.items = []
    this.el.innerHTML = ""
    this.activeIndex = null
    return this
  }

  up(e: CustomEvent): this {
    return this.shown ? this.moveActiveItem("prev", e) : this
  }

  down(e: CustomEvent): this {
    return this.shown ? this.moveActiveItem("next", e) : this
  }

  moveActiveItem(direction: "next" | "prev", e: CustomEvent): this {
    if (this.activeIndex != null) {
      const activeIndex =
        direction === "next"
          ? this.getNextActiveIndex()
          : this.getPrevActiveIndex()
      if (activeIndex != null) {
        this.activate(activeIndex)
        e.preventDefault()
      }
    }
    return this
  }

  activate(index: number): this {
    if (this.activeIndex !== index) {
      if (this.activeIndex != null) {
        this.items[this.activeIndex].deactivate()
      }
      this.activeIndex = index
      this.items[index].activate()
    }
    return this
  }

  isShown(): boolean {
    return this.shown
  }

  getActiveItem(): DropdownItem | null {
    return this.activeIndex != null ? this.items[this.activeIndex] : null
  }

  setOffset(cursorOffset: CursorOffset): this {
    const doc = document.documentElement
    if (doc) {
      const elementWidth = this.el.offsetWidth
      if (cursorOffset.left) {
        const browserWidth = this.option.dynamicWidth
          ? doc.scrollWidth
          : doc.clientWidth
        if (cursorOffset.left + elementWidth > browserWidth) {
          cursorOffset.left = browserWidth - elementWidth
        }
        this.el.style.left = `${cursorOffset.left}px`
      } else if (cursorOffset.right) {
        if (cursorOffset.right - elementWidth < 0) {
          cursorOffset.right = 0
        }
        this.el.style.right = `${cursorOffset.right}px`
      }

      let forceTop = false

      const placement = this.option.placement || DEFAULT_DROPDOWN_PLACEMENT

      if (placement === "auto") {
        const dropdownHeight = this.items.length * cursorOffset.lineHeight
        forceTop =
          cursorOffset.clientTop != null &&
          cursorOffset.clientTop + dropdownHeight > doc.clientHeight
      }

      if (placement === "top" || forceTop) {
        this.el.style.bottom = `${
          doc.clientHeight - cursorOffset.top + cursorOffset.lineHeight
        }px`
        this.el.style.top = "auto"
      } else {
        this.el.style.top = `${cursorOffset.top}px`
        this.el.style.bottom = "auto"
      }
    }
    return this
  }

  private getNextActiveIndex(): number | null {
    if (this.activeIndex == null) throw new Error()
    return this.activeIndex < this.items.length - 1
      ? this.activeIndex + 1
      : this.option.rotate
      ? 0
      : null
  }

  private getPrevActiveIndex(): number | null {
    if (this.activeIndex == null) throw new Error()
    return this.activeIndex !== 0
      ? this.activeIndex - 1
      : this.option.rotate
      ? this.items.length - 1
      : null
  }

  private renderItems(): this {
    const fragment = document.createDocumentFragment()
    for (const item of this.items) {
      fragment.appendChild(item.el)
    }
    this.el.appendChild(fragment)
    return this
  }

  private setStrategyId(searchResult: SearchResult<unknown>): this {
    const id = searchResult.getStrategyId()
    if (id) this.el.dataset.strategy = id
    return this
  }

  private renderEdge(
    searchResults: SearchResult<unknown>[],
    type: "header" | "footer"
  ): this {
    const option = this.option[type]
    const li = document.createElement("li")
    li.className = `textcomplete-${type}`
    li.innerHTML =
      typeof option === "function"
        ? option(searchResults.map((s) => s.data))
        : option || ""
    this.el.appendChild(li)
    return this
  }
}

class DropdownItem {
  public readonly el: HTMLLIElement
  private active = false
  private readonly className: string
  private readonly activeClassName: string

  constructor(
    private readonly dropdown: Dropdown,
    private readonly index: number,
    public readonly searchResult: SearchResult<unknown>,
    private readonly props: DropdownItemOption
  ) {
    this.className = this.props.className || DEFAULT_DROPDOWN_ITEM_CLASS_NAME
    this.activeClassName =
      this.props.activeClassName || DEFAULT_DROPDOWN_ITEM_ACTIVE_CLASS_NAME

    const li = document.createElement("li")
    li.className = this.active ? this.activeClassName : this.className

    const span = document.createElement("span")
    span.tabIndex = -1
    span.innerHTML = this.searchResult.render()
    li.appendChild(span)

    li.addEventListener("click", this.onClick)

    this.el = li
  }

  destroy(): this {
    const li = this.el
    li.parentNode?.removeChild(li)
    li.removeEventListener("click", this.onClick, false)
    return this
  }

  activate(): this {
    if (!this.active) {
      this.active = true
      this.el.className = this.activeClassName
      this.dropdown.el.scrollTop = this.el.offsetTop
    }
    return this
  }

  deactivate(): this {
    if (this.active) {
      this.active = false
      this.el.className = this.className
    }
    return this
  }

  private onClick = (e: MouseEvent | TouchEvent): void => {
    e.preventDefault()
    this.dropdown.select(this)
  }
}

// @flow

import SearchResult from "./search_result"

export const DEFAULT_CLASS_NAME = "textcomplete-item"
const CALLBACK_METHODS = ["onClick", "onMouseover"]

/** @typedef */
export type DropdownItemOptions = {
  className?: string,
}

// Declare interface instead of importing Dropdown itself to prevent circular dependency.
interface Dropdown {
  activeItem: DropdownItem | null;
  items: DropdownItem[];
  rotate: ?Boolean;
  getActiveItem(): DropdownItem | null;
  select(DropdownItem): DropdownItem;
  el: HTMLUListElement;
}

/**
 * Encapsulate an item of dropdown.
 */
export default class DropdownItem {
  searchResult: SearchResult
  active: boolean
  className: string
  activeClassName: string
  siblings: DropdownItem[]
  dropdown: Dropdown
  index: number
  _el: ?HTMLLIElement

  constructor(searchResult: SearchResult, options: DropdownItemOptions) {
    this.searchResult = searchResult
    this.active = false
    this.className = options.className || DEFAULT_CLASS_NAME
    this.activeClassName = `${this.className} active`

    CALLBACK_METHODS.forEach(method => {
      ;(this: any)[method] = (this: any)[method].bind(this)
    })
  }

  get el(): HTMLLIElement {
    if (this._el) {
      return this._el
    }
    const li = document.createElement("li")
    li.className = this.active ? this.activeClassName : this.className
    const a = document.createElement("a")
    a.innerHTML = this.searchResult.render()
    li.appendChild(a)
    this._el = li
    li.addEventListener("mousedown", this.onClick)
    li.addEventListener("mouseover", this.onMouseover)
    li.addEventListener("touchstart", this.onClick)
    return li
  }

  /**
   * Try to free resources and perform other cleanup operations.
   */
  destroy() {
    this.el.removeEventListener("mousedown", this.onClick, false)
    this.el.removeEventListener("mouseover", this.onMouseover, false)
    this.el.removeEventListener("touchstart", this.onClick, false)
    if (this.active) {
      this.dropdown.activeItem = null
    }
    // This element has already been removed by {@link Dropdown#clear}.
    this._el = null
  }

  /**
   * Callbacked when it is appended to a dropdown.
   *
   * @see Dropdown#append
   */
  appended(dropdown: Dropdown) {
    this.dropdown = dropdown
    this.siblings = dropdown.items
    this.index = this.siblings.length - 1
  }

  /**
   * Deactivate active item then activate itself.
   *
   * @return {this}
   */
  activate() {
    if (!this.active) {
      const activeItem = this.dropdown.getActiveItem()
      if (activeItem) {
        activeItem.deactivate()
      }
      this.dropdown.activeItem = this
      this.active = true
      this.el.className = this.activeClassName

      const offsetToScroll = this.el.offsetTop
      this.dropdown.el.scrollTop = offsetToScroll
    }
    return this
  }

  /**
   * Get the next sibling.
   */
  get next(): ?DropdownItem {
    let nextIndex
    if (this.index === this.siblings.length - 1) {
      if (!this.dropdown.rotate) {
        return null
      }
      nextIndex = 0
    } else {
      nextIndex = this.index + 1
    }
    return this.siblings[nextIndex]
  }

  /**
   * Get the previous sibling.
   */
  get prev(): ?DropdownItem {
    let nextIndex
    if (this.index === 0) {
      if (!this.dropdown.rotate) {
        return null
      }
      nextIndex = this.siblings.length - 1
    } else {
      nextIndex = this.index - 1
    }
    return this.siblings[nextIndex]
  }

  /** @private */
  deactivate() {
    if (this.active) {
      this.active = false
      this.el.className = this.className
      this.dropdown.activeItem = null
    }
    return this
  }

  /** @private */
  onClick(e: Event) {
    e.preventDefault() // Prevent blur event
    this.dropdown.select(this)
  }

  /** @private */
  onMouseover() {
    this.activate()
  }
}

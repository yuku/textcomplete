// @flow

import update from "undate/lib/update"

import Editor from "./editor"
import { calculateElementOffset, getLineHeightPx } from "./utils"
import SearchResult from "./search_result"

const getCaretCoordinates = require("textarea-caret")

const CALLBACK_METHODS = ["onInput", "onKeydown"]

/**
 * Encapsulate the target textarea element.
 */
export default class Textarea extends Editor {
  el: HTMLTextAreaElement

  /**
   * @param {HTMLTextAreaElement} el - Where the textcomplete works on.
   */
  constructor(el: HTMLTextAreaElement) {
    super()
    this.el = el

    CALLBACK_METHODS.forEach(method => {
      ;(this: any)[method] = (this: any)[method].bind(this)
    })

    this.startListening()
  }

  /**
   * @return {this}
   */
  destroy() {
    super.destroy()
    this.stopListening()
    // Release the element reference early to help garbage collection.
    ;(this: any).el = null
    return this
  }

  /**
   * Implementation for {@link Editor#applySearchResult}
   */
  applySearchResult(searchResult: SearchResult) {
    const before = this.getBeforeCursor()
    if (before != null) {
      const replace = searchResult.replace(before, this.getAfterCursor())
      this.el.focus() // Clicking a dropdown item removes focus from the element.
      if (Array.isArray(replace)) {
        update(this.el, replace[0], replace[1])
        if (this.el)
          this.el.dispatchEvent(new Event("input"))
      }
    }
  }

  /**
   * Implementation for {@link Editor#getCursorOffset}
   */
  getCursorOffset() {
    const elOffset = calculateElementOffset(this.el)
    const elScroll = this.getElScroll()
    const cursorPosition = this.getCursorPosition()
    const lineHeight = getLineHeightPx(this.el)
    const top = elOffset.top - elScroll.top + cursorPosition.top + lineHeight
    const left = elOffset.left - elScroll.left + cursorPosition.left
    const clientTop = this.el.getBoundingClientRect().top;
    if (this.el.dir !== "rtl") {
      return { top, left, lineHeight, clientTop }
    } else {
      const right = document.documentElement
        ? document.documentElement.clientWidth - left
        : 0
      return { top, right, lineHeight, clientTop }
    }
  }

  /**
   * Implementation for {@link Editor#getBeforeCursor}
   */
  getBeforeCursor() {
    return this.el.selectionStart !== this.el.selectionEnd
      ? null
      : this.el.value.substring(0, this.el.selectionEnd)
  }

  /** @private */
  getAfterCursor() {
    return this.el.value.substring(this.el.selectionEnd)
  }

  /** @private */
  getElScroll(): { top: number, left: number } {
    return { top: this.el.scrollTop, left: this.el.scrollLeft }
  }

  /**
   * The input cursor's relative coordinates from the textarea's left
   * top corner.
   *
   * @private
   */
  getCursorPosition(): { top: number, left: number } {
    return getCaretCoordinates(this.el, this.el.selectionEnd)
  }

  /** @private */
  onInput() {
    this.emitChangeEvent()
  }

  /** @private */
  onKeydown(e: KeyboardEvent) {
    const code = this.getCode(e)
    let event
    if (code === "UP" || code === "DOWN") {
      event = this.emitMoveEvent(code)
    } else if (code === "ENTER") {
      event = this.emitEnterEvent()
    } else if (code === "ESC") {
      event = this.emitEscEvent()
    }
    if (event && event.defaultPrevented) {
      e.preventDefault()
    }
  }

  /** @private */
  startListening() {
    this.el.addEventListener("input", this.onInput)
    this.el.addEventListener("keydown", this.onKeydown)
  }

  /** @private */
  stopListening() {
    this.el.removeEventListener("input", this.onInput)
    this.el.removeEventListener("keydown", this.onKeydown)
  }
}

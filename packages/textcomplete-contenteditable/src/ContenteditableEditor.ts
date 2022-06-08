import { Editor, CursorOffset, SearchResult } from "@textcomplete/core"
import { isSafari, getLineHeightPx } from "@textcomplete/utils"

export class ContenteditableEditor extends Editor {
  constructor(public readonly el: HTMLElement) {
    super()
    this.startListening()
  }

  destroy(): this {
    super.destroy()
    this.stopListening()
    return this
  }

  /**
   * @implements {@link Editor#applySearchResult}
   */
  applySearchResult(searchResult: SearchResult): void {
    const before = this.getBeforeCursor()
    const after = this.getAfterCursor()
    if (before != null && after != null) {
      const replace = searchResult.replace(before, after)
      if (Array.isArray(replace)) {
        let beforeCursor = replace[0]
        if (isSafari()) beforeCursor = beforeCursor.replace(before, "")
        const range = this.getRange()
        range.selectNode(range.startContainer)
        this.el.ownerDocument.execCommand(
          "insertText",
          false,
          beforeCursor + replace[1]
        )
        range.detach()
        const newRange = this.getRange()
        newRange.setStart(newRange.startContainer, beforeCursor.length)
        newRange.collapse(true)
      }
    }
  }

  /**
   * @implements {@link Editor#getCursorOffset}
   */
  getCursorOffset(): CursorOffset {
    const range = this.getRange()
    const rangeRects = range.getBoundingClientRect()

    const docRects = this.el.ownerDocument.body.getBoundingClientRect()
    const container = range.startContainer
    const el = (
      container instanceof Text ? container.parentElement : container
    ) as HTMLElement

    const left = rangeRects.left
    const lineHeight = getLineHeightPx(el)
    const top = rangeRects.top - docRects.top + lineHeight
    return this.el.dir !== "rtl"
      ? { left, lineHeight, top }
      : { right: document.documentElement.clientWidth - left, lineHeight, top }
  }

  /**
   * @implements {@link Editor#getBeforeCursor}
   */
  getBeforeCursor(): string | null {
    const range = this.getRange()
    if (range.collapsed && range.startContainer instanceof Text) {
      return range.startContainer.wholeText.substring(0, range.startOffset)
    }
    return null
  }

  private getAfterCursor(): string | null {
    const range = this.getRange()
    if (range.collapsed && range.startContainer instanceof Text) {
      return range.startContainer.wholeText.substring(range.startOffset)
    }
    return null
  }

  private getRange(force?: boolean): Range {
    const selection = this.el.ownerDocument.defaultView?.getSelection()
    if (selection == null) {
      throw new Error("The element does not belong to view")
    }

    for (let i = 0, l = selection.rangeCount; i < l; i++) {
      const range = selection.getRangeAt(i)
      if (this.el.contains(range.startContainer)) {
        return range
      }
    }
    // The element is not active.
    if (force) {
      throw new Error("Unexpected")
    }
    const activeElement = this.el.ownerDocument.activeElement
    this.el.focus()
    const range = this.getRange(true)

    // Activate previous active element
    if (activeElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const el = activeElement as any
      el.focus && el.focus()
    }
    return range
  }

  private onInput = (): void => {
    this.emitChangeEvent()
  }

  private onKeydown = (e: KeyboardEvent): void => {
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

  private startListening = (): void => {
    this.el.addEventListener("input", this.onInput)
    this.el.addEventListener("keydown", this.onKeydown)
  }

  private stopListening = (): void => {
    this.el.removeEventListener("input", this.onInput)
    this.el.removeEventListener("keydown", this.onKeydown)
  }
}

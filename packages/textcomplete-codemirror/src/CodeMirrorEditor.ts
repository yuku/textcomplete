import { Editor as CodeMirror } from "codemirror"

import { Editor, CursorOffset, SearchResult } from "@textcomplete/core"

export class CodeMirrorEditor extends Editor {
  constructor(public readonly cm: CodeMirror) {
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
    const replacement = searchResult.getReplacementData(this.getBeforeCursor())
    if (replacement) {
      this.cm.replaceRange(
        replacement.beforeCursor + replacement.afterCursor,
        this.cm.posFromIndex(replacement.start),
        this.cm.posFromIndex(replacement.end)
      )

      this.cm.setCursor(
        this.cm.posFromIndex(
          replacement.start + replacement.beforeCursor.length
        )
      )
    }
    this.cm.focus()
  }

  /**
   * @implements {@link Editor#getCursorOffset}
   */
  getCursorOffset(): CursorOffset {
    const { left, top, bottom } = this.cm.cursorCoords()
    return { left, top: bottom, lineHeight: bottom - top }
  }

  /**
   * @implements {@link Editor#getBeforeCursor}
   */
  getBeforeCursor(): string {
    const { line, ch } = this.cm.getCursor()
    const lines = this.getLines()
    const linesBeforeCursor = lines.slice(0, line)
    const currentLineBeforeCursor = lines[line].slice(0, ch)
    return linesBeforeCursor
      .concat([currentLineBeforeCursor])
      .join(this.cm.lineSeparator())
  }

  private getAfterCursor(): string {
    const { line, ch } = this.cm.getCursor()
    const lines = this.getLines()
    const linesAfterCursor = lines.slice(line + 1)
    const currentLineAfterCursor = lines[line].slice(ch)
    return [currentLineAfterCursor]
      .concat(linesAfterCursor)
      .join(this.cm.lineSeparator())
  }

  private getLines(): string[] {
    return this.cm.getValue().split(this.cm.lineSeparator())
  }

  private onKeydown = (_cm: CodeMirror, e: KeyboardEvent) => {
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

  private onKeyup = (_cm: CodeMirror, e: KeyboardEvent) => {
    const code = this.getCode(e)
    if (code !== "DOWN" && code !== "UP") {
      this.emitChangeEvent()
    }
  }

  private startListening(): void {
    this.cm.on("keydown", this.onKeydown)
    this.cm.on("keyup", this.onKeyup)
  }

  private stopListening(): void {
    this.cm.off("keydown", this.onKeydown)
    this.cm.off("keyup", this.onKeyup)
  }
}

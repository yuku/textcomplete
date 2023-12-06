import { EventEmitter } from "eventemitter3"

import { SearchResult } from "./SearchResult"
import { createCustomEvent } from "./utils"

export interface CursorOffset {
  lineHeight: number
  top: number
  left?: number
  right?: number
  clientTop?: number
}

type KeyCode = "ESC" | "ENTER" | "UP" | "DOWN" | "OTHER"

export abstract class Editor extends EventEmitter {
  /**
   * Finalize the editor object.
   *
   * It is called when associated textcomplete object is destroyed.
   */
  destroy(): this {
    return this
  }

  /**
   * It is called when a search result is selected by a user.
   */
  applySearchResult(_searchResult: SearchResult<unknown>): void {
    throw new Error("Not implemented.")
  }

  /**
   * The input cursor's absolute coordinates from the window's left
   * top corner.
   */
  getCursorOffset(): CursorOffset {
    throw new Error("Not implemented.")
  }

  /**
   * Editor string value from head to the cursor.
   * Returns null if selection type is range not cursor.
   */
  getBeforeCursor(): string | null {
    throw new Error("Not implemented.")
  }

  /**
   * Emit a move event, which moves active dropdown element.
   * Child class must call this method at proper timing with proper parameter.
   *
   * @see {@link Textarea} for live example.
   */
  emitMoveEvent(code: "UP" | "DOWN"): CustomEvent {
    const moveEvent = createCustomEvent("move", {
      cancelable: true,
      detail: {
        code: code,
      },
    })
    this.emit("move", moveEvent)
    return moveEvent
  }

  /**
   * Emit a enter event, which selects current search result.
   * Child class must call this method at proper timing.
   *
   * @see {@link Textarea} for live example.
   */
  emitEnterEvent(): CustomEvent {
    const enterEvent = createCustomEvent("enter", { cancelable: true })
    this.emit("enter", enterEvent)
    return enterEvent
  }

  /**
   * Emit a change event, which triggers auto completion.
   * Child class must call this method at proper timing.
   *
   * @see {@link Textarea} for live example.
   */
  emitChangeEvent(): CustomEvent {
    const changeEvent = createCustomEvent("change", {
      detail: {
        beforeCursor: this.getBeforeCursor(),
      },
    })
    this.emit("change", changeEvent)
    return changeEvent
  }

  /**
   * Emit a esc event, which hides dropdown element.
   * Child class must call this method at proper timing.
   *
   * @see {@link Textarea} for live example.
   */
  emitEscEvent(): CustomEvent {
    const escEvent = createCustomEvent("esc", { cancelable: true })
    this.emit("esc", escEvent)
    return escEvent
  }

  /**
   * Helper method for parsing KeyboardEvent.
   *
   * @see {@link Textarea} for live example.
   */
  protected getCode(e: KeyboardEvent): KeyCode {
    switch (e.keyCode) {
      case 9: // tab
      case 13: // enter
        return "ENTER"
      case 27: // esc
        return "ESC"
      case 38: // up
        return "UP"
      case 40: // down
        return "DOWN"
      case 78: // ctrl-n
        if (e.ctrlKey) return "DOWN"
        break
      case 80: // ctrl-p
        if (e.ctrlKey) return "UP"
        break
    }
    return "OTHER"
  }
}

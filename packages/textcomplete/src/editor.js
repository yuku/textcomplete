// @flow
/*eslint no-unused-vars: off*/

import EventEmitter from "eventemitter3"

import { createCustomEvent } from "./utils"
import SearchResult from "./search_result"

/** @typedef */
export type CursorOffset = {
  lineHeight: number,
  top: number,
  left?: number,
  right?: number,
  clientTop?: number
}

type KeyCode = "ESC" | "ENTER" | "UP" | "DOWN" | "OTHER"

/**
 * Abstract class representing a editor target.
 *
 * Editor classes must implement `#applySearchResult`, `#getCursorOffset` and
 * `#getBeforeCursor` methods.
 *
 * Editor classes must invoke `#emitMoveEvent`, `#emitEnterEvent`,
 * `#emitChangeEvent` and `#emitEscEvent` at proper timing.
 *
 * @abstract
 */
export default class Editor extends EventEmitter {
  /**
   * It is called when associated textcomplete object is destroyed.
   *
   * @return {this}
   */
  destroy() {
    return this
  }

  /**
   * It is called when a search result is selected by a user.
   */
  applySearchResult(_: SearchResult): void {
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
   * Editor string value from head to cursor.
   * Returns null if selection type is range not cursor.
   */
  getBeforeCursor(): ?string {
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
  getCode(e: KeyboardEvent): KeyCode {
    return e.keyCode === 9
      ? "ENTER" // tab
      : e.keyCode === 13
        ? "ENTER" // enter
        : e.keyCode === 27
          ? "ESC" // esc
          : e.keyCode === 38
            ? "UP" // up
            : e.keyCode === 40
              ? "DOWN" // down
              : e.keyCode === 78 && e.ctrlKey
                ? "DOWN" // ctrl-n
                : e.keyCode === 80 && e.ctrlKey
                  ? "UP" // ctrl-p
                  : "OTHER"
  }
}

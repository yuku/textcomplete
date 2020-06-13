// @flow

import Completer from "./completer"
import Editor from "./editor"
import Dropdown, { type DropdownOptions } from "./dropdown"
import Strategy, { type StrategyProperties } from "./strategy"
import SearchResult from "./search_result"

import EventEmitter from "eventemitter3"

const CALLBACK_METHODS = [
  "handleChange",
  "handleEnter",
  "handleEsc",
  "handleHit",
  "handleMove",
  "handleSelect",
]

/** @typedef */
type TextcompleteOptions = {
  dropdown?: DropdownOptions,
}

/**
 * The core of textcomplete. It acts as a mediator.
 */
export default class Textcomplete extends EventEmitter {
  dropdown: Dropdown
  editor: Editor
  options: TextcompleteOptions
  completer: Completer
  isQueryInFlight: boolean
  nextPendingQuery: string | null

  /**
   * @param {Editor} editor - Where the textcomplete works on.
   */
  constructor(editor: Editor, options: TextcompleteOptions = {}) {
    super()

    this.completer = new Completer()
    this.isQueryInFlight = false
    this.nextPendingQuery = null
    this.dropdown = new Dropdown(options.dropdown || {})
    this.editor = editor
    this.options = options

    CALLBACK_METHODS.forEach(method => {
      ;(this: any)[method] = (this: any)[method].bind(this)
    })

    this.startListening()
  }

  /**
   * @return {this}
   */
  destroy(destroyEditor: boolean = true) {
    this.completer.destroy()
    this.dropdown.destroy()
    if (destroyEditor) {
      this.editor.destroy()
    }
    this.stopListening()
    return this
  }

  /**
   * @return {this}
   */
  hide() {
    this.dropdown.deactivate()
    return this
  }

  /**
   * @return {this}
   * @example
   * textcomplete.register([{
   *   match: /(^|\s)(\w+)$/,
   *   search: function (term, callback) {
   *     $.ajax({ ... })
   *       .done(callback)
   *       .fail([]);
   *   },
   *   replace: function (value) {
   *     return '$1' + value + ' ';
   *   }
   * }]);
   */
  register(strategyPropsArray: StrategyProperties[]) {
    strategyPropsArray.forEach(props => {
      this.completer.registerStrategy(new Strategy(props))
    })
    return this
  }

  /**
   * Start autocompleting.
   *
   * @param {string} text - Head to input cursor.
   * @return {this}
   */
  trigger(text: string) {
    if (this.isQueryInFlight) {
      this.nextPendingQuery = text
    } else {
      this.isQueryInFlight = true
      this.nextPendingQuery = null
      this.completer.run(text)
    }
    return this
  }

  /** @private */
  handleHit({ searchResults }: { searchResults: SearchResult[] }) {
    if (searchResults.length) {
      this.dropdown.render(searchResults, this.editor.getCursorOffset())
    } else {
      this.dropdown.deactivate()
    }
    this.isQueryInFlight = false
    if (this.nextPendingQuery !== null) {
      this.trigger(this.nextPendingQuery)
    }
  }

  /** @private */
  handleMove(e: CustomEvent) {
    e.detail.code === "UP" ? this.dropdown.up(e) : this.dropdown.down(e)
  }

  /** @private */
  handleEnter(e: CustomEvent) {
    const activeItem = this.dropdown.getActiveItem()
    if (activeItem) {
      this.dropdown.select(activeItem)
      e.preventDefault()
    } else {
      this.dropdown.deactivate()
    }
  }

  /** @private */
  handleEsc(e: CustomEvent) {
    if (this.dropdown.shown) {
      this.dropdown.deactivate()
      e.preventDefault()
    }
  }

  /** @private */
  handleChange(e: CustomEvent) {
    if (e.detail.beforeCursor != null) {
      this.trigger(e.detail.beforeCursor)
    } else {
      this.dropdown.deactivate()
    }
  }

  /** @private */
  handleSelect(selectEvent: CustomEvent) {
    this.emit("select", selectEvent)
    if (!selectEvent.defaultPrevented) {
      this.editor.applySearchResult(selectEvent.detail.searchResult)
    }
  }

  /** @private */
  startListening() {
    this.editor
      .on("move", this.handleMove)
      .on("enter", this.handleEnter)
      .on("esc", this.handleEsc)
      .on("change", this.handleChange)
    this.dropdown.on("select", this.handleSelect)
    ;[
      "show",
      "shown",
      "render",
      "rendered",
      "selected",
      "hidden",
      "hide",
    ].forEach(eventName => {
      this.dropdown.on(eventName, () => this.emit(eventName))
    })
    this.completer.on("hit", this.handleHit)
  }

  /** @private */
  stopListening() {
    this.completer.removeAllListeners()
    this.dropdown.removeAllListeners()
    this.editor
      .removeListener("move", this.handleMove)
      .removeListener("enter", this.handleEnter)
      .removeListener("esc", this.handleEsc)
      .removeListener("change", this.handleChange)
  }
}

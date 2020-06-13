// @flow

/**
 * Create a custom event
 *
 * @private
 */
export const createCustomEvent = (() => {
  if (typeof window !== 'undefined' && typeof window.CustomEvent === "function") {
    return function(
      type: string,
      options: ?{ detail?: Object, cancelable?: boolean },
    ): CustomEvent {
      return new document.defaultView.CustomEvent(type, {
        cancelable: (options && options.cancelable) || false,
        detail: (options && options.detail) || undefined,
      })
    }
  } else {
    // Custom event polyfill from
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#polyfill
    return function(
      type: string,
      options: ?{ detail?: Object, cancelable?: boolean },
    ): CustomEvent {
      const event = document.createEvent("CustomEvent")
      event.initCustomEvent(
        type,
        /* bubbles */ false,
        (options && options.cancelable) || false,
        (options && options.detail) || undefined,
      )
      return event
    }
  }
})()

/**
 * Get the current coordinates of the `el` relative to the document.
 *
 * @private
 */
export function calculateElementOffset(
  el: HTMLElement,
): { top: number, left: number } {
  const rect = el.getBoundingClientRect()
  const { defaultView, documentElement } = el.ownerDocument
  const offset = {
    top: rect.top + defaultView.pageYOffset,
    left: rect.left + defaultView.pageXOffset,
  }
  if (documentElement) {
    offset.top -= documentElement.clientTop
    offset.left -= documentElement.clientLeft
  }
  return offset
}

const CHAR_CODE_ZERO = "0".charCodeAt(0)
const CHAR_CODE_NINE = "9".charCodeAt(0)

function isDigit(charCode: number): boolean {
  return charCode >= CHAR_CODE_ZERO && charCode <= CHAR_CODE_NINE
}

/**
 * Returns the line-height of the given node in pixels.
 *
 * @private
 */
export function getLineHeightPx(node: HTMLElement): number {
  const computedStyle = window.getComputedStyle(node)

  // If the char code starts with a digit, it is either a value in pixels,
  // or unitless, as per:
  // https://drafts.csswg.org/css2/visudet.html#propdef-line-height
  // https://drafts.csswg.org/css2/cascade.html#computed-value
  if (isDigit(computedStyle.lineHeight.charCodeAt(0))) {
    // In real browsers the value is *always* in pixels, even for unit-less
    // line-heights. However, we still check as per the spec.
    if (
      isDigit(
        computedStyle.lineHeight.charCodeAt(
          computedStyle.lineHeight.length - 1,
        ),
      )
    ) {
      return (
        parseFloat(computedStyle.lineHeight) *
        parseFloat(computedStyle.fontSize)
      )
    } else {
      return parseFloat(computedStyle.lineHeight)
    }
  }

  // Otherwise, the value is "normal".
  // If the line-height is "normal", calculate by font-size
  return calculateLineHeightPx(node.nodeName, computedStyle)
}

/**
 * Returns calculated line-height of the given node in pixels.
 *
 * @private
 */
export function calculateLineHeightPx(
  nodeName: string,
  computedStyle: CSSStyleDeclaration,
): number {
  const body = document.body
  if (!body) {
    return 0
  }

  const tempNode = document.createElement(nodeName)
  tempNode.innerHTML = "&nbsp;"
  tempNode.style.fontSize = computedStyle.fontSize
  tempNode.style.fontFamily = computedStyle.fontFamily
  tempNode.style.padding = "0"
  body.appendChild(tempNode)

  // Make sure textarea has only 1 row
  if (tempNode instanceof HTMLTextAreaElement) {
    ;(tempNode: HTMLTextAreaElement).rows = 1
  }

  // Assume the height of the element is the line-height
  const height = tempNode.offsetHeight
  body.removeChild(tempNode)

  return height
}

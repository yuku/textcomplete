/**
 * @jest-environment jsdom
 */

import { createCustomEvent } from "./utils"

describe("createCustomEvent()", () => {
  it("returns CustomEvent", () => {
    const event = createCustomEvent("hello")
    expect(event.type).toEqual("hello")
  })
})

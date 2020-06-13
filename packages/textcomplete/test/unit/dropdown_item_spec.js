require("../test_helper")

import Dropdown from "../../src/dropdown"
import { createDropdownItem } from "../test_utils"

const assert = require("power-assert")

describe("DropdownItem", function() {
  var dropdown, dropdownItem

  beforeEach(function() {
    dropdown = new Dropdown({})
    dropdownItem = createDropdownItem(dropdown)
  })

  describe("#activate", function() {
    it("should change #active to true", function() {
      dropdownItem.active = false
      dropdownItem.activate()
      assert.equal(dropdownItem.active, true)
    })

    it('should add "active" to #el.className', function() {
      dropdownItem.active = false
      assert(dropdownItem.el.className.indexOf("active") === -1)
      dropdownItem.activate()
      assert(dropdownItem.el.className.indexOf("active") !== -1)
    })

    context("when there is active item", function() {
      var activeItem

      beforeEach(function() {
        activeItem = createDropdownItem(dropdown)
        activeItem.activate()
      })

      it("should deactivate the active item", function() {
        assert(activeItem.active)
        dropdownItem.activate()
        assert(!activeItem.active)
      })
    })
  })
})

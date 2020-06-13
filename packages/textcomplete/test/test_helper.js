const sinon = require("sinon")

beforeEach(function() {
  this.sinon = sinon.sandbox.create()
})

afterEach(function() {
  this.sinon.restore()

  const elements = document.getElementsByClassName("textcomplete-dropdown")
  for (let i = 0, l = elements.length; i < l; i++) {
    const element = elements[i]
    if (element) {
      element.parentNode.removeChild(element)
    }
  }
})

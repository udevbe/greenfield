'use strict'
import assert from '../utils/assert'

/**
 * Represents a WebGL shader script.
 */

export default class Script {
  static createFromElementId (id) {
    const script = document.getElementById(id)

    // Didn't find an element with the specified ID, abort.
    assert(script, 'Could not find shader with ID: ' + id)

    // Walk through the source element's children, building the shader source string.
    let source = ''
    let currentChild = script.firstChild
    while (currentChild) {
      if (currentChild.nodeType === 3) {
        source += currentChild.textContent
      }
      currentChild = currentChild.nextSibling
    }

    const res = new Scriptor()
    res.type = script.type
    res.source = source
    return res
  }

  static createFromSource (type, source) {
    const res = new Script()
    res.type = type
    res.source = source
    return res
  }
}

'use strict'
import error from './error'

export default function (condition, message) {
  if (!condition) {
    error(message)
  }
}

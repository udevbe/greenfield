'use strict'

module.exports = class LocalKeyboard {
  static create () {
    return new LocalKeyboard()
  }

  constructor () {
    this.resource = null
  }

  /**
   *
   *                This event provides a file descriptor to the client which can be
   *                memory-mapped to provide a keyboard mapping description.
   *
   *
   * @param {Number} format keymap format
   * @param {*} transfer keymap file descriptor
   * @param {Number} size keymap size, in bytes
   *
   * @since 1
   *
   */
  keymap (format, transfer, size) {}

  /**
   *
   *                Notification that this seat's keyboard focus is on a certain
   *                surface.
   *
   *
   * @param {Number} serial serial number of the enter event
   * @param {*} surface surface gaining keyboard focus
   * @param {ArrayBuffer} keys the currently pressed keys
   *
   * @since 1
   *
   */
  enter (serial, surface, keys) {}

  /**
   *
   *                Notification that this seat's keyboard focus is no longer on
   *                a certain surface.
   *
   *                The leave notification is sent before the enter notification
   *                for the new focus.
   *
   *
   * @param {Number} serial serial number of the leave event
   * @param {*} surface surface that lost keyboard focus
   *
   * @since 1
   *
   */
  leave (serial, surface) {}

  /**
   *
   *                A key was pressed or released.
   *                The time argument is a timestamp with millisecond
   *                granularity, with an undefined base.
   *
   *
   * @param {Number} serial serial number of the key event
   * @param {Number} time timestamp with millisecond granularity
   * @param {Number} key key that produced the event
   * @param {Number} state physical state of the key
   *
   * @since 1
   *
   */
  key (serial, time, key, state) {}

  /**
   *
   *                Notifies clients that the modifier and/or group state has
   *                changed, and it should update its local state.
   *
   *
   * @param {Number} serial serial number of the modifiers event
   * @param {Number} modsDepressed depressed modifiers
   * @param {Number} modsLatched latched modifiers
   * @param {Number} modsLocked locked modifiers
   * @param {Number} group keyboard layout
   *
   * @since 1
   *
   */
  modifiers (serial, modsDepressed, modsLatched, modsLocked, group) {}

  /**
   *
   *                Informs the client about the keyboard's repeat rate and delay.
   *
   *                This event is sent as soon as the gr_keyboard object has been created,
   *                and is guaranteed to be received by the client before any key press
   *                event.
   *
   *                Negative values for either rate or delay are illegal. A rate of zero
   *                will disable any repeating (regardless of the value of delay).
   *
   *                This event can be sent later on as well with a new value if necessary,
   *                so clients should continue listening for the event past the creation
   *                of gr_keyboard.
   *
   *
   * @param {Number} rate the rate of repeating keys in characters per second
   * @param {Number} delay delay in milliseconds since key down until repeating starts
   *
   * @since 4
   *
   */
  repeatInfo (rate, delay) {}
}

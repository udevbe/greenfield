'use strict'

// Wayland Global
class LocalSeat {
  /**
   * @return {LocalSeat}
   */
  static create () {
    return new LocalSeat()
  }

  constructor () {
    /**
     * @type {WlSeat|null}
     */
    this.resource = null
  }

  /**
   *
   *                This is emitted whenever a seat gains or loses the pointer,
   *                keyboard or touch capabilities.  The argument is a capability
   *                enum containing the complete set of capabilities this seat has.
   *
   *                When the pointer capability is added, a client may create a
   *                gr_pointer object using the gr_seat.get_pointer request. This object
   *                will receive pointer events until the capability is removed in the
   *                future.
   *
   *                When the pointer capability is removed, a client should destroy the
   *                gr_pointer objects associated with the seat where the capability was
   *                removed, using the gr_pointer.release request. No further pointer
   *                events will be received on these objects.
   *
   *                In some compositors, if a seat regains the pointer capability and a
   *                client has a previously obtained gr_pointer object of version 4 or
   *                less, that object may start sending pointer events again. This
   *                behavior is considered a misinterpretation of the intended behavior
   *                and must not be relied upon by the client. gr_pointer objects of
   *                version 5 or later must not send events if created before the most
   *                recent event notifying the client of an added pointer capability.
   *
   *                The above behavior also applies to gr_keyboard and gr_touch with the
   *                keyboard and touch capabilities, respectively.
   *
   *
   * @param {Number} capabilities capabilities of the seat
   *
   * @since 1
   *
   */
  capabilities (capabilities) {
    this.resource.capabilities(capabilities)
  }

  /**
   *
   *                In a multiseat configuration this can be used by the client to help
   *                identify which physical devices the seat represents. Based on
   *                the seat configuration used by the compositor.
   *
   *
   * @param {string} name seat identifier
   *
   * @since 2
   *
   */
  name (name) {
    this.resource.name(name)
  }
}

module.exports = LocalSeat

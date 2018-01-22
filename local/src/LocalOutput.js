'use strict'

module.exports = class LocalOutput {
  static create () {
    return new LocalOutput()
  }

  constructor () {
    // set when resource is created
    this.resource = null
  }

  /**
   *
   *                The geometry event describes geometric properties of the output.
   *                The event is sent when binding to the output object and whenever
   *                any of the properties change.
   *
   *
   * @param {Number} x x position within the global compositor space
   * @param {Number} y y position within the global compositor space
   * @param {Number} physicalWidth width in millimeters of the output
   * @param {Number} physicalHeight height in millimeters of the output
   * @param {Number} subpixel subpixel orientation of the output
   * @param {string} make textual description of the manufacturer
   * @param {string} model textual description of the model
   * @param {Number} transform transform that maps framebuffer to output
   *
   * @since 1
   *
   */
  geometry (x, y, physicalWidth, physicalHeight, subpixel, make, model, transform) {
    this.resource.geometry(x, y, physicalWidth, physicalHeight, subpixel, make, model, transform)
  }

  /**
   *
   *                The mode event describes an available mode for the output.
   *
   *                The event is sent when binding to the output object and there
   *                will always be one mode, the current mode.  The event is sent
   *                again if an output changes mode, for the mode that is now
   *                current.  In other words, the current mode is always the last
   *                mode that was received with the current flag set.
   *
   *                The size of a mode is given in physical hardware units of
   *                the output device. This is not necessarily the same as
   *                the output size in the global compositor space. For instance,
   *                the output may be scaled, as described in gr_output.scale,
   *                or transformed, as described in gr_output.transform.
   *
   *
   * @param {Number} flags bitfield of mode flags
   * @param {Number} width width of the mode in hardware units
   * @param {Number} height height of the mode in hardware units
   * @param {Number} refresh vertical refresh rate in mHz
   *
   * @since 1
   *
   */
  mode (flags, width, height, refresh) {
    this.resource.mode(flags, width, height, refresh)
  }

  /**
   *
   *                This event is sent after all other properties have been
   *                sent after binding to the output object and after any
   *                other property changes done after that. This allows
   *                changes to the output properties to be seen as
   *                atomic, even if they happen via multiple events.
   *
   * @since 2
   *
   */
  done () {
    this.resource.done()
  }

  /**
   *
   *                This event contains scaling geometry information
   *                that is not in the geometry event. It may be sent after
   *                binding the output object or if the output scale changes
   *                later. If it is not sent, the client should assume a
   *                scale of 1.
   *
   *                A scale larger than 1 means that the compositor will
   *                automatically scale surface buffers by this amount
   *                when rendering. This is used for very high resolution
   *                displays where applications rendering at the native
   *                resolution would be too small to be legible.
   *
   *                It is intended that scaling aware clients track the
   *                current output of a surface, and if it is on a scaled
   *                output it should use gr_surface.set_buffer_scale with
   *                the scale of the output. That way the compositor can
   *                avoid scaling the surface, and the client can supply
   *                a higher detail image.
   *
   *
   * @param {Number} factor scaling factor of output
   *
   * @since 2
   *
   */
  scale (factor) {
    this.resource.scale(factor)
  }
}

'use strict'

const gstreamer = require('gstreamer-superficial')

module.exports = class PNGEncoder {
  /**
   * @param {number}width
   * @param {number}height
   * @return {module.PNGEncoder}
   */
  static create (width, height) {
    const pipeline = new gstreamer.Pipeline(
      'appsrc name=source ! ' +
      'videoconvert ! video/x-raw,format=RGBA,width=' + width + ',height=' + height + ' !' +
      'pngenc !' +
      'appsink name=sink'
    )
    const appsink = pipeline.findChild('sink')
    const appsrc = pipeline.findChild('source')
    return new PNGEncoder(pipeline, appsink, appsrc, width, height)
  }

  constructor (pipeline, appsink, appsrc, width, height) {
    this.pipeline = pipeline
    this.sink = appsink
    this.src = appsrc
    this.width = width
    this.height = height
  }
}

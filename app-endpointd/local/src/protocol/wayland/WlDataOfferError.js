const namespace = require('wayland-server-bindings-runtime').namespace

const WlDataOffer_Error = {
  /**
   * finish request was called untimely
   */
  invalidFinish: 0,
  /**
   * action mask contains invalid values
   */
  invalidActionMask: 1,
  /**
   * action argument has an invalid value
   */
  invalidAction: 2,
  /**
   * offer doesn't accept this request
   */
  invalidOffer: 3
}

namespace.WlDataOffer_Error = WlDataOffer_Error
module.exports = WlDataOffer_Error

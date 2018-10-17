const namespace = require('wayland-server-bindings-runtime').namespace

const WlDataDeviceManager_DndAction = {
  /**
   * no action
   */
  none: 0,
  /**
   * copy action
   */
  copy: 1,
  /**
   * move action
   */
  move: 2,
  /**
   * ask action
   */
  ask: 4
}

namespace.WlDataDeviceManager_DndAction = WlDataDeviceManager_DndAction
module.exports = WlDataDeviceManager_DndAction

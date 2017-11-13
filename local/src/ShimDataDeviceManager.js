'use strict'

const WlDataDeviceManagerRequests = require('./protocol/wayland/WlDataDeviceManagerRequests')
const WlDataSource = require('./protocol/wayland/WlDataSource')
const WlDataDevice = require('./protocol/wayland/WlDataDevice')

const LocalDataSource = require('./LocalDataSource')
const LocalDataDevice = require('./LocalDataDevice')
const ShimDataDevice = require('./ShimDataDevice')
const ShimDataSource = require('./ShimDataSource')

module.exports = class ShimDataDeviceManager extends WlDataDeviceManagerRequests {
  /**
   *
   * @param {GrDataDeviceManager} grDataDeviceManagerProxy
   * @return {module.ShimDataDeviceManager}
   */
  static create (grDataDeviceManagerProxy) {
    return new ShimDataDeviceManager(grDataDeviceManagerProxy)
  }

  /**
   * @private
   * @param {GrDataDevice} grDataDeviceManagerProxy
   */
  constructor (grDataDeviceManagerProxy) {
    super()
    this.proxy = grDataDeviceManagerProxy
  }

  createDataSource (resource, id) {
    const grDataSourceProxy = this.proxy.createDataSource()
    const localDataSource = LocalDataSource.create()
    grDataSourceProxy.listener = localDataSource

    const shimDataSource = ShimDataSource.create(grDataSourceProxy)
    localDataSource.resource = WlDataSource.create(resource.client, resource.version, id, shimDataSource, null)
  }

  getDataDevice (resource, id, seat) {
    const grDataDeviceProxy = this.proxy.getDataDevice(seat.implementation.proxy)
    const localDataDevice = LocalDataDevice.create(seat.implementation.proxy.connection)
    grDataDeviceProxy.listener = localDataDevice

    const shimDataDevice = ShimDataDevice.create(grDataDeviceProxy)
    localDataDevice.resource = WlDataDevice.create(resource.client, resource.version, id, shimDataDevice, null)
  }
}

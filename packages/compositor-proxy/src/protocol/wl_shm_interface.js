const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('create_pool', 'nhi', [require('./wl_shm_pool_interface'), null, null])
]

const events = [
	createWlMessage('format', 'u', [null])
]

initWlInterface(wlInterface, 'wl_shm', 1, requests, events)

const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('destroy', '', [])
]

const events = [
	createWlMessage('release', '', [])
]

initWlInterface(wlInterface, 'wl_buffer', 1, requests, events)

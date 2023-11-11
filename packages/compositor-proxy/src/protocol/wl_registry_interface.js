const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('bind', 'un', [null, null])
]

const events = [
	createWlMessage('global', 'usu', [null, null, null]), 
	createWlMessage('global_remove', 'u', [null])
]

initWlInterface(wlInterface, 'wl_registry', 1, requests, events)

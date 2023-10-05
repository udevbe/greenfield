const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('sync', 'n', [require('./wl_callback_interface')]), 
	createWlMessage('get_registry', 'n', [require('./wl_registry_interface')])
]

const events = [
	createWlMessage('error', 'ous', [null, null, null]), 
	createWlMessage('delete_id', 'u', [null])
]

initWlInterface(wlInterface, 'wl_display', 1, requests, events)

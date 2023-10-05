const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('authenticate', 'u', [null]), 
	createWlMessage('create_buffer', 'nuiiuu', [require('./wl_buffer_interface'), null, null, null, null, null]), 
	createWlMessage('create_planar_buffer', 'nuiiuiiiiii', [require('./wl_buffer_interface'), null, null, null, null, null, null, null, null, null, null]), 
	createWlMessage('create_prime_buffer', 'nhiiuiiiiii', [require('./wl_buffer_interface'), null, null, null, null, null, null, null, null, null, null])
]

const events = [
	createWlMessage('device', 's', [null]), 
	createWlMessage('format', 'u', [null]), 
	createWlMessage('authenticated', '', []), 
	createWlMessage('capabilities', 'u', [null])
]

initWlInterface(wlInterface, 'wl_drm', 2, requests, events)

const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('destroy', '', []), 
	createWlMessage('create_positioner', 'n', [require('./xdg_positioner_interface')]), 
	createWlMessage('get_xdg_surface', 'no', [require('./xdg_surface_interface'), require('./wl_surface_interface')]), 
	createWlMessage('pong', 'u', [null])
]

const events = [
	createWlMessage('ping', 'u', [null])
]

initWlInterface(wlInterface, 'xdg_wm_base', 1, requests, events)

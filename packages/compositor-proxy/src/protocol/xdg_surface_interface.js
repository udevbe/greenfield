const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('destroy', '', []), 
	createWlMessage('get_toplevel', 'n', [require('./xdg_toplevel_interface')]), 
	createWlMessage('get_popup', 'n?oo', [require('./xdg_popup_interface'), wlInterface, require('./xdg_positioner_interface')]), 
	createWlMessage('set_window_geometry', 'iiii', [null, null, null, null]), 
	createWlMessage('ack_configure', 'u', [null])
]

const events = [
	createWlMessage('configure', 'u', [null])
]

initWlInterface(wlInterface, 'xdg_surface', 1, requests, events)

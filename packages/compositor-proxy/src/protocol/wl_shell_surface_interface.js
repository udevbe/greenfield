const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('pong', 'u', [null]), 
	createWlMessage('move', 'ou', [require('./wl_seat_interface'), null]), 
	createWlMessage('resize', 'ouu', [require('./wl_seat_interface'), null, null]), 
	createWlMessage('set_toplevel', '', []), 
	createWlMessage('set_transient', 'oiiu', [require('./wl_surface_interface'), null, null, null]), 
	createWlMessage('set_fullscreen', 'uu?o', [null, null, require('./wl_output_interface')]), 
	createWlMessage('set_popup', 'ouoiiu', [require('./wl_seat_interface'), null, require('./wl_surface_interface'), null, null, null]), 
	createWlMessage('set_maximized', '?o', [require('./wl_output_interface')]), 
	createWlMessage('set_title', 's', [null]), 
	createWlMessage('set_class', 's', [null])
]

const events = [
	createWlMessage('ping', 'u', [null]), 
	createWlMessage('configure', 'uii', [null, null, null]), 
	createWlMessage('popup_done', '', [])
]

initWlInterface(wlInterface, 'wl_shell_surface', 1, requests, events)

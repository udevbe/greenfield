const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('destroy', '', []), 
	createWlMessage('set_parent', '?o', [wlInterface]), 
	createWlMessage('set_title', 's', [null]), 
	createWlMessage('set_app_id', 's', [null]), 
	createWlMessage('show_window_menu', 'ouii', [require('./wl_seat_interface'), null, null, null]), 
	createWlMessage('move', 'ou', [require('./wl_seat_interface'), null]), 
	createWlMessage('resize', 'ouu', [require('./wl_seat_interface'), null, null]), 
	createWlMessage('set_max_size', 'ii', [null, null]), 
	createWlMessage('set_min_size', 'ii', [null, null]), 
	createWlMessage('set_maximized', '', []), 
	createWlMessage('unset_maximized', '', []), 
	createWlMessage('set_fullscreen', '?o', [require('./wl_output_interface')]), 
	createWlMessage('unset_fullscreen', '', []), 
	createWlMessage('set_minimized', '', [])
]

const events = [
	createWlMessage('configure', 'iia', [null, null, null]), 
	createWlMessage('close', '', [])
]

initWlInterface(wlInterface, 'xdg_toplevel', 1, requests, events)

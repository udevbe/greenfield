const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('destroy', '', []), 
	createWlMessage('set_position', 'ii', [null, null]), 
	createWlMessage('place_above', 'o', [require('./wl_surface_interface')]), 
	createWlMessage('place_below', 'o', [require('./wl_surface_interface')]), 
	createWlMessage('set_sync', '', []), 
	createWlMessage('set_desync', '', [])
]

const events = [

]

initWlInterface(wlInterface, 'wl_subsurface', 1, requests, events)

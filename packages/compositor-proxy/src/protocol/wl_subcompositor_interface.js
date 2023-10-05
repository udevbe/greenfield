const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('destroy', '', []), 
	createWlMessage('get_subsurface', 'noo', [require('./wl_subsurface_interface'), require('./wl_surface_interface'), require('./wl_surface_interface')])
]

const events = [

]

initWlInterface(wlInterface, 'wl_subcompositor', 1, requests, events)

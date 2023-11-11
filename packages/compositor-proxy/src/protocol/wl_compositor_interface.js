const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('create_surface', 'n', [require('./wl_surface_interface')]), 
	createWlMessage('create_region', 'n', [require('./wl_region_interface')])
]

const events = [

]

initWlInterface(wlInterface, 'wl_compositor', 4, requests, events)

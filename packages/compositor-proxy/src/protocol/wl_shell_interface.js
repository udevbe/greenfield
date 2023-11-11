const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('get_shell_surface', 'no', [require('./wl_shell_surface_interface'), require('./wl_surface_interface')])
]

const events = [

]

initWlInterface(wlInterface, 'wl_shell', 1, requests, events)

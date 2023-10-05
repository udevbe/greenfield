const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('release', '', [])
]

const events = [
	createWlMessage('keymap', 'uhu', [null, null, null]), 
	createWlMessage('enter', 'uoa', [null, require('./wl_surface_interface'), null]), 
	createWlMessage('leave', 'uo', [null, require('./wl_surface_interface')]), 
	createWlMessage('key', 'uuuu', [null, null, null, null]), 
	createWlMessage('modifiers', 'uuuuu', [null, null, null, null, null]), 
	createWlMessage('repeat_info', 'ii', [null, null])
]

initWlInterface(wlInterface, 'wl_keyboard', 6, requests, events)

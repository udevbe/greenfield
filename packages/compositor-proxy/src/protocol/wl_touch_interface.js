const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('release', '', [])
]

const events = [
	createWlMessage('down', 'uuoiff', [null, null, require('./wl_surface_interface'), null, null, null]), 
	createWlMessage('up', 'uui', [null, null, null]), 
	createWlMessage('motion', 'uiff', [null, null, null, null]), 
	createWlMessage('frame', '', []), 
	createWlMessage('cancel', '', []), 
	createWlMessage('shape', 'iff', [null, null, null]), 
	createWlMessage('orientation', 'if', [null, null])
]

initWlInterface(wlInterface, 'wl_touch', 6, requests, events)

const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('release', '', [])
]

const events = [
	createWlMessage('geometry', 'iiiiissi', [null, null, null, null, null, null, null, null]), 
	createWlMessage('mode', 'uiii', [null, null, null, null]), 
	createWlMessage('done', '', []), 
	createWlMessage('scale', 'i', [null])
]

initWlInterface(wlInterface, 'wl_output', 3, requests, events)

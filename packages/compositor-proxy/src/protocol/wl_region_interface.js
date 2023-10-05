const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('destroy', '', []), 
	createWlMessage('add', 'iiii', [null, null, null, null]), 
	createWlMessage('subtract', 'iiii', [null, null, null, null])
]

const events = [

]

initWlInterface(wlInterface, 'wl_region', 1, requests, events)

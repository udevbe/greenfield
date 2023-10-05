const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [

]

const events = [
	createWlMessage('done', 'u', [null])
]

initWlInterface(wlInterface, 'wl_callback', 1, requests, events)

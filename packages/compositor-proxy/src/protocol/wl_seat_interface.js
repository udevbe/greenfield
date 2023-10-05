const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('get_pointer', 'n', [require('./wl_pointer_interface')]), 
	createWlMessage('get_keyboard', 'n', [require('./wl_keyboard_interface')]), 
	createWlMessage('get_touch', 'n', [require('./wl_touch_interface')]), 
	createWlMessage('release', '', [])
]

const events = [
	createWlMessage('capabilities', 'u', [null]), 
	createWlMessage('name', 's', [null])
]

initWlInterface(wlInterface, 'wl_seat', 6, requests, events)

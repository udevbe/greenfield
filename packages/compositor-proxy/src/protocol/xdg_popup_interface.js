const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('destroy', '', []), 
	createWlMessage('grab', 'ou', [require('./wl_seat_interface'), null])
]

const events = [
	createWlMessage('configure', 'iiii', [null, null, null, null]), 
	createWlMessage('popup_done', '', [])
]

initWlInterface(wlInterface, 'xdg_popup', 1, requests, events)

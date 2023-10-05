const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('accept', 'u?s', [null, null]), 
	createWlMessage('receive', 'sh', [null, null]), 
	createWlMessage('destroy', '', []), 
	createWlMessage('finish', '', []), 
	createWlMessage('set_actions', 'uu', [null, null])
]

const events = [
	createWlMessage('offer', 's', [null]), 
	createWlMessage('source_actions', 'u', [null]), 
	createWlMessage('action', 'u', [null])
]

initWlInterface(wlInterface, 'wl_data_offer', 3, requests, events)

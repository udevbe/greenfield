const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('offer', 's', [null]), 
	createWlMessage('destroy', '', []), 
	createWlMessage('set_actions', 'u', [null])
]

const events = [
	createWlMessage('target', '?s', [null]), 
	createWlMessage('send', 'sh', [null, null]), 
	createWlMessage('cancelled', '', []), 
	createWlMessage('dnd_drop_performed', '', []), 
	createWlMessage('dnd_finished', '', []), 
	createWlMessage('action', 'u', [null])
]

initWlInterface(wlInterface, 'wl_data_source', 3, requests, events)

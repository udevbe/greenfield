const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('destroy', '', []), 
	createWlMessage('set_size', 'ii', [null, null]), 
	createWlMessage('set_anchor_rect', 'iiii', [null, null, null, null]), 
	createWlMessage('set_anchor', 'u', [null]), 
	createWlMessage('set_gravity', 'u', [null]), 
	createWlMessage('set_constraint_adjustment', 'u', [null]), 
	createWlMessage('set_offset', 'ii', [null, null])
]

const events = [

]

initWlInterface(wlInterface, 'xdg_positioner', 1, requests, events)

const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('set_cursor', 'u?oii', [null, require('./wl_surface_interface'), null, null]), 
	createWlMessage('release', '', [])
]

const events = [
	createWlMessage('enter', 'uoff', [null, require('./wl_surface_interface'), null, null]), 
	createWlMessage('leave', 'uo', [null, require('./wl_surface_interface')]), 
	createWlMessage('motion', 'uff', [null, null, null]), 
	createWlMessage('button', 'uuuu', [null, null, null, null]), 
	createWlMessage('axis', 'uuf', [null, null, null]), 
	createWlMessage('frame', '', []), 
	createWlMessage('axis_source', 'u', [null]), 
	createWlMessage('axis_stop', 'uu', [null, null]), 
	createWlMessage('axis_discrete', 'ui', [null, null])
]

initWlInterface(wlInterface, 'wl_pointer', 6, requests, events)

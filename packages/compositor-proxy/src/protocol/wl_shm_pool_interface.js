const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('create_buffer', 'niiiiu', [require('./wl_buffer_interface'), null, null, null, null, null]), 
	createWlMessage('destroy', '', []), 
	createWlMessage('resize', 'i', [null])
]

const events = [

]

initWlInterface(wlInterface, 'wl_shm_pool', 1, requests, events)

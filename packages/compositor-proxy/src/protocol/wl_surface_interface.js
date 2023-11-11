const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('destroy', '', []), 
	createWlMessage('attach', '?oii', [require('./wl_buffer_interface'), null, null]), 
	createWlMessage('damage', 'iiii', [null, null, null, null]), 
	createWlMessage('frame', 'n', [require('./wl_callback_interface')]), 
	createWlMessage('set_opaque_region', '?o', [require('./wl_region_interface')]), 
	createWlMessage('set_input_region', '?o', [require('./wl_region_interface')]), 
	createWlMessage('commit', '', []), 
	createWlMessage('set_buffer_transform', 'i', [null]), 
	createWlMessage('set_buffer_scale', 'i', [null]), 
	createWlMessage('damage_buffer', 'iiii', [null, null, null, null])
]

const events = [
	createWlMessage('enter', 'o', [require('./wl_output_interface')]), 
	createWlMessage('leave', 'o', [require('./wl_output_interface')])
]

initWlInterface(wlInterface, 'wl_surface', 4, requests, events)

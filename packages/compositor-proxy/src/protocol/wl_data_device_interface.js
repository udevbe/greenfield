const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('start_drag', '?oo?ou', [require('./wl_data_source_interface'), require('./wl_surface_interface'), require('./wl_surface_interface'), null]), 
	createWlMessage('set_selection', '?ou', [require('./wl_data_source_interface'), null]), 
	createWlMessage('release', '', [])
]

const events = [
	createWlMessage('data_offer', 'n', [require('./wl_data_offer_interface')]), 
	createWlMessage('enter', 'uoff?o', [null, require('./wl_surface_interface'), null, null, require('./wl_data_offer_interface')]), 
	createWlMessage('leave', '', []), 
	createWlMessage('motion', 'uff', [null, null, null]), 
	createWlMessage('drop', '', []), 
	createWlMessage('selection', '?o', [require('./wl_data_offer_interface')])
]

initWlInterface(wlInterface, 'wl_data_device', 3, requests, events)

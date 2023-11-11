const { createWlInterface, createWlMessage, initWlInterface } = require('../wayland-server')

const wlInterface = createWlInterface()
module.exports = wlInterface
const requests = [
	createWlMessage('create_data_source', 'n', [require('./wl_data_source_interface')]), 
	createWlMessage('get_data_device', 'no', [require('./wl_data_device_interface'), require('./wl_seat_interface')])
]

const events = [

]

initWlInterface(wlInterface, 'wl_data_device_manager', 3, requests, events)

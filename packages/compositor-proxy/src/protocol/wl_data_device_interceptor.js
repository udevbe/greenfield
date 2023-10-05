const { createWlResource, unmarshallArgs } = require('../wayland-server')

class wl_data_device_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
		}
		this.eventHandlers = {
			dataOffer: (id) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_data_offer_interface`))
					interceptors[id] =  new (require(`./wl_data_offer_interceptor`))(wlClient, interceptors, version, remoteResource, userData)
					return { native: false, browser: true }
			},
		}
	}

	E0 (message) {
		const args = unmarshallArgs(message,'n')
		return this.eventHandlers.dataOffer(...args)
	}
}
module.exports = wl_data_device_interceptor

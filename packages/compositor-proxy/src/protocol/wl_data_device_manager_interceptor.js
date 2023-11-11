const { createWlResource, unmarshallArgs } = require('../wayland-server')

class wl_data_device_manager_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
			createDataSource: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_data_source_interface`))
					interceptors[id] =  new (require(`./wl_data_source_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
			getDataDevice: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_data_device_interface`))
					interceptors[id] =  new (require(`./wl_data_device_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
		}
		this.eventHandlers = {
		}
	}

	R0 (message) {
		const args = unmarshallArgs(message,'n')
		return this.requestHandlers.createDataSource(...args)
	}
	R1 (message) {
		const args = unmarshallArgs(message,'no')
		return this.requestHandlers.getDataDevice(...args)
	}
}
module.exports = wl_data_device_manager_interceptor

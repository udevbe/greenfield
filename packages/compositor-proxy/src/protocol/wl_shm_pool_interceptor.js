const { createWlResource, unmarshallArgs } = require('../wayland-server')

class wl_shm_pool_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
			createBuffer: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_buffer_interface`))
					interceptors[id] =  new (require(`./wl_buffer_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
		}
		this.eventHandlers = {
		}
	}

	R0 (message) {
		const args = unmarshallArgs(message,'niiiiu')
		return this.requestHandlers.createBuffer(...args)
	}
}
module.exports = wl_shm_pool_interceptor

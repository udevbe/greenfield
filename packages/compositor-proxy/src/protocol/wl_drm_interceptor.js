const { createWlResource, unmarshallArgs } = require('../wayland-server')

class wl_drm_interceptor {
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
			createPlanarBuffer: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_buffer_interface`))
					interceptors[id] =  new (require(`./wl_buffer_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
			createPrimeBuffer: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_buffer_interface`))
					interceptors[id] =  new (require(`./wl_buffer_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
		}
		this.eventHandlers = {
		}
	}

	R1 (message) {
		const args = unmarshallArgs(message,'nuiiuu')
		return this.requestHandlers.createBuffer(...args)
	}
	R2 (message) {
		const args = unmarshallArgs(message,'nuiiuiiiiii')
		return this.requestHandlers.createPlanarBuffer(...args)
	}
	R3 (message) {
		const args = unmarshallArgs(message,'nhiiuiiiiii')
		return this.requestHandlers.createPrimeBuffer(...args)
	}
}
module.exports = wl_drm_interceptor

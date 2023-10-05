const { createWlResource, unmarshallArgs } = require('../wayland-server')

class wl_compositor_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
			createSurface: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_surface_interface`))
					interceptors[id] =  new (require(`./wl_surface_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
			createRegion: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_region_interface`))
					interceptors[id] =  new (require(`./wl_region_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
		}
		this.eventHandlers = {
		}
	}

	R0 (message) {
		const args = unmarshallArgs(message,'n')
		return this.requestHandlers.createSurface(...args)
	}
	R1 (message) {
		const args = unmarshallArgs(message,'n')
		return this.requestHandlers.createRegion(...args)
	}
}
module.exports = wl_compositor_interceptor

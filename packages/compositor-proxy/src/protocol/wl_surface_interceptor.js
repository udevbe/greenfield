const { createWlResource, unmarshallArgs } = require('../wayland-server')

class wl_surface_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
			frame: (callback, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, callback, version, require(`./wl_callback_interface`))
					interceptors[callback] =  new (require(`./wl_callback_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, callback)
					return { native: false, browser: true }
			},
		}
		this.eventHandlers = {
		}
	}

	R3 (message) {
		const args = unmarshallArgs(message,'n')
		return this.requestHandlers.frame(...args)
	}
}
module.exports = wl_surface_interceptor

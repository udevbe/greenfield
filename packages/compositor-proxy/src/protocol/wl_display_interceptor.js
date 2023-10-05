const { createWlResource, unmarshallArgs } = require('../wayland-server')

class wl_display_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
			sync: (callback, ...constructionArgs) => {
					interceptors[callback] =  new (require(`./wl_callback_interceptor`))(wlClient, interceptors, version, null, userData)
					return { native: true, browser: true }
			},
			getRegistry: (registry, ...constructionArgs) => {
					interceptors[registry] =  new (require(`./wl_registry_interceptor`))(wlClient, interceptors, version, null, userData)
					return { native: true, browser: true }
			},
		}
		this.eventHandlers = {
		}
	}

	R0 (message) {
		const args = unmarshallArgs(message,'n')
		return this.requestHandlers.sync(...args)
	}
	R1 (message) {
		const args = unmarshallArgs(message,'n')
		return this.requestHandlers.getRegistry(...args)
	}
}
module.exports = wl_display_interceptor

const { createWlResource, unmarshallArgs } = require('../wayland-server')

class wl_subcompositor_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
			getSubsurface: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_subsurface_interface`))
					interceptors[id] =  new (require(`./wl_subsurface_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
		}
		this.eventHandlers = {
		}
	}

	R1 (message) {
		const args = unmarshallArgs(message,'noo')
		return this.requestHandlers.getSubsurface(...args)
	}
}
module.exports = wl_subcompositor_interceptor

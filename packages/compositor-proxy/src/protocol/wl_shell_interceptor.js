const { createWlResource, unmarshallArgs } = require('../wayland-server')

class wl_shell_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
			getShellSurface: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_shell_surface_interface`))
					interceptors[id] =  new (require(`./wl_shell_surface_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
		}
		this.eventHandlers = {
		}
	}

	R0 (message) {
		const args = unmarshallArgs(message,'no')
		return this.requestHandlers.getShellSurface(...args)
	}
}
module.exports = wl_shell_interceptor

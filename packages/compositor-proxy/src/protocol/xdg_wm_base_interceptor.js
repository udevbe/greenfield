const { createWlResource, unmarshallArgs } = require('../wayland-server')

class xdg_wm_base_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
			createPositioner: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./xdg_positioner_interface`))
					interceptors[id] =  new (require(`./xdg_positioner_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
			getXdgSurface: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./xdg_surface_interface`))
					interceptors[id] =  new (require(`./xdg_surface_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
		}
		this.eventHandlers = {
		}
	}

	R1 (message) {
		const args = unmarshallArgs(message,'n')
		return this.requestHandlers.createPositioner(...args)
	}
	R2 (message) {
		const args = unmarshallArgs(message,'no')
		return this.requestHandlers.getXdgSurface(...args)
	}
}
module.exports = xdg_wm_base_interceptor

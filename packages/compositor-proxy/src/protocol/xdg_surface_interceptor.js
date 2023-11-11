const { createWlResource, unmarshallArgs } = require('../wayland-server')

class xdg_surface_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
			getToplevel: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./xdg_toplevel_interface`))
					interceptors[id] =  new (require(`./xdg_toplevel_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
			getPopup: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./xdg_popup_interface`))
					interceptors[id] =  new (require(`./xdg_popup_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
		}
		this.eventHandlers = {
		}
	}

	R1 (message) {
		const args = unmarshallArgs(message,'n')
		return this.requestHandlers.getToplevel(...args)
	}
	R2 (message) {
		const args = unmarshallArgs(message,'n?oo')
		return this.requestHandlers.getPopup(...args)
	}
}
module.exports = xdg_surface_interceptor

const { createWlResource, unmarshallArgs } = require('../wayland-server')

class xdg_popup_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
		}
		this.eventHandlers = {
		}
	}

}
module.exports = xdg_popup_interceptor

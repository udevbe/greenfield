const { createWlResource, unmarshallArgs } = require('../wayland-server')

class wl_registry_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
			bind: (name, interface_, version, id) => {
				if (require('../wayland-server').nativeGlobalNames.includes(name)) {
					return { native: true, browser: false }
				} else {
					const remoteResource = createWlResource(wlClient, id, version, require(`./${interface_}_interface`))
					interceptors[id] =  new (require(`./${interface_}_interceptor`))(wlClient, interceptors, version, remoteResource, userData)
					return { native: false, browser: true }
				}
			},
		}
		this.eventHandlers = {
		}
	}

	R0 (message) {
		const args = unmarshallArgs(message,'usun')
		return this.requestHandlers.bind(...args)
	}
}
module.exports = wl_registry_interceptor

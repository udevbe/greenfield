const { createWlResource, unmarshallArgs } = require('../wayland-server')

class wl_seat_interceptor {
	constructor (wlClient, interceptors, version, wlResource, userData, creationArgs, id) {
		this.wlClient = wlClient
		this.wlResource = wlResource
		this.userData = userData
		this.creationArgs = creationArgs
		this.id = id
		this.requestHandlers = {
			getPointer: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_pointer_interface`))
					interceptors[id] =  new (require(`./wl_pointer_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
			getKeyboard: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_keyboard_interface`))
					interceptors[id] =  new (require(`./wl_keyboard_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
			getTouch: (id, ...constructionArgs) => {
					const remoteResource = createWlResource(wlClient, id, version, require(`./wl_touch_interface`))
					interceptors[id] =  new (require(`./wl_touch_interceptor`))(wlClient, interceptors, version, remoteResource, userData, constructionArgs, id)
					return { native: false, browser: true }
			},
		}
		this.eventHandlers = {
		}
	}

	R0 (message) {
		const args = unmarshallArgs(message,'n')
		return this.requestHandlers.getPointer(...args)
	}
	R1 (message) {
		const args = unmarshallArgs(message,'n')
		return this.requestHandlers.getKeyboard(...args)
	}
	R2 (message) {
		const args = unmarshallArgs(message,'n')
		return this.requestHandlers.getTouch(...args)
	}
}
module.exports = wl_seat_interceptor

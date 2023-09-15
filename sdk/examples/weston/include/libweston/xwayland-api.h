/*
 * Copyright © 2016 Giulio Camuffo
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice (including the
 * next paragraph) shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

#ifndef XWAYLAND_API_H
#define XWAYLAND_API_H

#ifdef  __cplusplus
extern "C" {
#endif

#include <unistd.h>

#include <libweston/plugin-registry.h>

struct weston_compositor;
struct weston_xwayland;

#define WESTON_XWAYLAND_API_NAME "weston_xwayland_v1"
#define WESTON_XWAYLAND_SURFACE_API_NAME "weston_xwayland_surface_v1"

typedef pid_t
(*weston_xwayland_spawn_xserver_func_t)(
	void *user_data, const char *display, int abstract_fd, int unix_fd);

/** The libweston Xwayland API
 *
 * This API allows control of the Xwayland libweston module.
 * The module must be loaded at runtime with \a weston_compositor_load_xwayland,
 * after which the API can be retrieved by using \a weston_xwayland_get_api.
 */
struct weston_xwayland_api {
	/** Retrieve the Xwayland context object.
	 *
	 * Note that this function does not create a new object, but always
	 * returns the same object per compositor instance.
	 * This function cannot fail while this API object is valid.
	 *
	 * \param compositor The compositor instance.
	 */
	struct weston_xwayland *
	(*get)(struct weston_compositor *compositor);

	/** Listen for X connections.
	 *
	 * This function tells the Xwayland module to begin creating an X socket
	 * and start listening for client connections. When one such connection is
	 * detected the given \a spawn_func callback will be called to start
	 * the Xwayland process.
	 *
	 * \param xwayland The Xwayland context object.
	 * \param user_data The user data pointer to be passed to \a spawn_func.
	 * \param spawn_func The callback function called to start the Xwayland
	 *                   server process.
	 *
	 * \return 0 on success, a negative number otherwise.
	 */
	int
	(*listen)(struct weston_xwayland *xwayland, void *user_data,
	          weston_xwayland_spawn_xserver_func_t spawn_func);

	/** Notify the Xwayland module that the Xwayland server is loaded.
	 *
	 * After the Xwayland server process has been spawned it will notify
	 * the parent that is has finished the initialization by sending a
	 * SIGUSR1 signal.
	 * The caller should listen for that signal and call this function
	 * when it is received.
	 *
	 * \param xwayland The Xwayland context object.
	 * \param client The wl_client object representing the connection of
	 *               the Xwayland server process.
	 * \param wm_fd The file descriptor for the wm.
	 */
	void
	(*xserver_loaded)(struct weston_xwayland *xwayland,
			  struct wl_client *client, int wm_fd);

	/** Notify the Xwayland module that the Xwayland server has exited.
	 *
	 * Whenever the Xwayland server process quits this function should be
	 * called.
	 * The Xwayland module will keep listening for X connections on the
	 * socket, and may call the spawn function again.
	 *
	 * \param xwayland The Xwayland context object.
	 * \param exit_status The exit status of the Xwayland server process.
	 */
	void
	(*xserver_exited)(struct weston_xwayland *xwayland, int exit_status);
};

/** Retrieve the API object for the libweston Xwayland module.
 *
 * The module must have been previously loaded by calling
 * \a weston_compositor_load_xwayland.
 *
 * \param compositor The compositor instance.
 */
static inline const struct weston_xwayland_api *
weston_xwayland_get_api(struct weston_compositor *compositor)
{
	const void *api;
	api = weston_plugin_api_get(compositor, WESTON_XWAYLAND_API_NAME,
				    sizeof(struct weston_xwayland_api));
	/* The cast is necessary to use this function in C++ code */
	return (const struct weston_xwayland_api *)api;
}

/** The libweston Xwayland surface API
 *
 * This API allows control of the Xwayland libweston module surfaces.
 * The module must be loaded at runtime with \a weston_compositor_load_xwayland,
 * after which the API can be retrieved by using
 * \a weston_xwayland_surface_get_api.
 */
struct weston_xwayland_surface_api {
	/** Check if the surface is an Xwayland surface
	 *
	 * \param surface The surface.
	 */
	bool
	(*is_xwayland_surface)(struct weston_surface *surface);
	/** Notify the Xwayland surface that its position changed.
	 *
	 * \param surface The Xwayland surface.
	 * \param x The x-axis position.
	 * \param y The y-axis position.
	 */
	void
	(*send_position)(struct weston_surface *surface, int32_t x, int32_t y);
};

/** Retrieve the API object for the libweston Xwayland surface.
 *
 * The module must have been previously loaded by calling
 * \a weston_compositor_load_xwayland.
 *
 * \param compositor The compositor instance.
 */
static inline const struct weston_xwayland_surface_api *
weston_xwayland_surface_get_api(struct weston_compositor *compositor)
{
	const void *api;
	api = weston_plugin_api_get(compositor, WESTON_XWAYLAND_SURFACE_API_NAME,
				    sizeof(struct weston_xwayland_surface_api));
	/* The cast is necessary to use this function in C++ code */
	return (const struct weston_xwayland_surface_api *)api;
}

#ifdef  __cplusplus
}
#endif

#endif

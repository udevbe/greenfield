/*
 * Copyright © 2019 Stefan Agner <stefan@agner.ch>
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

#ifndef WESTON_COMPOSITOR_VNC_H
#define WESTON_COMPOSITOR_VNC_H

#ifdef  __cplusplus
extern "C" {
#endif

#include <libweston/libweston.h>
#include <libweston/plugin-registry.h>

#define WESTON_VNC_OUTPUT_API_NAME "weston_vnc_output_api_v1"
#define VNC_DEFAULT_FREQ 60

struct weston_vnc_output_api {
	/** Initialize a VNC output with specified width and height.
	 *
	 * Returns 0 on success, -1 on failure.
	 */
	int (*output_set_size)(struct weston_output *output,
			       int width, int height);
};

static inline const struct weston_vnc_output_api *
weston_vnc_output_get_api(struct weston_compositor *compositor)
{
	const void *api;
	api = weston_plugin_api_get(compositor, WESTON_VNC_OUTPUT_API_NAME,
				    sizeof(struct weston_vnc_output_api));

	return (const struct weston_vnc_output_api *)api;
}

#define WESTON_VNC_BACKEND_CONFIG_VERSION 1

struct weston_vnc_backend_config {
	struct weston_backend_config base;
	char *bind_address;
	int port;
	int refresh_rate;
	char *server_cert;
	char *server_key;
};

#ifdef  __cplusplus
}
#endif

#endif /* WESTON_COMPOSITOR_VNC_H */

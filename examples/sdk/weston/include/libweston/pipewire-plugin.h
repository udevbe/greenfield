/*
 * Copyright © 2019 Pengutronix, Michael Olbrich <m.olbrich@pengutronix.de>
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

#ifndef PIPEWIRE_PLUGIN_H
#define PIPEWIRE_PLUGIN_H

#include <libweston/libweston.h>
#include <libweston/plugin-registry.h>

#define WESTON_PIPEWIRE_API_NAME	"weston_pipewire_api_v1"

struct weston_pipewire_api {
	/** Create pipewire outputs
	 *
	 * Returns 0 on success, -1 on failure.
	 */
	struct weston_output *(*create_output)(struct weston_compositor *c,
					       char *name);

	/** Check if output is pipewire */
	bool (*is_pipewire_output)(struct weston_output *output);

	/** Set mode */
	int (*set_mode)(struct weston_output *output, const char *modeline);

	/** Set seat */
	void (*set_seat)(struct weston_output *output, const char *seat);
};

static inline const struct weston_pipewire_api *
weston_pipewire_get_api(struct weston_compositor *compositor)
{
	const void *api;
	api = weston_plugin_api_get(compositor, WESTON_PIPEWIRE_API_NAME,
				    sizeof(struct weston_pipewire_api));

	return (const struct weston_pipewire_api *)api;
}

#endif /* PIPEWIRE_PLUGIN_H */

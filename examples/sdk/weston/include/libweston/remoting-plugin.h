/*
 * Copyright © 2018 Renesas Electronics Corp.
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
 *
 * Authors: IGEL Co., Ltd.
 */

#ifndef REMOTING_PLUGIN_H
#define REMOTING_PLUGIN_H

#include <libweston/libweston.h>
#include <libweston/plugin-registry.h>

#define WESTON_REMOTING_API_NAME	"weston_remoting_api_v1"

struct weston_remoting_api {
	/** Create remoted outputs
	 *
	 * Returns 0 on success, -1 on failure.
	 */
	struct weston_output *(*create_output)(struct weston_compositor *c,
					       char *name);

	/** Check if output is remoted */
	bool (*is_remoted_output)(struct weston_output *output);

	/** Set mode */
	int (*set_mode)(struct weston_output *output, const char *modeline);

	/** Set gbm format */
	void (*set_gbm_format)(struct weston_output *output,
			       const char *gbm_format);

	/** Set seat */
	void (*set_seat)(struct weston_output *output, const char *seat);

	/** Set the destination Host(IP Address) */
	void (*set_host)(struct weston_output *output, char *ip);

	/** Set the port number */
	void (*set_port)(struct weston_output *output, int port);

	/** Set the pipeline for gstreamer */
	void (*set_gst_pipeline)(struct weston_output *output,
				 char *gst_pipeline);
};

static inline const struct weston_remoting_api *
weston_remoting_get_api(struct weston_compositor *compositor)
{
	const void *api;
	api = weston_plugin_api_get(compositor, WESTON_REMOTING_API_NAME,
				    sizeof(struct weston_remoting_api));

	return (const struct weston_remoting_api *)api;
}

#endif /* REMOTING_PLUGIN_H */

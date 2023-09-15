/*
 * Copyright © 2016 Armin Krezović
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

#ifndef WESTON_WINDOWED_OUTPUT_API_H
#define WESTON_WINDOWED_OUTPUT_API_H

#ifdef  __cplusplus
extern "C" {
#endif

#include <libweston/plugin-registry.h>

struct weston_compositor;
struct weston_output;

#define WESTON_WINDOWED_OUTPUT_API_NAME "weston_windowed_output_api_v1"

struct weston_windowed_output_api {
	/** Assign a given width and height to an output.
	 *
	 * \param output An output to be configured.
	 * \param width  Desired width of the output.
	 * \param height Desired height of the output.
	 *
	 * Returns 0 on success, -1 on failure.
	 *
	 * This assigns a desired width and height to a windowed
	 * output. The backend decides what should be done and applies
	 * the desired configuration. After using this function and
	 * generic weston_output_set_*, a windowed
	 * output should be in a state where weston_output_enable()
	 * can be run.
	 */
	int (*output_set_size)(struct weston_output *output,
			       int width, int height);

	/** Create a new windowed head.
	 *
	 * \param compositor The compositor instance.
	 * \param name       Desired name for a new head, not NULL.
	 *
	 * Returns 0 on success, -1 on failure.
	 *
	 * This creates a new head in the backend. The new head will
	 * be advertised in the compositor's head list and triggers a
	 * head_changed callback.
	 *
	 * A new output can be created for the head. The output must be
	 * configured with output_set_size() and
	 * weston_output_set_{scale,transform}() before enabling it.
	 *
	 * \sa weston_compositor_set_heads_changed_cb(),
	 * weston_compositor_create_output_with_head()
	 */
	int (*create_head)(struct weston_compositor *compositor,
			   const char *name);
};

static inline const struct weston_windowed_output_api *
weston_windowed_output_get_api(struct weston_compositor *compositor)
{
	const void *api;
	api = weston_plugin_api_get(compositor, WESTON_WINDOWED_OUTPUT_API_NAME,
				    sizeof(struct weston_windowed_output_api));

	return (const struct weston_windowed_output_api *)api;
}

#ifdef  __cplusplus
}
#endif

#endif /* WESTON_WINDOWED_OUTPUT_API_H */

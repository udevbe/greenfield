/*
 * Copyright © 2016 Quentin "Sardem FF7" Glidic
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice (including the next
 * paragraph) shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

#ifndef WESTON_DESKTOP_H
#define WESTON_DESKTOP_H

#include <libweston/libweston.h>
#include <pixman.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

enum weston_desktop_surface_edge {
	WESTON_DESKTOP_SURFACE_EDGE_NONE = 0,
	WESTON_DESKTOP_SURFACE_EDGE_TOP = 1,
	WESTON_DESKTOP_SURFACE_EDGE_BOTTOM = 2,
	WESTON_DESKTOP_SURFACE_EDGE_LEFT = 4,
	WESTON_DESKTOP_SURFACE_EDGE_TOP_LEFT = 5,
	WESTON_DESKTOP_SURFACE_EDGE_BOTTOM_LEFT = 6,
	WESTON_DESKTOP_SURFACE_EDGE_RIGHT = 8,
	WESTON_DESKTOP_SURFACE_EDGE_TOP_RIGHT = 9,
	WESTON_DESKTOP_SURFACE_EDGE_BOTTOM_RIGHT = 10,
};

enum weston_top_level_tiled_orientation {
	WESTON_TOP_LEVEL_TILED_ORIENTATION_NONE 	= 0 << 0,
	WESTON_TOP_LEVEL_TILED_ORIENTATION_LEFT 	= 1 << 1,
	WESTON_TOP_LEVEL_TILED_ORIENTATION_RIGHT 	= 1 << 2,
	WESTON_TOP_LEVEL_TILED_ORIENTATION_TOP 		= 1 << 3,
	WESTON_TOP_LEVEL_TILED_ORIENTATION_BOTTOM 	= 1 << 4,
};

struct weston_desktop;
struct weston_desktop_client;
struct weston_desktop_surface;

struct weston_desktop_api {
	size_t struct_size;
	void (*ping_timeout)(struct weston_desktop_client *client,
			     void *user_data);
	void (*pong)(struct weston_desktop_client *client,
		     void *user_data);

	void (*surface_added)(struct weston_desktop_surface *surface,
			      void *user_data);
	void (*surface_removed)(struct weston_desktop_surface *surface,
				void *user_data);
	void (*committed)(struct weston_desktop_surface *surface,
			  int32_t sx, int32_t sy, void *user_data);
	void (*show_window_menu)(struct weston_desktop_surface *surface,
				 struct weston_seat *seat, int32_t x, int32_t y,
				 void *user_data);
	void (*set_parent)(struct weston_desktop_surface *surface,
			   struct weston_desktop_surface *parent,
			   void *user_data);
	void (*move)(struct weston_desktop_surface *surface,
		     struct weston_seat *seat, uint32_t serial, void *user_data);
	void (*resize)(struct weston_desktop_surface *surface,
		       struct weston_seat *seat, uint32_t serial,
		       enum weston_desktop_surface_edge edges, void *user_data);
	void (*fullscreen_requested)(struct weston_desktop_surface *surface,
				     bool fullscreen,
				     struct weston_output *output,
				     void *user_data);
	void (*maximized_requested)(struct weston_desktop_surface *surface,
				    bool maximized, void *user_data);
	void (*minimized_requested)(struct weston_desktop_surface *surface,
				    void *user_data);

	/** Position suggestion for an Xwayland window
	 *
	 * X11 applications assume they can position their windows as necessary,
	 * which is not possible in Wayland where positioning is driven by the
	 * shell alone. This function is used to relay absolute position wishes
	 * from Xwayland clients to the shell.
	 *
	 * This is particularly used for mapping windows at specified locations,
	 * e.g. via the commonly used '-geometry' command line option. In such
	 * case, a call to surface_added() is immediately followed by
	 * xwayland_position() if the X11 application specified a position.
	 * The committed() call that will map the window occurs later, so it
	 * is recommended to usually store and honour the given position for
	 * windows that are not yet mapped.
	 *
	 * Calls to this function may happen also at other times.
	 *
	 * The given coordinates are in the X11 window system coordinate frame
	 * relative to the X11 root window. Care should be taken to ensure the
	 * window gets mapped to coordinates that correspond to the proposed
	 * position from the X11 client perspective.
	 *
	 * \param surface The surface in question.
	 * \param x The absolute X11 coordinate for x.
	 * \param y The absolute X11 coordinate for y.
	 * \param user_data The user_data argument passed in to
	 * weston_desktop_create().
	 *
	 * This callback can be NULL.
	 */
	void (*set_xwayland_position)(struct weston_desktop_surface *surface,
				      int32_t x, int32_t y, void *user_data);
	void (*get_position)(struct weston_desktop_surface *surface,
			     int32_t *x, int32_t *y,
			     void *user_data);
};

void
weston_seat_break_desktop_grabs(struct weston_seat *seat);

struct weston_desktop *
weston_desktop_create(struct weston_compositor *compositor,
		      const struct weston_desktop_api *api, void *user_data);
void
weston_desktop_destroy(struct weston_desktop *desktop);

struct wl_client *
weston_desktop_client_get_client(struct weston_desktop_client *client);
void
weston_desktop_client_for_each_surface(struct weston_desktop_client *client,
				       void (*callback)(struct weston_desktop_surface *surface, void *user_data),
				       void *user_data);
int
weston_desktop_client_ping(struct weston_desktop_client *client);

bool
weston_surface_is_desktop_surface(struct weston_surface *surface);
struct weston_desktop_surface *
weston_surface_get_desktop_surface(struct weston_surface *surface);

void
weston_desktop_surface_set_user_data(struct weston_desktop_surface *self,
				     void *user_data);
struct weston_view *
weston_desktop_surface_create_view(struct weston_desktop_surface *surface);
void
weston_desktop_surface_unlink_view(struct weston_view *view);
void
weston_desktop_surface_propagate_layer(struct weston_desktop_surface *surface);
void
weston_desktop_surface_set_activated(struct weston_desktop_surface *surface,
				     bool activated);
void
weston_desktop_surface_set_fullscreen(struct weston_desktop_surface *surface,
				      bool fullscreen);
void
weston_desktop_surface_set_maximized(struct weston_desktop_surface *surface,
				     bool maximized);
void
weston_desktop_surface_set_resizing(struct weston_desktop_surface *surface,
				    bool resized);
void
weston_desktop_surface_set_size(struct weston_desktop_surface *surface,
				int32_t width, int32_t height);
void
weston_desktop_surface_set_orientation(struct weston_desktop_surface *surface,
				       enum weston_top_level_tiled_orientation tile_orientation);
void
weston_desktop_surface_close(struct weston_desktop_surface *surface);
void
weston_desktop_surface_add_metadata_listener(struct weston_desktop_surface *surface,
					     struct wl_listener *listener);

void *
weston_desktop_surface_get_user_data(struct weston_desktop_surface *surface);
struct weston_desktop_client *
weston_desktop_surface_get_client(struct weston_desktop_surface *surface);
struct weston_surface *
weston_desktop_surface_get_surface(struct weston_desktop_surface *surface);
const char *
weston_desktop_surface_get_title(struct weston_desktop_surface *surface);
const char *
weston_desktop_surface_get_app_id(struct weston_desktop_surface *surface);
pid_t
weston_desktop_surface_get_pid(struct weston_desktop_surface *surface);
bool
weston_desktop_surface_get_activated(struct weston_desktop_surface *surface);
bool
weston_desktop_surface_get_maximized(struct weston_desktop_surface *surface);
bool
weston_desktop_surface_get_fullscreen(struct weston_desktop_surface *surface);
bool
weston_desktop_surface_get_pending_resizing(struct weston_desktop_surface *surface);
bool
weston_desktop_surface_get_pending_activated(struct weston_desktop_surface *surface);
bool
weston_desktop_surface_get_pending_maximized(struct weston_desktop_surface *surface);
bool
weston_desktop_surface_get_pending_fullscreen(struct weston_desktop_surface *surface);
bool
weston_desktop_surface_get_resizing(struct weston_desktop_surface *surface);
struct weston_geometry
weston_desktop_surface_get_geometry(struct weston_desktop_surface *surface);
struct weston_size
weston_desktop_surface_get_max_size(struct weston_desktop_surface *surface);
struct weston_size
weston_desktop_surface_get_min_size(struct weston_desktop_surface *surface);

bool
weston_desktop_window_menu_supported(struct weston_desktop *desktop);
bool
weston_desktop_move_supported(struct weston_desktop *desktop);
bool
weston_desktop_resize_supported(struct weston_desktop *desktop);
bool
weston_desktop_fullscreen_supported(struct weston_desktop *desktop);
bool
weston_desktop_minimize_supported(struct weston_desktop *desktop);
bool
weston_desktop_maximize_supported(struct weston_desktop *desktop);

#ifdef __cplusplus
}
#endif

#endif /* WESTON_DESKTOP_H */

/*
 * Copyright © 2014 Jason Ekstrand
 * Copyright © 2011 Benjamin Franzke
 * Copyright © 2010 Intel Corporation
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

#include "config.h"

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <assert.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/time.h>
#include <signal.h>
#include <errno.h>

#include <wayland-client.h>
#include "shared/os-compatibility.h"
#include <libweston/zalloc.h>
#include "xdg-shell-client-protocol.h"
#include "fullscreen-shell-unstable-v1-client-protocol.h"
#include "viewporter-client-protocol.h"

int print_debug = 0;

struct display {
	struct wl_display *display;
	struct wl_registry *registry;
	int compositor_version;
	struct wl_compositor *compositor;
	struct wp_viewporter *viewporter;
	struct xdg_wm_base *wm_base;
	struct zwp_fullscreen_shell_v1 *fshell;
	struct wl_shm *shm;
	uint32_t formats;
};

struct buffer {
	struct wl_buffer *buffer;
	uint32_t *shm_data;
	int busy;
};

enum window_flags {
	WINDOW_FLAG_USE_VIEWPORT = 0x1,
	WINDOW_FLAG_ROTATING_TRANSFORM = 0x2,
	WINDOW_FLAG_USE_DAMAGE_BUFFER = 0x4,
};

struct window {
	struct display *display;
	int width, height, border;
	struct wl_surface *surface;
	struct wp_viewport *viewport;
	struct xdg_surface *xdg_surface;
	struct xdg_toplevel *xdg_toplevel;
	struct wl_callback *callback;
	struct buffer buffers[2];
	struct buffer *prev_buffer;
	bool wait_for_configure;

	enum window_flags flags;
	int scale;
	enum wl_output_transform transform;

	struct {
		float x, y; /* position in pixels */
		float dx, dy; /* velocity in pixels/second */
		int radius; /* radius in pixels */
		uint32_t prev_time;
	} ball;
};

static int running = 1;

static void
redraw(void *data, struct wl_callback *callback, uint32_t time);

static void
buffer_release(void *data, struct wl_buffer *buffer)
{
	struct buffer *mybuf = data;

	mybuf->busy = 0;
}

static const struct wl_buffer_listener buffer_listener = {
	buffer_release
};

static int
create_shm_buffer(struct display *display, struct buffer *buffer,
		  int width, int height, uint32_t format)
{
	struct wl_shm_pool *pool;
	int fd, size, pitch;
	void *data;

	pitch = width * 4;
	size = pitch * height;

	fd = os_create_anonymous_file(size);
	if (fd < 0) {
		fprintf(stderr, "creating a buffer file for %d B failed: %s\n",
			size, strerror(errno));
		return -1;
	}

	data = mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
	if (data == MAP_FAILED) {
		fprintf(stderr, "mmap failed: %s\n", strerror(errno));
		close(fd);
		return -1;
	}

	pool = wl_shm_create_pool(display->shm, fd, size);
	buffer->buffer = wl_shm_pool_create_buffer(pool, 0,
						   width, height,
						   pitch, format);
	wl_buffer_add_listener(buffer->buffer, &buffer_listener, buffer);
	wl_shm_pool_destroy(pool);
	close(fd);

	buffer->shm_data = data;

	return 0;
}

static void
xdg_surface_handle_configure(void *data, struct xdg_surface *surface,
			     uint32_t serial)
{
	struct window *window = data;

	xdg_surface_ack_configure(surface, serial);

	if (window->wait_for_configure) {
		redraw(window, NULL, 0);
		window->wait_for_configure = false;
	}
}

static const struct xdg_surface_listener xdg_surface_listener = {
	xdg_surface_handle_configure,
};

static void
xdg_toplevel_handle_configure(void *data, struct xdg_toplevel *toplevel,
			      int32_t width, int32_t height,
			      struct wl_array *states)
{
}

static void
xdg_toplevel_handle_close(void *data, struct xdg_toplevel *xdg_toplevel)
{
	running = 0;
}

static const struct xdg_toplevel_listener xdg_toplevel_listener = {
	xdg_toplevel_handle_configure,
	xdg_toplevel_handle_close,
};

static float
bounded_randf(float a, float b)
{
	return a + ((float)rand() / (float)RAND_MAX) * (b - a);
}

static void
window_init_game(struct window *window)
{
	int ax1, ay1, ax2, ay2; /* playable arena size */
	struct timeval tv;

	gettimeofday(&tv, NULL);
	srand(tv.tv_usec);

	window->ball.radius = 10;

	ax1 = window->border + window->ball.radius;
	ay1 = window->border + window->ball.radius;
	ax2 = window->width - window->border - window->ball.radius;
	ay2 = window->height - window->border - window->ball.radius;

	window->ball.x = bounded_randf(ax1, ax2);
	window->ball.y = bounded_randf(ay1, ay2);

	window->ball.dx = bounded_randf(0, window->width);
	window->ball.dy = bounded_randf(0, window->height);

	window->ball.prev_time = 0;
}

static void
window_advance_game(struct window *window, uint32_t timestamp)
{
	int ax1, ay1, ax2, ay2; /* Arena size */
	float dt;

	if (window->ball.prev_time == 0) {
		/* first pass, don't do anything */
		window->ball.prev_time = timestamp;
		return;
	}

	/* dt in seconds */
	dt = (float)(timestamp - window->ball.prev_time) / 1000.0f;

	ax1 = window->border + window->ball.radius;
	ay1 = window->border + window->ball.radius;
	ax2 = window->width - window->border - window->ball.radius;
	ay2 = window->height - window->border - window->ball.radius;

	window->ball.x += window->ball.dx * dt;
	while (window->ball.x < ax1 || ax2 < window->ball.x) {
		if (window->ball.x < ax1)
			window->ball.x = 2 * ax1 - window->ball.x;
		if (ax2 <= window->ball.x)
			window->ball.x = 2 * ax2 - window->ball.x;

		window->ball.dx *= -1.0f;
	}

	window->ball.y += window->ball.dy * dt;
	while (window->ball.y < ay1 || ay2 < window->ball.y) {
		if (window->ball.y < ay1)
			window->ball.y = 2 * ay1 - window->ball.y;
		if (ay2 <= window->ball.y)
			window->ball.y = 2 * ay2 - window->ball.y;

		window->ball.dy *= -1.0f;
	}

	window->ball.prev_time = timestamp;
}

static struct window *
create_window(struct display *display, int width, int height,
	      enum wl_output_transform transform, int scale,
	      enum window_flags flags)
{
	struct window *window;

	if (display->compositor_version < 2 &&
	    (transform != WL_OUTPUT_TRANSFORM_NORMAL ||
	     flags & WINDOW_FLAG_ROTATING_TRANSFORM)) {
		fprintf(stderr, "wl_surface.buffer_transform unsupported in "
				"wl_surface version %d\n",
			display->compositor_version);
		exit(1);
	}

	if (display->compositor_version < 3 &&
	    (! (flags & WINDOW_FLAG_USE_VIEWPORT)) && scale != 1) {
		fprintf(stderr, "wl_surface.buffer_scale unsupported in "
				"wl_surface version %d\n",
			display->compositor_version);
		exit(1);
	}

	if (display->viewporter == NULL && (flags & WINDOW_FLAG_USE_VIEWPORT)) {
		fprintf(stderr, "Compositor does not support wp_viewport");
		exit(1);
	}

	if (display->compositor_version <
	    WL_SURFACE_DAMAGE_BUFFER_SINCE_VERSION &&
	    (flags & WINDOW_FLAG_USE_DAMAGE_BUFFER)) {
		fprintf(stderr, "wl_surface.damage_buffer unsupported in "
				"wl_surface version %d\n",
			display->compositor_version);
		exit(1);
	}

	window = zalloc(sizeof *window);
	if (!window)
		return NULL;

	window->callback = NULL;
	window->display = display;
	window->width = width;
	window->height = height;
	window->border = 10;
	window->flags = flags;
	window->transform = transform;
	window->scale = scale;

	window_init_game(window);

	window->surface = wl_compositor_create_surface(display->compositor);

	if (window->flags & WINDOW_FLAG_USE_VIEWPORT)
		window->viewport = wp_viewporter_get_viewport(display->viewporter,
							      window->surface);

	if (display->wm_base) {
		window->xdg_surface =
			xdg_wm_base_get_xdg_surface(display->wm_base,
						    window->surface);

		assert(window->xdg_surface);

		xdg_surface_add_listener(window->xdg_surface,
					 &xdg_surface_listener, window);

		window->xdg_toplevel =
			xdg_surface_get_toplevel(window->xdg_surface);

		assert(window->xdg_toplevel);

		xdg_toplevel_add_listener(window->xdg_toplevel,
					  &xdg_toplevel_listener, window);

		xdg_toplevel_set_title(window->xdg_toplevel, "simple-damage");
		xdg_toplevel_set_app_id(window->xdg_toplevel,
					"org.freedesktop.weston.simple-damage");

		window->wait_for_configure = true;
		wl_surface_commit(window->surface);
	} else if (display->fshell) {
		zwp_fullscreen_shell_v1_present_surface(display->fshell,
							window->surface,
							ZWP_FULLSCREEN_SHELL_V1_PRESENT_METHOD_DEFAULT,
							NULL);
	} else {
		assert(0);
	}

	/* Initialise damage to full surface, so the padding gets painted */
	if (window->flags & WINDOW_FLAG_USE_DAMAGE_BUFFER) {
		wl_surface_damage_buffer(window->surface, 0, 0,
					 INT32_MAX, INT32_MAX);
	} else {
		wl_surface_damage(window->surface, 0, 0, INT32_MAX, INT32_MAX);
	}
	return window;
}

static void
destroy_window(struct window *window)
{
	if (window->callback)
		wl_callback_destroy(window->callback);

	if (window->buffers[0].buffer)
		wl_buffer_destroy(window->buffers[0].buffer);
	if (window->buffers[1].buffer)
		wl_buffer_destroy(window->buffers[1].buffer);

	if (window->xdg_toplevel)
		xdg_toplevel_destroy(window->xdg_toplevel);
	if (window->xdg_surface)
		xdg_surface_destroy(window->xdg_surface);
	if (window->viewport)
		wp_viewport_destroy(window->viewport);
	wl_surface_destroy(window->surface);
	free(window);
}

static struct buffer *
window_next_buffer(struct window *window)
{
	struct buffer *buffer;
	int ret = 0, bwidth, bheight;

	if (!window->buffers[0].busy)
		buffer = &window->buffers[0];
	else if (!window->buffers[1].busy)
		buffer = &window->buffers[1];
	else
		return NULL;

	switch (window->transform) {
	default:
	case WL_OUTPUT_TRANSFORM_NORMAL:
	case WL_OUTPUT_TRANSFORM_180:
	case WL_OUTPUT_TRANSFORM_FLIPPED:
	case WL_OUTPUT_TRANSFORM_FLIPPED_180:
		bwidth = window->width * window->scale;
		bheight = window->height * window->scale;
		break;
	case WL_OUTPUT_TRANSFORM_90:
	case WL_OUTPUT_TRANSFORM_270:
	case WL_OUTPUT_TRANSFORM_FLIPPED_90:
	case WL_OUTPUT_TRANSFORM_FLIPPED_270:
		bwidth = window->height * window->scale;
		bheight = window->width * window->scale;
		break;
	}

	if (!buffer->buffer) {
		ret = create_shm_buffer(window->display, buffer,
					bwidth, bheight,
					WL_SHM_FORMAT_ARGB8888);

		if (ret < 0)
			return NULL;
	}

	return buffer;
}

static void
paint_box(uint32_t *pixels, int pitch, int x, int y, int width, int height,
	  uint32_t color)
{
	int i, j;

	for (j = y; j < y + height; ++j)
		for (i = x; i < x + width; ++i)
			pixels[i + j * pitch] = color;
}

static void
paint_circle(uint32_t *pixels, int pitch, float x, float y, int radius,
	     uint32_t color)
{
	int i, j;

	for (j = y - radius; j <= (int)(y + radius); ++j)
		for (i = x - radius; i <= (int)(x + radius); ++i)
			if ((j+0.5f-y)*(j+0.5f-y) + (i+0.5f-x)*(i+0.5f-x) <= radius * radius)
				pixels[i + j * pitch] = color;
}

static void
window_get_transformed_ball(struct window *window, float *bx, float *by)
{
	float wx, wy;

	wx = window->ball.x;
	wy = window->ball.y;

	switch (window->transform) {
	default:
	case WL_OUTPUT_TRANSFORM_NORMAL:
		*bx = wx;
		*by = wy;
		break;
	case WL_OUTPUT_TRANSFORM_90:
		*bx = wy;
		*by = window->width - wx;
		break;
	case WL_OUTPUT_TRANSFORM_180:
		*bx = window->width - wx;
		*by = window->height - wy;
		break;
	case WL_OUTPUT_TRANSFORM_270:
		*bx = window->height - wy;
		*by = wx;
		break;
	case WL_OUTPUT_TRANSFORM_FLIPPED:
		*bx = window->width - wx;
		*by = wy;
		break;
	case WL_OUTPUT_TRANSFORM_FLIPPED_90:
		*bx = wy;
		*by = wx;
		break;
	case WL_OUTPUT_TRANSFORM_FLIPPED_180:
		*bx = wx;
		*by = window->height - wy;
		break;
	case WL_OUTPUT_TRANSFORM_FLIPPED_270:
		*bx = window->height - wy;
		*by = window->width - wx;
		break;
	}

	*bx *= window->scale;
	*by *= window->scale;

	if (window->viewport) {
		/* We're drawing half-size because of the viewport */
		*bx /= 2;
		*by /= 2;
	}
}

static const struct wl_callback_listener frame_listener;

static void
redraw(void *data, struct wl_callback *callback, uint32_t time)
{
	struct window *window = data;
	struct buffer *buffer;
	int off_x = 0, off_y = 0;
	int bwidth, bheight, bborder, bpitch, bradius;
	float bx, by;

	buffer = window_next_buffer(window);
	if (!buffer) {
		fprintf(stderr,
			!callback ? "Failed to create the first buffer.\n" :
			"Both buffers busy at redraw(). Server bug?\n");
		abort();
	}

	/* Rotate the damage, but keep the even/odd parity so the
	 * dimensions of the buffers don't change */
	if (window->flags & WINDOW_FLAG_ROTATING_TRANSFORM)
		window->transform = (window->transform + 2) % 8;

	switch (window->transform) {
	default:
	case WL_OUTPUT_TRANSFORM_NORMAL:
	case WL_OUTPUT_TRANSFORM_180:
	case WL_OUTPUT_TRANSFORM_FLIPPED:
	case WL_OUTPUT_TRANSFORM_FLIPPED_180:
		bwidth = window->width * window->scale;
		bheight = window->height * window->scale;
		break;
	case WL_OUTPUT_TRANSFORM_90:
	case WL_OUTPUT_TRANSFORM_270:
	case WL_OUTPUT_TRANSFORM_FLIPPED_90:
	case WL_OUTPUT_TRANSFORM_FLIPPED_270:
		bwidth = window->height * window->scale;
		bheight = window->width * window->scale;
		break;
	}

	bpitch = bwidth;

	bborder = window->border * window->scale;
	bradius = window->ball.radius * window->scale;

	if (window->viewport) {
		int tx, ty;
		/* Fill the whole thing with red to detect viewport errors */
		paint_box(buffer->shm_data, bpitch, 0, 0, bwidth, bheight,
			  0xffff0000);

		/* The buffer is the same size.  However, we crop it
		 * and scale it up by a factor of 2 */
		bborder /= 2;
		bradius /= 2;
		bwidth /= 2;
		bheight /= 2;

		/* Offset the drawing region */
		tx = (window->width / 3) * window->scale;
		ty = (window->height / 5) * window->scale;
		switch (window->transform) {
		default:
		case WL_OUTPUT_TRANSFORM_NORMAL:
			off_y = ty;
			off_x = tx;
			break;
		case WL_OUTPUT_TRANSFORM_90:
			off_y = bheight - tx;
			off_x = ty;
			break;
		case WL_OUTPUT_TRANSFORM_180:
			off_y = bheight - ty;
			off_x = bwidth - tx;
			break;
		case WL_OUTPUT_TRANSFORM_270:
			off_y = tx;
			off_x = bwidth - ty;
			break;
		case WL_OUTPUT_TRANSFORM_FLIPPED:
			off_y = ty;
			off_x = bwidth - tx;
			break;
		case WL_OUTPUT_TRANSFORM_FLIPPED_90:
			off_y = tx;
			off_x = ty;
			break;
		case WL_OUTPUT_TRANSFORM_FLIPPED_180:
			off_y = bheight - ty;
			off_x = tx;
			break;
		case WL_OUTPUT_TRANSFORM_FLIPPED_270:
			off_y = bheight - tx;
			off_x = bwidth - ty;
			break;
		}
		wp_viewport_set_source(window->viewport,
				       wl_fixed_from_int(window->width / 3),
				       wl_fixed_from_int(window->height / 5),
				       wl_fixed_from_int(window->width / 2),
				       wl_fixed_from_int(window->height / 2));
	}

	/* Paint the border */
	paint_box(buffer->shm_data, bpitch, off_x, off_y,
		  bwidth, bborder, 0xffffffff);
	paint_box(buffer->shm_data, bpitch, off_x, off_y,
		  bborder, bheight, 0xffffffff);
	paint_box(buffer->shm_data, bpitch, off_x + bwidth - bborder, off_y,
		  bborder, bheight, 0xffffffff);
	paint_box(buffer->shm_data, bpitch, off_x, off_y + bheight - bborder,
		  bwidth, bborder, 0xffffffff);

	/* fill with translucent */
	paint_box(buffer->shm_data, bpitch, off_x + bborder, off_y + bborder,
		  bwidth - 2 * bborder, bheight - 2 * bborder, 0x80000000);

	/* Damage where the ball was */
	if (window->flags & WINDOW_FLAG_USE_DAMAGE_BUFFER) {
		window_get_transformed_ball(window, &bx, &by);
		wl_surface_damage_buffer(window->surface,
					 bx - bradius + off_x,
					 by - bradius + off_y,
					 bradius * 2 + 1,
					 bradius * 2 + 1);
	} else {
		wl_surface_damage(window->surface,
				  window->ball.x - window->ball.radius,
				  window->ball.y - window->ball.radius,
				  window->ball.radius * 2 + 1,
				  window->ball.radius * 2 + 1);
	}
	window_advance_game(window, time);

	window_get_transformed_ball(window, &bx, &by);

	/* Paint the ball */
	paint_circle(buffer->shm_data, bpitch, off_x + bx, off_y + by,
		     bradius, 0xff00ff00);

	if (print_debug) {
		printf("Ball now located at (%f, %f)\n",
		       window->ball.x, window->ball.y);

		printf("Circle painted at (%f, %f), radius %d\n", bx, by,
		       bradius);

		printf("Buffer damage rectangle: (%d, %d) @ %dx%d\n",
		       (int)(bx - bradius) + off_x,
		       (int)(by - bradius) + off_y,
		       bradius * 2 + 1, bradius * 2 + 1);
	}

	/* Damage where the ball is now */
	if (window->flags & WINDOW_FLAG_USE_DAMAGE_BUFFER) {
		wl_surface_damage_buffer(window->surface,
					 bx - bradius + off_x,
					 by - bradius + off_y,
					 bradius * 2 + 1,
					 bradius * 2 + 1);
	} else {
		wl_surface_damage(window->surface,
				  window->ball.x - window->ball.radius,
				  window->ball.y - window->ball.radius,
				  window->ball.radius * 2 + 1,
				  window->ball.radius * 2 + 1);
	}
	wl_surface_attach(window->surface, buffer->buffer, 0, 0);

	if (window->display->compositor_version >= 2 &&
	    (window->transform != WL_OUTPUT_TRANSFORM_NORMAL ||
	     window->flags & WINDOW_FLAG_ROTATING_TRANSFORM))
		wl_surface_set_buffer_transform(window->surface,
						window->transform);

	if (window->viewport)
		wp_viewport_set_destination(window->viewport,
					    window->width,
					    window->height);

	if (window->scale != 1)
		wl_surface_set_buffer_scale(window->surface,
					    window->scale);

	if (callback)
		wl_callback_destroy(callback);

	window->callback = wl_surface_frame(window->surface);
	wl_callback_add_listener(window->callback, &frame_listener, window);
	wl_surface_commit(window->surface);
	buffer->busy = 1;
}

static const struct wl_callback_listener frame_listener = {
	redraw
};

static void
shm_format(void *data, struct wl_shm *wl_shm, uint32_t format)
{
	struct display *d = data;

	d->formats |= (1 << format);
}

struct wl_shm_listener shm_listener = {
	shm_format
};

static void
xdg_wm_base_ping(void *data, struct xdg_wm_base *shell, uint32_t serial)
{
	xdg_wm_base_pong(shell, serial);
}

static const struct xdg_wm_base_listener wm_base_listener = {
	xdg_wm_base_ping,
};

static void
registry_handle_global(void *data, struct wl_registry *registry,
		       uint32_t id, const char *interface, uint32_t version)
{
	struct display *d = data;

	if (strcmp(interface, "wl_compositor") == 0) {
		if (d->compositor_version > (int)version) {
			fprintf(stderr, "Compositor does not support "
				"wl_surface version %d\n", d->compositor_version);
			exit(1);
		}

		if (d->compositor_version < 0)
			d->compositor_version = version;

		d->compositor =
			wl_registry_bind(registry,
					 id, &wl_compositor_interface,
					 d->compositor_version);
	} else if (strcmp(interface, "wp_viewporter") == 0) {
		d->viewporter = wl_registry_bind(registry, id,
						 &wp_viewporter_interface, 1);
	} else if (strcmp(interface, "xdg_wm_base") == 0) {
		d->wm_base = wl_registry_bind(registry,
					      id, &xdg_wm_base_interface, 1);
		xdg_wm_base_add_listener(d->wm_base, &wm_base_listener, d);
	} else if (strcmp(interface, "zwp_fullscreen_shell_v1") == 0) {
		d->fshell = wl_registry_bind(registry,
					     id, &zwp_fullscreen_shell_v1_interface, 1);
	} else if (strcmp(interface, "wl_shm") == 0) {
		d->shm = wl_registry_bind(registry,
					  id, &wl_shm_interface, 1);
		wl_shm_add_listener(d->shm, &shm_listener, d);
	}
}

static void
registry_handle_global_remove(void *data, struct wl_registry *registry,
			      uint32_t name)
{
}

static const struct wl_registry_listener registry_listener = {
	registry_handle_global,
	registry_handle_global_remove
};

static struct display *
create_display(int version)
{
	struct display *display;

	display = zalloc(sizeof *display);
	if (display == NULL) {
		fprintf(stderr, "out of memory\n");
		exit(1);
	}
	display->display = wl_display_connect(NULL);
	assert(display->display);

	display->compositor_version = version;
	display->formats = 0;
	display->registry = wl_display_get_registry(display->display);
	wl_registry_add_listener(display->registry,
				 &registry_listener, display);
	wl_display_roundtrip(display->display);
	if (display->shm == NULL) {
		fprintf(stderr, "No wl_shm global\n");
		exit(1);
	}

	wl_display_roundtrip(display->display);

	if (!(display->formats & (1 << WL_SHM_FORMAT_XRGB8888))) {
		fprintf(stderr, "WL_SHM_FORMAT_XRGB32 not available\n");
		exit(1);
	}

	return display;
}

static void
destroy_display(struct display *display)
{
	if (display->shm)
		wl_shm_destroy(display->shm);

	if (display->wm_base)
		xdg_wm_base_destroy(display->wm_base);

	if (display->fshell)
		zwp_fullscreen_shell_v1_release(display->fshell);

	if (display->viewporter)
		wp_viewporter_destroy(display->viewporter);

	if (display->compositor)
		wl_compositor_destroy(display->compositor);

	wl_registry_destroy(display->registry);
	wl_display_flush(display->display);
	wl_display_disconnect(display->display);
	free(display);
}

static void
signal_int(int signum)
{
	running = 0;
}

static void
print_usage(int retval)
{
	printf(
		"usage: weston-simple-damage [options]\n\n"
		"options:\n"
		"  -h, --help\t\tPring this help\n"
		"  --verbose\t\tPrint verbose log information\n"
		"  --version=VERSION\tVersion of wl_surface to use\n"
		"  --width=WIDTH\t\tWidth of the window\n"
		"  --height=HEIGHT\tHeight of the window\n"
		"  --scale=SCALE\t\tScale factor for the surface\n"
		"  --transform=TRANSFORM\tTransform for the surface\n"
		"  --rotating-transform\tUse a different buffer_transform for each frame\n"
		"  --use-viewport\tUse wp_viewport\n"
		"  --use-damage-buffer\tUse damage_buffer to post damage\n"
	);

	exit(retval);
}

static int
parse_transform(const char *str, enum wl_output_transform *transform)
{
	int i;
	static const struct {
		const char *name;
		enum wl_output_transform transform;
	} names[] = {
		{ "normal",	WL_OUTPUT_TRANSFORM_NORMAL },
		{ "90",		WL_OUTPUT_TRANSFORM_90 },
		{ "180",	WL_OUTPUT_TRANSFORM_180 },
		{ "270",	WL_OUTPUT_TRANSFORM_270 },
		{ "flipped",	WL_OUTPUT_TRANSFORM_FLIPPED },
		{ "flipped-90",	WL_OUTPUT_TRANSFORM_FLIPPED_90 },
		{ "flipped-180", WL_OUTPUT_TRANSFORM_FLIPPED_180 },
		{ "flipped-270", WL_OUTPUT_TRANSFORM_FLIPPED_270 },
	};

	for (i = 0; i < 8; i++) {
		if (strcmp(names[i].name, str) == 0) {
			*transform = names[i].transform;
			return 1;
		}
	}

	return 0;
}

int
main(int argc, char **argv)
{
	struct sigaction sigint;
	struct display *display;
	struct window *window;
	int i, ret = 0;
	int version = -1;
	int width = 300, height = 200, scale = 1;
	enum wl_output_transform transform = WL_OUTPUT_TRANSFORM_NORMAL;
	enum window_flags flags = 0;

	for (i = 1; i < argc; ++i) {
		if (strcmp(argv[i], "--help") == 0 ||
		    strcmp(argv[i], "-h") == 0) {
			print_usage(0);
		} else if (sscanf(argv[i], "--version=%d", &version) > 0) {
			if (version < 1 || version > 4) {
				fprintf(stderr, "Unsupported wl_surface version: %d\n",
					version);
				return 1;
			}
			continue;
		} else if (strcmp(argv[i], "--verbose") == 0) {
			print_debug = 1;
			continue;
		} else if (sscanf(argv[i], "--width=%d", &width) > 0) {
			continue;
		} else if (sscanf(argv[i], "--height=%d", &height) > 0) {
			continue;
		} else if (strncmp(argv[i], "--transform=", 12) == 0 &&
			   parse_transform(argv[i] + 12, &transform) > 0) {
			continue;
		} else if (strcmp(argv[i], "--rotating-transform") == 0) {
			flags |= WINDOW_FLAG_ROTATING_TRANSFORM;
			continue;
		} else if (sscanf(argv[i], "--scale=%d", &scale) > 0) {
			continue;
		} else if (strcmp(argv[i], "--use-viewport") == 0) {
			flags |= WINDOW_FLAG_USE_VIEWPORT;
			continue;
		} else if (strcmp(argv[i], "--use-damage-buffer") == 0) {
			flags |= WINDOW_FLAG_USE_DAMAGE_BUFFER;
			continue;
		} else {
			printf("Invalid option: %s\n", argv[i]);
			print_usage(255);
		}
	}

	display = create_display(version);

	window = create_window(display, width, height, transform, scale, flags);
	if (!window)
		return 1;

	sigint.sa_handler = signal_int;
	sigemptyset(&sigint.sa_mask);
	sigint.sa_flags = SA_RESETHAND;
	sigaction(SIGINT, &sigint, NULL);

	if (!window->wait_for_configure)
		redraw(window, NULL, 0);

	while (running && ret != -1)
		ret = wl_display_dispatch(display->display);

	fprintf(stderr, "simple-shm exiting\n");
	destroy_window(window);
	destroy_display(display);

	return 0;
}

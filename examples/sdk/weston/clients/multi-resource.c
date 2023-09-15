/*
 * Copyright © 2011 Benjamin Franzke
 * Copyright © 2010, 2013 Intel Corporation
 * Copyright © 2021 Collabora, Ltd.
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
#include <errno.h>
#include <string.h>
#include <stdbool.h>
#include <assert.h>
#include <unistd.h>
#include <sys/mman.h>
#include <signal.h>
#include <time.h>
#include <poll.h>
#include <float.h>
#include <math.h>

#include <wayland-client.h>
#include "shared/os-compatibility.h"
#include "shared/xalloc.h"
#include <libweston/zalloc.h>

#include "xdg-shell-client-protocol.h"

static int running = 1;

struct device {
	enum { KEYBOARD, POINTER } type;

	int start_time;
	int end_time;
	struct wl_list link;

	union {
		struct wl_keyboard *keyboard;
		struct wl_pointer *pointer;
	} p;
};

struct display {
	struct wl_display *display;
	struct wl_registry *registry;
	struct wl_compositor *compositor;
	struct wl_seat *seat;
	struct wl_shm *shm;
	struct xdg_wm_base *wm_base;
	uint32_t formats;
	struct wl_list devices;
};

struct window {
	struct display *display;
	int width, height;
	struct wl_surface *surface;
	struct xdg_toplevel *xdg_toplevel;
	struct xdg_surface *xdg_surface;
	bool wait_for_configure;
};

static void
buffer_release(void *data, struct wl_buffer *buffer)
{
	wl_buffer_destroy(buffer);
}

static const struct wl_buffer_listener buffer_listener = {
	buffer_release
};

static int
attach_buffer(struct window *window, int width, int height)
{
	struct wl_shm_pool *pool;
	struct wl_buffer *buffer;
	int fd, size, stride;

	stride = width * 4;
	size = stride * height;

	fd = os_create_anonymous_file(size);
	if (fd < 0) {
		fprintf(stderr, "creating a buffer file for %d B failed: %s\n",
			size, strerror(errno));
		return -1;
	}

	pool = wl_shm_create_pool(window->display->shm, fd, size);
	buffer = wl_shm_pool_create_buffer(pool, 0,
					   width, height,
					   stride,
					   WL_SHM_FORMAT_XRGB8888);
	wl_surface_attach(window->surface, buffer, 0, 0);
	wl_buffer_add_listener(buffer, &buffer_listener, buffer);
	wl_shm_pool_destroy(pool);
	close(fd);

	return 0;
}

static void
handle_xdg_surface_configure(void *data, struct xdg_surface *surface,
			     uint32_t serial)
{
	struct window *window = data;

	xdg_surface_ack_configure(surface, serial);

	if (window->wait_for_configure) {

		attach_buffer(window, window->width, window->height);
		wl_surface_damage(window->surface, 0, 0, window->width, window->height);
		wl_surface_commit(window->surface);

		window->wait_for_configure = false;
	}
}

static const struct xdg_surface_listener xdg_surface_listener = {
	handle_xdg_surface_configure,
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
handle_toplevel_configure(void *data, struct xdg_toplevel *xdg_toplevel,
			      int32_t width, int32_t height,
			      struct wl_array *state)
{
}

static void
handle_toplevel_close(void *data, struct xdg_toplevel *xdg_toplevel)
{
	running = 0;
}

static const struct xdg_toplevel_listener xdg_toplevel_listener = {
	handle_toplevel_configure,
	handle_toplevel_close,
};

static struct window *
create_window(struct display *display, int width, int height)
{
	struct window *window;

	window = xzalloc(sizeof *window);
	window->display = display;
	window->width = width;
	window->height = height;
	window->surface = wl_compositor_create_surface(display->compositor);

	window->xdg_surface =
		xdg_wm_base_get_xdg_surface(display->wm_base, window->surface);
	assert(window->xdg_surface);

	xdg_surface_add_listener(window->xdg_surface, &xdg_surface_listener, window);

	window->xdg_toplevel = xdg_surface_get_toplevel(window->xdg_surface);
	assert(window->xdg_toplevel);
	xdg_toplevel_add_listener(window->xdg_toplevel,
				  &xdg_toplevel_listener, window);
	xdg_toplevel_set_title(window->xdg_toplevel, "multi-resource");
	window->wait_for_configure = true;
	wl_surface_commit(window->surface);

	return window;
}

static void
destroy_window(struct window *window)
{
	if (window->xdg_surface)
		xdg_surface_destroy(window->xdg_surface);
	if (window->xdg_toplevel)
		xdg_toplevel_destroy(window->xdg_toplevel);

	wl_surface_destroy(window->surface);
	free(window);
}

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
registry_handle_global(void *data, struct wl_registry *registry,
		       uint32_t id, const char *interface, uint32_t version)
{
	struct display *d = data;

	if (strcmp(interface, "wl_compositor") == 0) {
		d->compositor =
			wl_registry_bind(registry,
					 id, &wl_compositor_interface, 1);
	} else if (strcmp(interface, "xdg_wm_base") == 0) {
		d->wm_base = wl_registry_bind(registry,
					    id, &xdg_wm_base_interface, 1);
		xdg_wm_base_add_listener(d->wm_base, &wm_base_listener, d);
	} else if (strcmp(interface, "wl_shm") == 0) {
		d->shm = wl_registry_bind(registry,
					  id, &wl_shm_interface, 1);
		wl_shm_add_listener(d->shm, &shm_listener, d);
	} else if (strcmp(interface, "wl_seat") == 0 &&
		   d->seat == NULL) {
		d->seat = wl_registry_bind(registry,
					   id, &wl_seat_interface, 3);
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
create_display(void)
{
	struct display *display;

	display = xzalloc(sizeof *display);
	display->display = wl_display_connect(NULL);
	assert(display->display);

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

	if (!display->wm_base) {
		fprintf(stderr, "xdg-shell required!\n");
		exit(1);
	}

	wl_list_init(&display->devices);

	return display;
}

static void
pointer_handle_enter(void *data, struct wl_pointer *pointer,
		     uint32_t serial, struct wl_surface *surface,
		     wl_fixed_t sx_w, wl_fixed_t sy_w)
{
}

static void
pointer_handle_leave(void *data, struct wl_pointer *pointer,
		     uint32_t serial, struct wl_surface *surface)
{
}

static void
pointer_handle_motion(void *data, struct wl_pointer *pointer,
		      uint32_t time, wl_fixed_t sx_w, wl_fixed_t sy_w)
{
}

static void
pointer_handle_button(void *data, struct wl_pointer *pointer, uint32_t serial,
		      uint32_t time, uint32_t button, uint32_t state_w)
{
}

static void
pointer_handle_axis(void *data, struct wl_pointer *pointer,
		    uint32_t time, uint32_t axis, wl_fixed_t value)
{
}

static const struct wl_pointer_listener pointer_listener = {
	pointer_handle_enter,
	pointer_handle_leave,
	pointer_handle_motion,
	pointer_handle_button,
	pointer_handle_axis,
};

static void
keyboard_handle_keymap(void *data, struct wl_keyboard *keyboard,
		       uint32_t format, int fd, uint32_t size)
{
	/* Just so we don’t leak the keymap fd */
	close(fd);
}

static void
keyboard_handle_enter(void *data, struct wl_keyboard *keyboard,
		      uint32_t serial, struct wl_surface *surface,
		      struct wl_array *keys)
{
}

static void
keyboard_handle_leave(void *data, struct wl_keyboard *keyboard,
		      uint32_t serial, struct wl_surface *surface)
{
}

static void
keyboard_handle_key(void *data, struct wl_keyboard *keyboard,
		    uint32_t serial, uint32_t time, uint32_t key,
		    uint32_t state_w)
{
}

static void
keyboard_handle_modifiers(void *data, struct wl_keyboard *keyboard,
			  uint32_t serial, uint32_t mods_depressed,
			  uint32_t mods_latched, uint32_t mods_locked,
			  uint32_t group)
{
}

static const struct wl_keyboard_listener keyboard_listener = {
	keyboard_handle_keymap,
	keyboard_handle_enter,
	keyboard_handle_leave,
	keyboard_handle_key,
	keyboard_handle_modifiers,
};

static void
start_device(struct display *display, struct device *device)
{
	if (display->seat == NULL)
		return;

	switch (device->type) {
	case KEYBOARD:
		if (device->p.keyboard == NULL) {
			device->p.keyboard =
				wl_seat_get_keyboard(display->seat);
			wl_keyboard_add_listener(device->p.keyboard,
						 &keyboard_listener,
						 NULL);
		}
		break;
	case POINTER:
		if (device->p.pointer == NULL) {
			device->p.pointer =
				wl_seat_get_pointer(display->seat);
			wl_pointer_add_listener(device->p.pointer,
						&pointer_listener,
						NULL);
		}
		break;
	}
}

static void
destroy_device(struct device *device)
{
	switch (device->type) {
	case KEYBOARD:
		if (device->p.keyboard)
			wl_keyboard_release(device->p.keyboard);
		break;
	case POINTER:
		if (device->p.pointer)
			wl_pointer_release(device->p.pointer);
		break;
	}

	wl_list_remove(&device->link);
	free(device);
}

static void
destroy_devices(struct display *display)
{
	struct device *device, *tmp;

	wl_list_for_each_safe(device, tmp, &display->devices, link)
	destroy_device(device);
}

static void
destroy_display(struct display *display)
{
	destroy_devices(display);

	if (display->shm)
		wl_shm_destroy(display->shm);

	if (display->wm_base)
		xdg_wm_base_destroy(display->wm_base);

	if (display->seat)
		wl_seat_destroy(display->seat);

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

static int
create_device(struct display *display, const char *time_desc, int type)
{
	int start_time;
	int end_time = -1;
	char *tail;
	struct device *device;

	if (time_desc == NULL) {
		fprintf(stderr, "missing time description\n");
		return -1;
	}

	errno = 0;
	start_time = strtoul(time_desc, &tail, 10);
	if (errno || tail == time_desc)
		goto error;

	if (*tail == ':') {
		time_desc = tail + 1;
		end_time = strtoul(time_desc, &tail, 10);
		if (errno || tail == time_desc || *tail != '\0')
			goto error;
	} else if (*tail != '\0') {
		goto error;
	}

	device = xzalloc(sizeof *device);
	device->type = type;
	device->start_time = start_time;
	device->end_time = end_time;
	wl_list_insert(&display->devices, &device->link);

	return 0;

error:
	fprintf(stderr, "invalid time description\n");
	return -1;
}

static struct timespec begin_time;

static void
reset_timer(void)
{
	clock_gettime(CLOCK_MONOTONIC, &begin_time);
}

static double
read_timer(void)
{
	struct timespec t;

	clock_gettime(CLOCK_MONOTONIC, &t);
	return (double)(t.tv_sec - begin_time.tv_sec) +
	       1e-9 * (t.tv_nsec - begin_time.tv_nsec);
}

static void
main_loop(struct display *display)
{
	reset_timer();

	while (running) {
		struct device *device, *tmp;
		struct pollfd fds[1];
		double sleep_time = DBL_MAX;
		double now;

		if (wl_display_dispatch_pending(display->display) == -1)
			break;
		if (wl_display_flush(display->display) == -1)
			break;

		now = read_timer();

		wl_list_for_each(device, &display->devices, link) {
			double next_time = device->start_time - now;
			if (next_time < 0.0) {
				sleep_time = 0.0;
				break;
			} else if (next_time < sleep_time) {
				sleep_time = next_time;
			}
			next_time = device->end_time - now;
			if (next_time < 0.0) {
				sleep_time = 0.0;
				break;
			} else if (next_time < sleep_time) {
				sleep_time = next_time;
			}
		}

		fds[0].fd = wl_display_get_fd(display->display);
		fds[0].events = POLLIN;
		fds[0].revents = 0;

		poll(fds,
		     sizeof fds / sizeof fds[0],
		     sleep_time == DBL_MAX ? -1 : ceil(sleep_time * 1000.0));

		if (fds[0].revents &&
		    wl_display_dispatch(display->display) == -1)
			break;

		now = read_timer();

		wl_list_for_each_safe(device, tmp, &display->devices, link) {
			if (device->start_time <= now)
				start_device(display, device);
			if (device->end_time >= 0 && device->end_time <= now)
				destroy_device(device);
		}
	}
}

int
main(int argc, char **argv)
{
	struct sigaction sigint;
	struct display *display;
	struct window *window;
	int i;

	display = create_display();
	window = create_window(display, 250, 250);

	for (i = 1; i < argc; i++) {
		if (!strncmp(argv[i], "-p", 2)) {
			char *arg;
			if (argv[i][2]) {
				arg = argv[i] + 2;
			} else {
				arg = argv[i + 1];
				i++;
			}
			if (create_device(display, arg, POINTER) == -1)
				return 1;
		} else if (!strncmp(argv[i], "-k", 2)) {
			char *arg;
			if (argv[i][2]) {
				arg = argv[i] + 2;
			} else {
				arg = argv[i + 1];
				i++;
			}
			if (create_device(display, arg, KEYBOARD) == -1)
				return 1;
		} else {
			fprintf(stderr, "unknown argument %s\n", argv[i]);
			return 1;
		}
	}

	sigint.sa_handler = signal_int;
	sigemptyset(&sigint.sa_mask);
	sigint.sa_flags = SA_RESETHAND;
	sigaction(SIGINT, &sigint, NULL);

	main_loop(display);

	fprintf(stderr, "multi-resource exiting\n");
	destroy_window(window);
	destroy_display(display);

	return 0;
}

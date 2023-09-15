/*
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

#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <cairo.h>
#include <math.h>
#include <assert.h>
#include <errno.h>

#include <linux/input.h>
#include <wayland-client.h>

#include "window.h"
#include "shared/xalloc.h"

struct spring {
	double current;
	double target;
	double previous;
};

struct resizor {
	struct display *display;
	struct window *window;
	struct widget *widget;
	struct window *menu;
	struct spring width;
	struct spring height;
	struct wl_callback *frame_callback;
	bool pointer_locked;
	bool locked_frame_callback_registered;
	struct input *locked_input;
	float pointer_x;
	float pointer_y;
};

static void
spring_update(struct spring *spring)
{
	double current, force;

	current = spring->current;
	force = (spring->target - current) / 20.0 +
		(spring->previous - current);

	spring->current = current + (current - spring->previous) + force;
	spring->previous = current;
}

static int
spring_done(struct spring *spring)
{
	return fabs(spring->previous - spring->target) < 0.1;
}

static const struct wl_callback_listener listener;

static void
frame_callback(void *data, struct wl_callback *callback, uint32_t time)
{
	struct resizor *resizor = data;

	assert(!callback || callback == resizor->frame_callback);

	if (resizor->frame_callback) {
		wl_callback_destroy(resizor->frame_callback);
		resizor->frame_callback = NULL;
	}

	if (window_is_maximized(resizor->window))
		return;

	spring_update(&resizor->width);
	spring_update(&resizor->height);

	widget_schedule_resize(resizor->widget,
			       resizor->width.current + 0.5,
			       resizor->height.current + 0.5);

	if (!spring_done(&resizor->width) || !spring_done(&resizor->height)) {
		resizor->frame_callback =
			wl_surface_frame(
				window_get_wl_surface(resizor->window));
		wl_callback_add_listener(resizor->frame_callback, &listener,
					 resizor);
	}
}

static const struct wl_callback_listener listener = {
	frame_callback
};

static void
redraw_handler(struct widget *widget, void *data)
{
	struct resizor *resizor = data;
	cairo_surface_t *surface;
	cairo_t *cr;
	struct rectangle allocation;

	widget_get_allocation(resizor->widget, &allocation);

	surface = window_get_surface(resizor->window);

	cr = cairo_create(surface);
	cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);
	cairo_rectangle(cr,
			allocation.x,
			allocation.y,
			allocation.width,
			allocation.height);
	cairo_set_source_rgba(cr, 0, 0, 0, 0.8);
	cairo_fill(cr);
	cairo_destroy(cr);

	cairo_surface_destroy(surface);
}

static void
keyboard_focus_handler(struct window *window,
		       struct input *device, void *data)
{
	struct resizor *resizor = data;

	window_schedule_redraw(resizor->window);
}

static void
key_handler(struct window *window, struct input *input, uint32_t time,
	    uint32_t key, uint32_t sym, enum wl_keyboard_key_state state,
	    void *data)
{
	struct resizor *resizor = data;
	struct rectangle allocation;

	if (state == WL_KEYBOARD_KEY_STATE_RELEASED)
		return;

	window_get_allocation(resizor->window, &allocation);
	resizor->width.current = allocation.width;
	if (spring_done(&resizor->width))
		resizor->width.target = allocation.width;
	resizor->height.current = allocation.height;
	if (spring_done(&resizor->height))
		resizor->height.target = allocation.height;

	switch (sym) {
	case XKB_KEY_Up:
		if (allocation.height < 400)
			break;

		resizor->height.target = allocation.height - 200;
		break;

	case XKB_KEY_Down:
		if (allocation.height > 1000)
			break;

		resizor->height.target = allocation.height + 200;
		break;

	case XKB_KEY_Left:
		if (allocation.width < 400)
			break;

		resizor->width.target = allocation.width - 200;
		break;

	case XKB_KEY_Right:
		if (allocation.width > 1000)
			break;

		resizor->width.target = allocation.width + 200;
		break;

	case XKB_KEY_Escape:
		display_exit(resizor->display);
		break;
	}

	if (!resizor->frame_callback)
		frame_callback(resizor, NULL, 0);
}

static void
menu_func(void *data, struct input *input, int index)
{
	fprintf(stderr, "picked entry %d\n", index);
}

static void
show_menu(struct resizor *resizor, struct input *input, uint32_t time)
{
	int32_t x, y;
	static const char *entries[] = {
		"Roy", "Pris", "Leon", "Zhora"
	};

	input_get_position(input, &x, &y);
	window_show_menu(resizor->display, input, time, resizor->window,
			 x - 10, y - 10, menu_func, entries, 4);
}

static void
locked_pointer_handle_motion(struct window *window,
			     struct input *input,
			     uint32_t time,
			     float dx,
			     float dy,
			     void *data)
{
	struct resizor *resizor = data;

	resizor->width.current += dx;
	resizor->width.previous = resizor->width.current;
	resizor->width.target = resizor->width.current;

	resizor->height.current += dy;
	resizor->height.previous = resizor->height.current;
	resizor->height.target = resizor->height.current;

	widget_schedule_resize(resizor->widget,
			       resizor->width.current,
			       resizor->height.current);
}

static void
handle_pointer_locked(struct window *window, struct input *input, void *data)
{
	struct resizor *resizor = data;

	resizor->pointer_locked = true;
	input_set_pointer_image(input, CURSOR_BLANK);
}

static void
handle_pointer_unlocked(struct window *window, struct input *input, void *data)
{
	struct resizor *resizor = data;

	resizor->pointer_locked = false;
	input_set_pointer_image(input, CURSOR_LEFT_PTR);
}

static const struct wl_callback_listener locked_pointer_frame_listener;

static void
locked_pointer_frame_callback(void *data,
			      struct wl_callback *callback,
			      uint32_t time)
{
	struct resizor *resizor = data;
	struct wl_surface *surface;
	struct rectangle allocation;
	float x, y;

	if (resizor->pointer_locked) {
		widget_get_allocation(resizor->widget, &allocation);

		x = resizor->pointer_x + (allocation.width - allocation.x);
		y = resizor->pointer_y + (allocation.height - allocation.y);

		widget_set_locked_pointer_cursor_hint(resizor->widget, x, y);
	}

	wl_callback_destroy(callback);

	surface = window_get_wl_surface(resizor->window);
	callback = wl_surface_frame(surface);
	wl_callback_add_listener(callback,
				 &locked_pointer_frame_listener,
				 resizor);
}

static const struct wl_callback_listener locked_pointer_frame_listener = {
	locked_pointer_frame_callback
};

static void
button_handler(struct widget *widget,
	       struct input *input, uint32_t time,
	       uint32_t button, enum wl_pointer_button_state state, void *data)
{
	struct resizor *resizor = data;
	struct rectangle allocation;
	struct wl_surface *surface;
	struct wl_callback *callback;

	if (button == BTN_RIGHT && state == WL_POINTER_BUTTON_STATE_PRESSED) {
		show_menu(resizor, input, time);
	} else if (button == BTN_LEFT &&
		   state == WL_POINTER_BUTTON_STATE_PRESSED) {
		window_get_allocation(resizor->window, &allocation);

		resizor->width.current = allocation.width;
		resizor->width.previous = allocation.width;
		resizor->width.target = allocation.width;

		resizor->height.current = allocation.height;
		resizor->height.previous = allocation.height;
		resizor->height.target = allocation.height;

		window_lock_pointer(resizor->window, input);
		window_set_pointer_locked_handler(resizor->window,
						  handle_pointer_locked,
						  handle_pointer_unlocked);
		resizor->locked_input = input;

		if (resizor->locked_frame_callback_registered)
			return;

		surface = window_get_wl_surface(resizor->window);
		callback = wl_surface_frame(surface);
		wl_callback_add_listener(callback,
					 &locked_pointer_frame_listener,
					 resizor);
		resizor->locked_frame_callback_registered = true;
	} else if (button == BTN_LEFT &&
		   state == WL_POINTER_BUTTON_STATE_RELEASED) {
		input_set_pointer_image(input, CURSOR_LEFT_PTR);
		window_unlock_pointer(resizor->window);
	}
}

static void
set_cursor_inv_offset(struct resizor *resizor, float x, float y)
{
	struct rectangle allocation;

	widget_get_allocation(resizor->widget, &allocation);

	resizor->pointer_x = x - (allocation.width - allocation.x);
	resizor->pointer_y = y - (allocation.height - allocation.y);
}

static int
enter_handler(struct widget *widget,
	      struct input *input,
	      float x, float y, void *data)
{
	struct resizor *resizor = data;

	set_cursor_inv_offset(resizor, x , y);

	return CURSOR_LEFT_PTR;
}

static int
motion_handler(struct widget *widget,
	       struct input *input, uint32_t time,
	       float x, float y, void *data)
{
	struct resizor *resizor = data;

	set_cursor_inv_offset(resizor, x , y);

	return CURSOR_LEFT_PTR;
}

static struct resizor *
resizor_create(struct display *display)
{
	struct resizor *resizor;

	resizor = xzalloc(sizeof *resizor);
	resizor->window = window_create(display);
	resizor->widget = window_frame_create(resizor->window, resizor);
	window_set_title(resizor->window, "Wayland Resizor");
	window_set_appid(resizor->window,
			 "org.freedesktop.weston.wayland-resizor");
	resizor->display = display;

	window_set_key_handler(resizor->window, key_handler);
	window_set_user_data(resizor->window, resizor);
	widget_set_redraw_handler(resizor->widget, redraw_handler);
	window_set_keyboard_focus_handler(resizor->window,
					  keyboard_focus_handler);

	widget_set_enter_handler(resizor->widget, enter_handler);
	widget_set_motion_handler(resizor->widget, motion_handler);

	window_set_locked_pointer_motion_handler(
			resizor->window, locked_pointer_handle_motion);

	widget_set_button_handler(resizor->widget, button_handler);

	resizor->height.previous = 400;
	resizor->height.current = 400;
	resizor->height.target = 400;

	resizor->width.previous = 400;
	resizor->width.current = 400;
	resizor->width.target = 400;

	widget_schedule_resize(resizor->widget, 400, 400);

	return resizor;
}

static void
resizor_destroy(struct resizor *resizor)
{
	if (resizor->frame_callback)
		wl_callback_destroy(resizor->frame_callback);

	widget_destroy(resizor->widget);
	window_destroy(resizor->window);
	free(resizor);
}

int
main(int argc, char *argv[])
{
	struct display *display;
	struct resizor *resizor;

	display = display_create(&argc, argv);
	if (display == NULL) {
		fprintf(stderr, "failed to create display: %s\n",
			strerror(errno));
		return -1;
	}

	resizor = resizor_create(display);

	display_run(display);

	resizor_destroy(resizor);
	display_destroy(display);

	return 0;
}

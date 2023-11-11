/*
 * Copyright © 2008 Kristian Høgsberg
 * Copyright © 2012 Intel Corporation
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
#include <math.h>
#include <errno.h>
#include <cairo.h>

#include <linux/input.h>
#include <wayland-client.h>
#include "window.h"

struct transformed {
	struct display *display;
	struct window *window;
	struct widget *widget;
	int width, height;
	int fullscreen;
};

static void
draw_stuff(cairo_t *cr, int width, int height)
{
	cairo_matrix_t m;
	cairo_get_matrix (cr, &m);

	cairo_translate(cr, width / 2, height / 2);
	cairo_scale(cr, width / 2, height / 2);

	cairo_set_source_rgba(cr, 0, 0, 0.3, 1.0);
	cairo_set_source_rgba(cr, 0, 0, 0, 1.0);
	cairo_rectangle(cr, -1, -1, 2, 2);
	cairo_fill(cr);

	cairo_set_source_rgb(cr, 1, 0, 0);
	cairo_move_to(cr, 0,  0);
	cairo_line_to(cr, 0, -1);

	cairo_save(cr);
	cairo_set_matrix(cr, &m);
	cairo_set_line_width(cr, 2.0);
	cairo_stroke(cr);
	cairo_restore(cr);

	cairo_set_source_rgb(cr, 0, 1, 0);
	cairo_move_to(cr, 0, 0);
	cairo_line_to(cr, 1, 0);

	cairo_save(cr);
	cairo_set_matrix(cr, &m);
	cairo_set_line_width(cr, 2.0);
	cairo_stroke(cr);
	cairo_restore(cr);

	cairo_set_source_rgb(cr, 1, 1, 1);
	cairo_move_to(cr, 0, 0);
	cairo_line_to(cr, 0, 1);
	cairo_move_to(cr,  0, 0);
	cairo_line_to(cr, -1, 0);

	cairo_save(cr);
	cairo_set_matrix(cr, &m);
	cairo_set_line_width(cr, 2.0);
	cairo_stroke(cr);
	cairo_restore(cr);

	cairo_destroy(cr);
}

static void
fullscreen_handler(struct window *window, void *data)
{
	struct transformed *transformed = data;

	transformed->fullscreen ^= 1;
	window_set_fullscreen(window, transformed->fullscreen);
}

static void
redraw_handler(struct widget *widget, void *data)
{
	struct transformed *transformed = data;
	struct rectangle allocation;
	cairo_surface_t *surface;
	cairo_t *cr;

	surface = window_get_surface(transformed->window);
	if (surface == NULL ||
	    cairo_surface_status(surface) != CAIRO_STATUS_SUCCESS) {
		fprintf(stderr, "failed to create cairo egl surface\n");
		return;
	}

	widget_get_allocation(transformed->widget, &allocation);

	cr = widget_cairo_create(widget);
	draw_stuff(cr, allocation.width, allocation.height);

	cairo_surface_destroy(surface);
}

static void
output_handler(struct window *window, struct output *output, int enter,
	       void *data)
{
	if (!enter)
		return;

	window_set_buffer_transform(window, output_get_transform(output));
	window_set_buffer_scale(window, output_get_scale(output));
	window_schedule_redraw(window);
}

static void
key_handler(struct window *window, struct input *input, uint32_t time,
	    uint32_t key, uint32_t sym, enum wl_keyboard_key_state state,
	    void *data)
{
	int transform, scale;

	if (state == WL_KEYBOARD_KEY_STATE_RELEASED)
		return;

	transform = window_get_buffer_transform (window);
	scale = window_get_buffer_scale (window);
	switch (sym) {
	case XKB_KEY_Left:
		if (transform == 0)
			transform = 3;
		else if (transform == 4)
			transform = 7;
		else
			transform--;
		break;

	case XKB_KEY_Right:
		if (transform == 3)
			transform = 0;
		else if (transform == 7)
			transform = 4;
		else
			transform++;
		break;

	case XKB_KEY_space:
		if (transform >= 4)
			transform -= 4;
		else
			transform += 4;
		break;

	case XKB_KEY_z:
		if (scale == 1)
			scale = 2;
		else
			scale = 1;
		break;
	}

	printf ("setting buffer transform to %d\n", transform);
	printf ("setting buffer scale to %d\n", scale);
	window_set_buffer_transform(window, transform);
	window_set_buffer_scale(window, scale);
	window_schedule_redraw(window);
}

static void
button_handler(struct widget *widget,
	       struct input *input, uint32_t time,
	       uint32_t button, enum wl_pointer_button_state state, void *data)
{
	struct transformed *transformed = data;

	switch (button) {
	case BTN_LEFT:
		if (state == WL_POINTER_BUTTON_STATE_PRESSED)
			window_move(transformed->window, input,
				    display_get_serial(transformed->display));
		break;
	case BTN_MIDDLE:
		if (state == WL_POINTER_BUTTON_STATE_PRESSED)
			widget_schedule_redraw(widget);
		break;
	case BTN_RIGHT:
		if (state == WL_POINTER_BUTTON_STATE_PRESSED)
			window_show_frame_menu(transformed->window, input, time);
		break;
	}
}

static void
touch_handler(struct widget *widget, struct input *input,
		   uint32_t serial, uint32_t time, int32_t id,
		   float x, float y, void *data)
{
	struct transformed *transformed = data;
	window_move(transformed->window, input, display_get_serial(transformed->display));
}

static void
usage(int error_code)
{
	fprintf(stderr, "Usage: transformed [OPTIONS]\n\n"
		"   -w <width>\tSet window width to <width>\n"
		"   -h <height>\tSet window height to <height>\n"
		"   --help\tShow this help text\n\n");

	fprintf(stderr, "This version has been fixed for "
		"https://gitlab.freedesktop.org/wayland/weston/issues/99 .\n");

	exit(error_code);
}

int main(int argc, char *argv[])
{
	struct transformed transformed;
	struct display *d;
	int i;

	transformed.width = 500;
	transformed.height = 250;
	transformed.fullscreen = 0;

	for (i = 1; i < argc; i++) {
		if (strcmp(argv[i], "-w") == 0) {
			if (++i >= argc)
				usage(EXIT_FAILURE);

			transformed.width = atol(argv[i]);
		} else if (strcmp(argv[i], "-h") == 0) {
			if (++i >= argc)
				usage(EXIT_FAILURE);

			transformed.height = atol(argv[i]);
		} else if (strcmp(argv[i], "--help") == 0)
			usage(EXIT_SUCCESS);
		else
			usage(EXIT_FAILURE);
	}

	d = display_create(&argc, argv);
	if (d == NULL) {
		fprintf(stderr, "failed to create display: %s\n",
			strerror(errno));
		return -1;
	}

	transformed.display = d;
	transformed.window = window_create(d);
	transformed.widget =
		window_add_widget(transformed.window, &transformed);

	window_set_title(transformed.window, "Transformed");
	window_set_appid(transformed.window,
			 "org.freedesktop.weston.transformed");

	widget_set_transparent(transformed.widget, 0);
	widget_set_default_cursor(transformed.widget, CURSOR_BLANK);

	widget_set_redraw_handler(transformed.widget, redraw_handler);
	widget_set_button_handler(transformed.widget, button_handler);

	widget_set_touch_down_handler(transformed.widget, touch_handler);

	window_set_key_handler(transformed.window, key_handler);
	window_set_fullscreen_handler(transformed.window, fullscreen_handler);
	window_set_output_handler(transformed.window, output_handler);

	window_set_user_data(transformed.window, &transformed);
	window_schedule_resize(transformed.window,
			       transformed.width, transformed.height);

	display_run(d);
	widget_destroy(transformed.widget);
	window_destroy(transformed.window);
	display_destroy(d);

	return 0;
}

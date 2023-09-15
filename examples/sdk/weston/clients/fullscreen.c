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
#include <stdarg.h>
#include <string.h>
#include <math.h>
#include <errno.h>
#include <cairo.h>

#include <linux/input.h>
#include <wayland-client.h>
#include "window.h"
#include "fullscreen-shell-unstable-v1-client-protocol.h"
#include <libweston/zalloc.h>

struct fs_output {
	struct wl_list link;
	struct output *output;
};

struct fullscreen {
	struct display *display;
	struct window *window;
	struct widget *widget;
	struct zwp_fullscreen_shell_v1 *fshell;
	enum zwp_fullscreen_shell_v1_present_method present_method;
	int width, height;
	int fullscreen;
	float pointer_x, pointer_y;
	int draw_cursor;

	struct wl_list output_list;
	struct fs_output *current_output;
};

static void
fullscreen_handler(struct window *window, void *data)
{
	struct fullscreen *fullscreen = data;

	fullscreen->fullscreen ^= 1;
	window_set_fullscreen(window, fullscreen->fullscreen);
}

static void
draw_string(cairo_t *cr,
	    const char *fmt, ...)
{
	char buffer[4096];
	char *p, *end;
	va_list argp;
	cairo_text_extents_t text_extents;
	cairo_font_extents_t font_extents;

	cairo_save(cr);

	cairo_select_font_face(cr, "sans-serif",
			       CAIRO_FONT_SLANT_NORMAL,
			       CAIRO_FONT_WEIGHT_NORMAL);
	cairo_set_font_size(cr, 14);

	cairo_font_extents (cr, &font_extents);

	va_start(argp, fmt);

	vsnprintf(buffer, sizeof(buffer), fmt, argp);

	p = buffer;
	while (*p) {
		end = strchr(p, '\n');
		if (end)
			*end = 0;

		cairo_show_text(cr, p);
		cairo_text_extents (cr, p, &text_extents);
		cairo_rel_move_to (cr, -text_extents.x_advance, font_extents.height);

		if (end)
			p = end + 1;
		else
			break;
	}

	va_end(argp);

	cairo_restore(cr);

}

static void
redraw_handler(struct widget *widget, void *data)
{
	struct fullscreen *fullscreen = data;
	struct rectangle allocation;
	cairo_surface_t *surface;
	cairo_t *cr;
	int i;
	double x, y, border;
	const char *method_name[] = { "default", "center", "zoom", "zoom_crop", "stretch"};

	surface = window_get_surface(fullscreen->window);
	if (surface == NULL ||
	    cairo_surface_status(surface) != CAIRO_STATUS_SUCCESS) {
		fprintf(stderr, "failed to create cairo egl surface\n");
		return;
	}

	widget_get_allocation(fullscreen->widget, &allocation);

	cr = widget_cairo_create(widget);

	cairo_set_source_rgb(cr, 0, 0, 0);
	cairo_paint (cr);

	cairo_set_source_rgb(cr, 0, 0, 1);
	cairo_set_line_width (cr, 10);
	cairo_rectangle(cr, 5, 5, allocation.width - 10, allocation.height - 10);
	cairo_stroke (cr);

	cairo_move_to(cr,
		      allocation.x + 15,
		      allocation.y + 25);
	cairo_set_source_rgb(cr, 1, 1, 1);

	if (fullscreen->fshell) {
		draw_string(cr,
			    "Surface size: %d, %d\n"
			    "Scale: %d, transform: %d\n"
			    "Pointer: %f,%f\n"
			    "Output: %s, present method: %s\n"
			    "Keys: (s)cale, (t)ransform, si(z)e, (m)ethod,\n"
			    "      (o)utput, modes(w)itch, (q)uit\n",
			    fullscreen->width, fullscreen->height,
			    window_get_buffer_scale (fullscreen->window),
			    window_get_buffer_transform (fullscreen->window),
			    fullscreen->pointer_x, fullscreen->pointer_y,
			    method_name[fullscreen->present_method],
			    fullscreen->current_output ? output_get_model(fullscreen->current_output->output): "null");
	} else {
		draw_string(cr,
			    "Surface size: %d, %d\n"
			    "Scale: %d, transform: %d\n"
			    "Pointer: %f,%f\n"
			    "Fullscreen: %d\n"
			    "Keys: (s)cale, (t)ransform, si(z)e, (f)ullscreen, (q)uit\n",
			    fullscreen->width, fullscreen->height,
			    window_get_buffer_scale (fullscreen->window),
			    window_get_buffer_transform (fullscreen->window),
			    fullscreen->pointer_x, fullscreen->pointer_y,
			    fullscreen->fullscreen);
	}

	y = 100;
	i = 0;
	while (y + 60 < fullscreen->height) {
		border = (i++ % 2 == 0) ? 1 : 0.5;

		x = 50;
		cairo_set_line_width (cr, border);
		while (x + 70 < fullscreen->width) {
			if (window_has_focus(fullscreen->window) &&
			    fullscreen->pointer_x >= x && fullscreen->pointer_x < x + 50 &&
			    fullscreen->pointer_y >= y && fullscreen->pointer_y < y + 40) {
				cairo_set_source_rgb(cr, 1, 0, 0);
				cairo_rectangle(cr,
						x, y,
						50, 40);
				cairo_fill(cr);
			}
			cairo_set_source_rgb(cr, 0, 1, 0);
			cairo_rectangle(cr,
					x + border/2.0, y + border/2.0,
					50, 40);
			cairo_stroke(cr);
			x += 60;
		}

		y += 50;
	}

	if (window_has_focus(fullscreen->window) && fullscreen->draw_cursor) {
		cairo_set_source_rgb(cr, 1, 1, 1);
		cairo_set_line_width (cr, 8);
		cairo_move_to(cr,
			      fullscreen->pointer_x - 12,
			      fullscreen->pointer_y - 12);
		cairo_line_to(cr,
			      fullscreen->pointer_x + 12,
			      fullscreen->pointer_y + 12);
		cairo_stroke(cr);

		cairo_move_to(cr,
			      fullscreen->pointer_x + 12,
			      fullscreen->pointer_y - 12);
		cairo_line_to(cr,
			      fullscreen->pointer_x - 12,
			      fullscreen->pointer_y + 12);
		cairo_stroke(cr);

		cairo_set_source_rgb(cr, 0, 0, 0);
		cairo_set_line_width (cr, 4);
		cairo_move_to(cr,
			      fullscreen->pointer_x - 10,
			      fullscreen->pointer_y - 10);
		cairo_line_to(cr,
			      fullscreen->pointer_x + 10,
			      fullscreen->pointer_y + 10);
		cairo_stroke(cr);

		cairo_move_to(cr,
			      fullscreen->pointer_x + 10,
			      fullscreen->pointer_y - 10);
		cairo_line_to(cr,
			      fullscreen->pointer_x - 10,
			      fullscreen->pointer_y + 10);
		cairo_stroke(cr);
	}

	cairo_destroy(cr);
}

static void
key_handler(struct window *window, struct input *input, uint32_t time,
	    uint32_t key, uint32_t sym, enum wl_keyboard_key_state state,
	    void *data)
{
	struct fullscreen *fullscreen = data;
	int transform, scale;
	static int current_size = 0;
	struct fs_output *fsout;
	struct wl_output *wl_output;
	int widths[] = { 640, 320, 800, 400 };
	int heights[] = { 480, 240, 600, 300 };

	if (state == WL_KEYBOARD_KEY_STATE_RELEASED)
		return;

	switch (sym) {
	case XKB_KEY_t:
		transform = window_get_buffer_transform (window);
		transform = (transform + 1) % 8;
		window_set_buffer_transform(window, transform);
		window_schedule_redraw(window);
		break;

	case XKB_KEY_s:
		scale = window_get_buffer_scale (window);
		if (scale == 1)
			scale = 2;
		else
			scale = 1;
		window_set_buffer_scale(window, scale);
		window_schedule_redraw(window);
		break;

	case XKB_KEY_z:
		if (fullscreen->fullscreen)
			break;

		current_size = (current_size + 1) % 4;
		fullscreen->width = widths[current_size];
		fullscreen->height = heights[current_size];
		window_schedule_resize(fullscreen->window,
				       fullscreen->width, fullscreen->height);
		break;

	case XKB_KEY_m:
		if (!fullscreen->fshell)
			break;

		wl_output = NULL;
		if (fullscreen->current_output)
			wl_output = output_get_wl_output(fullscreen->current_output->output);
		fullscreen->present_method = (fullscreen->present_method + 1) % 5;
		zwp_fullscreen_shell_v1_present_surface(fullscreen->fshell,
							window_get_wl_surface(fullscreen->window),
							fullscreen->present_method,
							wl_output);
		window_schedule_redraw(window);
		break;

	case XKB_KEY_o:
		if (!fullscreen->fshell)
			break;

		fsout = fullscreen->current_output;
		wl_output = fsout ? output_get_wl_output(fsout->output) : NULL;

		/* Clear the current presentation */
		zwp_fullscreen_shell_v1_present_surface(fullscreen->fshell, NULL,
							0, wl_output);

		if (fullscreen->current_output) {
			if (fullscreen->current_output->link.next == &fullscreen->output_list)
				fsout = NULL;
			else
				fsout = wl_container_of(fullscreen->current_output->link.next,
							fsout, link);
		} else {
			fsout = wl_container_of(fullscreen->output_list.next,
						fsout, link);
		}

		fullscreen->current_output = fsout;
		wl_output = fsout ? output_get_wl_output(fsout->output) : NULL;
		zwp_fullscreen_shell_v1_present_surface(fullscreen->fshell,
							window_get_wl_surface(fullscreen->window),
							fullscreen->present_method,
							wl_output);
		window_schedule_redraw(window);
		break;

	case XKB_KEY_w:
		if (!fullscreen->fshell || !fullscreen->current_output)
			break;

		wl_output = NULL;
		if (fullscreen->current_output)
			wl_output = output_get_wl_output(fullscreen->current_output->output);
		zwp_fullscreen_shell_mode_feedback_v1_destroy(
			zwp_fullscreen_shell_v1_present_surface_for_mode(fullscreen->fshell,
									 window_get_wl_surface(fullscreen->window),
									 wl_output, 0));
		window_schedule_redraw(window);
		break;

	case XKB_KEY_f:
		if (fullscreen->fshell)
			break;
		fullscreen->fullscreen ^= 1;
		window_set_fullscreen(window, fullscreen->fullscreen);
		break;

	case XKB_KEY_q:
		exit (0);
		break;
	}
}

static int
motion_handler(struct widget *widget,
	       struct input *input,
	       uint32_t time,
	       float x,
	       float y, void *data)
{
	struct fullscreen *fullscreen = data;

	fullscreen->pointer_x = x;
	fullscreen->pointer_y = y;

	widget_schedule_redraw(widget);

	return fullscreen->draw_cursor ? CURSOR_BLANK : CURSOR_LEFT_PTR;
}

static int
enter_handler(struct widget *widget,
	      struct input *input,
	      float x, float y, void *data)
{
	struct fullscreen *fullscreen = data;

	fullscreen->pointer_x = x;
	fullscreen->pointer_y = y;

	widget_schedule_redraw(widget);

	return fullscreen->draw_cursor ? CURSOR_BLANK : CURSOR_LEFT_PTR;
}

static void
button_handler(struct widget *widget,
	       struct input *input, uint32_t time,
	       uint32_t button, enum wl_pointer_button_state state, void *data)
{
	struct fullscreen *fullscreen = data;

	switch (button) {
	case BTN_LEFT:
		if (state == WL_POINTER_BUTTON_STATE_PRESSED)
			window_move(fullscreen->window, input,
				    display_get_serial(fullscreen->display));
		break;
	case BTN_RIGHT:
		if (state == WL_POINTER_BUTTON_STATE_PRESSED)
			window_show_frame_menu(fullscreen->window, input, time);
		break;
	}
}

static void
touch_handler(struct widget *widget, struct input *input,
		   uint32_t serial, uint32_t time, int32_t id,
		   float x, float y, void *data)
{
	struct fullscreen *fullscreen = data;
	window_move(fullscreen->window, input, display_get_serial(fullscreen->display));
}

static void
fshell_capability_handler(void *data, struct zwp_fullscreen_shell_v1 *fshell,
			  uint32_t capability)
{
	struct fullscreen *fullscreen = data;

	switch (capability) {
	case ZWP_FULLSCREEN_SHELL_V1_CAPABILITY_CURSOR_PLANE:
		fullscreen->draw_cursor = 0;
		break;
	default:
		break;
	}
}

struct zwp_fullscreen_shell_v1_listener fullscreen_shell_listener = {
	fshell_capability_handler
};

static void
usage(int error_code)
{
	fprintf(stderr, "Usage: fullscreen [OPTIONS]\n\n"
		"   -w <width>\tSet window width to <width>\n"
		"   -h <height>\tSet window height to <height>\n"
		"   --help\tShow this help text\n\n");

	exit(error_code);
}

static void
output_handler(struct output *output, void *data)
{
	struct fullscreen *fullscreen = data;
	struct fs_output *fsout;

	/* If we've already seen this one, don't add it to the list */
	wl_list_for_each(fsout, &fullscreen->output_list, link)
		if (fsout->output == output)
			return;

	fsout = zalloc(sizeof *fsout);
	if (fsout == NULL) {
		fprintf(stderr, "out of memory in output_handler\n");
		return;
	}
	fsout->output = output;
	wl_list_insert(&fullscreen->output_list, &fsout->link);
}

static void
global_handler(struct display *display, uint32_t id, const char *interface,
	       uint32_t version, void *data)
{
	struct fullscreen *fullscreen = data;

	if (strcmp(interface, "zwp_fullscreen_shell_v1") == 0) {
		fullscreen->fshell = display_bind(display, id,
						  &zwp_fullscreen_shell_v1_interface,
						  1);
		zwp_fullscreen_shell_v1_add_listener(fullscreen->fshell,
						     &fullscreen_shell_listener,
						     fullscreen);
	}
}

int main(int argc, char *argv[])
{
	struct fullscreen fullscreen;
	struct display *d;
	int i;

	fullscreen.width = 640;
	fullscreen.height = 480;
	fullscreen.fullscreen = 0;
	fullscreen.present_method = ZWP_FULLSCREEN_SHELL_V1_PRESENT_METHOD_DEFAULT;
	wl_list_init(&fullscreen.output_list);
	fullscreen.current_output = NULL;

	for (i = 1; i < argc; i++) {
		if (strcmp(argv[i], "-w") == 0) {
			if (++i >= argc)
				usage(EXIT_FAILURE);

			fullscreen.width = atol(argv[i]);
		} else if (strcmp(argv[i], "-h") == 0) {
			if (++i >= argc)
				usage(EXIT_FAILURE);

			fullscreen.height = atol(argv[i]);
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

	fullscreen.display = d;
	fullscreen.fshell = NULL;
	display_set_user_data(fullscreen.display, &fullscreen);
	display_set_global_handler(fullscreen.display, global_handler);
	display_set_output_configure_handler(fullscreen.display, output_handler);

	if (fullscreen.fshell) {
		fullscreen.window = window_create_custom(d);
		zwp_fullscreen_shell_v1_present_surface(fullscreen.fshell,
							window_get_wl_surface(fullscreen.window),
							fullscreen.present_method,
							NULL);
		/* If we get the CURSOR_PLANE capability, we'll change this */
		fullscreen.draw_cursor = 1;
	} else {
		fullscreen.window = window_create(d);
		fullscreen.draw_cursor = 0;
	}

	fullscreen.widget =
		window_add_widget(fullscreen.window, &fullscreen);

	window_set_title(fullscreen.window, "Fullscreen");
	window_set_appid(fullscreen.window, "org.freedesktop.weston.fullscreen");

	widget_set_transparent(fullscreen.widget, 0);

	widget_set_default_cursor(fullscreen.widget, CURSOR_LEFT_PTR);
	widget_set_redraw_handler(fullscreen.widget, redraw_handler);
	widget_set_button_handler(fullscreen.widget, button_handler);
	widget_set_motion_handler(fullscreen.widget, motion_handler);
	widget_set_enter_handler(fullscreen.widget, enter_handler);

	widget_set_touch_down_handler(fullscreen.widget, touch_handler);

	window_set_key_handler(fullscreen.window, key_handler);
	window_set_fullscreen_handler(fullscreen.window, fullscreen_handler);

	window_set_user_data(fullscreen.window, &fullscreen);
	/* Hack to set minimum allocation so we can shrink later */
	window_schedule_resize(fullscreen.window,
			       1, 1);
	window_schedule_resize(fullscreen.window,
			       fullscreen.width, fullscreen.height);

	display_run(d);

	widget_destroy(fullscreen.widget);
	window_destroy(fullscreen.window);
	display_destroy(d);

	return 0;
}

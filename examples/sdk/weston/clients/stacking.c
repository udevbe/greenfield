/*
 * Copyright © 2013 Collabora Ltd.
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

#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <errno.h>

#include <linux/input.h>
#include <cairo.h>
#include <wayland-util.h>

#include "shared/helpers.h"
#include "window.h"

struct stacking {
	struct display *display;
	struct window *root_window;
};

static void
button_handler(struct widget *widget,
               struct input *input, uint32_t time,
               uint32_t button,
               enum wl_pointer_button_state state, void *data);
static void
key_handler(struct window *window,
            struct input *input, uint32_t time,
            uint32_t key, uint32_t sym, enum wl_keyboard_key_state state,
            void *data);
static void
keyboard_focus_handler(struct window *window,
		       struct input *device, void *data);
static void
fullscreen_handler(struct window *window, void *data);
static void
redraw_handler(struct widget *widget, void *data);

/* Iff parent_window is set, the new window will be transient. */
static struct window *
new_window(struct stacking *stacking, struct window *parent_window)
{
	struct window *new_window;
	struct widget *new_widget;

	new_window = window_create(stacking->display);
	window_set_parent(new_window, parent_window);

	new_widget = window_frame_create(new_window, new_window);

	window_set_title(new_window, "Stacking Test");
	window_set_appid(new_window, "org.freedesktop.weston.stacking-test");
	window_set_key_handler(new_window, key_handler);
	window_set_keyboard_focus_handler(new_window, keyboard_focus_handler);
	window_set_fullscreen_handler(new_window, fullscreen_handler);
	widget_set_button_handler(new_widget, button_handler);
	widget_set_redraw_handler(new_widget, redraw_handler);
	window_set_user_data(new_window, stacking);

	window_schedule_resize(new_window, 300, 300);

	return new_window;
}

static void
show_popup_cb(void *data, struct input *input, int index)
{
	/* Ignore the selected menu item. */
}

static void
show_popup(struct stacking *stacking, struct input *input, uint32_t time,
           struct window *window)
{
	int32_t x, y;
	static const char *entries[] = {
		"Test Entry",
		"Another Test Entry",
	};

	input_get_position(input, &x, &y);
	window_show_menu(stacking->display, input, time, window, x, y,
	                 show_popup_cb, entries, ARRAY_LENGTH(entries));
}

static void
button_handler(struct widget *widget,
               struct input *input, uint32_t time,
               uint32_t button,
               enum wl_pointer_button_state state, void *data)
{
	struct stacking *stacking = data;

	switch (button) {
	case BTN_RIGHT:
		if (state == WL_POINTER_BUTTON_STATE_PRESSED)
			show_popup(stacking, input, time,
			           widget_get_user_data(widget));
		break;

	case BTN_LEFT:
	default:
		break;
	}
}

static void
key_handler(struct window *window,
            struct input *input, uint32_t time,
            uint32_t key, uint32_t sym, enum wl_keyboard_key_state state,
            void *data)
{
	struct stacking *stacking = data;

	if (state != WL_KEYBOARD_KEY_STATE_PRESSED)
		return;

	switch (sym) {
	case XKB_KEY_f:
		fullscreen_handler(window, data);
		break;

	case XKB_KEY_m:
		window_set_maximized(window, !window_is_maximized(window));
		break;

	case XKB_KEY_n:
		/* New top-level window. */
		new_window(stacking, NULL);
		break;

	case XKB_KEY_p:
		show_popup(stacking, input, time, window);
		break;

	case XKB_KEY_q:
		exit (0);
		break;

	case XKB_KEY_t:
		/* New transient window. */
		new_window(stacking, window);
		break;

	default:
		break;
	}
}

static void
keyboard_focus_handler(struct window *window,
		       struct input *device, void *data)
{
	window_schedule_redraw(window);
}

static void
fullscreen_handler(struct window *window, void *data)
{
	window_set_fullscreen(window, !window_is_fullscreen(window));
}

static void
draw_string(cairo_t *cr,
            const char *fmt, ...) WL_PRINTF(2, 3);

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

	cairo_font_extents(cr, &font_extents);

	va_start(argp, fmt);

	vsnprintf(buffer, sizeof(buffer), fmt, argp);

	p = buffer;
	while (*p) {
		end = strchr(p, '\n');
		if (end)
			*end = 0;

		cairo_show_text(cr, p);
		cairo_text_extents(cr, p, &text_extents);
		cairo_rel_move_to(cr, -text_extents.x_advance, font_extents.height);

		if (end)
			p = end + 1;
		else
			break;
	}

	va_end(argp);

	cairo_restore(cr);
}

static void
set_window_background_colour(cairo_t *cr, struct window *window)
{
	if (window_get_parent(window))
		cairo_set_source_rgba(cr, 0.0, 1.0, 0.0, 0.4);
	else if (window_is_maximized(window))
		cairo_set_source_rgba(cr, 1.0, 1.0, 0.0, 0.6);
	else if (window_is_fullscreen(window))
		cairo_set_source_rgba(cr, 0.0, 1.0, 1.0, 0.6);
	else
		cairo_set_source_rgba(cr, 0.0, 0.0, 0.0, 1.0);
}

static void
redraw_handler(struct widget *widget, void *data)
{
	struct window *window;
	struct rectangle allocation;
	cairo_t *cr;

	widget_get_allocation(widget, &allocation);
	window = widget_get_user_data(widget);

	cr = widget_cairo_create(widget);
	cairo_translate(cr, allocation.x, allocation.y);

	/* Draw background. */
	cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);
	set_window_background_colour(cr, window);
	cairo_rectangle(cr, 0, 0, allocation.width, allocation.height);
	cairo_fill(cr);

	/* Print the instructions. */
	cairo_move_to(cr, 5, 15);
	cairo_set_source_rgb(cr, 1.0, 1.0, 1.0);

	draw_string(cr,
	            "Window: %p\n"
	            "Fullscreen? %u\n"
	            "Maximized? %u\n"
	            "Transient? %u\n"
	            "Keys: (f)ullscreen, (m)aximize,\n"
	            "      (n)ew window, (p)opup,\n"
	            "      (q)uit, (t)ransient window\n",
	            window, window_is_fullscreen(window),
	            window_is_maximized(window), window_get_parent(window) ? 1 : 0);

	cairo_destroy(cr);
}

int
main(int argc, char *argv[])
{
	struct stacking stacking;

	memset(&stacking, 0, sizeof stacking);

	stacking.display = display_create(&argc, argv);
	if (stacking.display == NULL) {
		fprintf(stderr, "Failed to create display: %s\n",
			strerror(errno));
		return -1;
	}

	display_set_user_data(stacking.display, &stacking);

	stacking.root_window = new_window(&stacking, NULL);

	display_run(stacking.display);

	window_destroy(stacking.root_window);
	display_destroy(stacking.display);

	return 0;
}

/*
 * Copyright © 2011 Tim Wiederhake
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

/**
 * \file eventdemo.c
 * \brief Demonstrate the use of Wayland's toytoolkit.
 *
 * Heavily commented demo program that can report all events that are
 * dispatched to the window. For other functionality, eg. opengl/egl,
 * drag and drop, etc. have a look at the other demos.
 * \author Tim Wiederhake
 */

#include "config.h"

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <errno.h>

#include <cairo.h>

#include "shared/helpers.h"
#include "window.h"

/** window title */
static char *title = "EventDemo";
static char *appid = "org.freedesktop.weston.eventdemo";

/** window width */
static int width = 500;

/** window height */
static int height = 400;

/** set if window has no borders */
static bool noborder = false;

/** if non-zero, maximum window width */
static int width_max = 0;

/** if non-zero, maximum window height */
static int height_max = 0;

/** set to log redrawing */
static bool log_redraw = false;

/** set to log resizing */
static bool log_resize = false;

/** set to log keyboard focus */
static bool log_focus = false;

/** set to log key events */
static bool log_key = false;

/** set to log button events */
static bool log_button = false;

/** set to log axis events */
static bool log_axis = false;

/** set to log motion events */
static bool log_motion = false;

/**
 * \struct eventdemo
 * \brief Holds all data the program needs per window
 *
 * In this demo the struct holds the position of a
 * red rectangle that is drawn in the window's area.
 */
struct eventdemo {
	struct window *window;
	struct widget *widget;
	struct display *display;

	int x, y, w, h;

	bool print_pointer_frame;
};

/**
 * \brief CALLBACK function, Wayland requests the window to redraw.
 * \param widget widget to be redrawn
 * \param data user data associated to the window
 *
 * Draws a red rectangle as demonstration of per-window data.
 */
static void
redraw_handler(struct widget *widget, void *data)
{
	struct eventdemo *e = data;
	cairo_surface_t *surface;
	cairo_t *cr;
	struct rectangle rect;

	if (log_redraw)
		printf("redraw\n");

	widget_get_allocation(e->widget, &rect);
	surface = window_get_surface(e->window);

	cr = cairo_create(surface);
	cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);

	cairo_rectangle(cr, rect.x, rect.y, rect.width, rect.height);
	cairo_set_source_rgba(cr, 0, 0, 0, 0.8);
	cairo_fill(cr);

	cairo_rectangle(cr, e->x, e->y, e->w, e->h);
	cairo_set_source_rgba(cr, 1.0, 0, 0, 1);
	cairo_fill(cr);

	cairo_destroy(cr);
	cairo_surface_destroy(surface);
}

/**
 * \brief CALLBACK function, Wayland requests the window to resize.
 * \param widget widget to be resized
 * \param width desired width
 * \param height desired height
 * \param data user data associated to the window
 */

static void
resize_handler(struct widget *widget,
	       int32_t width, int32_t height, void *data)
{
	struct eventdemo *e = data;
	if (log_resize)
		printf("resize width: %d, height: %d\n", width, height);

	/* if a maximum width is set, constrain to it */
	if (width_max && width_max < width)
		width = width_max;

	/* if a maximum height is set, constrain to it */
	if (height_max && height_max < height)
		height = height_max;

	/* set the new window dimensions */
	widget_set_size(e->widget, width, height);
}

/**
 * \brief CALLBACK function, Wayland informs about keyboard focus change
 * \param window window
 * \param device device that caused the focus change
 * \param data user data associated to the window
 */
static void
keyboard_focus_handler(struct window *window,
		       struct input *device, void *data)
{
	int32_t x, y;
	struct eventdemo *e = data;

	if (log_focus) {
		if (device) {
			input_get_position(device, &x, &y);
			printf("focus x: %d, y: %d\n", x, y);
		} else {
			printf("focus lost\n");
		}
	}

	window_schedule_redraw(e->window);
}

/**
 * \brief CALLBACK function, Wayland informs about key event
 * \param window window
 * \param input input
 * \param time time
 * \param key keycode
 * \param unicode associated character
 * \param state pressed or released
 * \param data user data associated to the window
 */
static void
key_handler(struct window *window, struct input *input, uint32_t time,
            uint32_t key, uint32_t unicode, enum wl_keyboard_key_state state,
	    void *data)
{
	uint32_t modifiers = input_get_modifiers(input);

	if (!log_key)
		return;

	printf("key key: %u, unicode: %u, state: %s, modifiers: 0x%x\n",
	       key, unicode,
	       (state == WL_KEYBOARD_KEY_STATE_PRESSED) ? "pressed" :
							  "released",
	       modifiers);
}

/**
 * \brief CALLBACK function, Wayland informs about button event
 * \param widget widget
 * \param input input device that caused the button event
 * \param time time the event happened
 * \param button button
 * \param state pressed or released
 * \param data user data associated to the window
 */
static void
button_handler(struct widget *widget, struct input *input, uint32_t time,
	       uint32_t button, enum wl_pointer_button_state state, void *data)
{
	struct eventdemo *e = data;
	int32_t x, y;

	if (!log_button)
		return;

	e->print_pointer_frame = true;

	input_get_position(input, &x, &y);
	printf("button time: %u, button: %u, state: %s, x: %d, y: %d\n",
	       time, button,
	       (state == WL_POINTER_BUTTON_STATE_PRESSED) ? "pressed" :
							    "released",
	       x, y);
}

/**
 * \brief CALLBACK function, Wayland informs about axis event
 * \param widget widget
 * \param input input device that caused the axis event
 * \param time time the event happened
 * \param axis vertical or horizontal
 * \param value amount of scrolling
 * \param data user data associated to the widget
 */
static void
axis_handler(struct widget *widget, struct input *input, uint32_t time,
	     uint32_t axis, wl_fixed_t value, void *data)
{
	struct eventdemo *e = data;

	if (!log_axis)
		return;

	e->print_pointer_frame = true;

	printf("axis time: %u, axis: %s, value: %f\n",
	       time,
	       axis == WL_POINTER_AXIS_VERTICAL_SCROLL ? "vertical" :
							 "horizontal",
	       wl_fixed_to_double(value));
}

static void
pointer_frame_handler(struct widget *widget, struct input *input, void *data)
{
	struct eventdemo *e = data;

	if (!e->print_pointer_frame)
		return;

	printf("pointer frame\n");
	e->print_pointer_frame = false;
}

static void
axis_source_handler(struct widget *widget, struct input *input,
		    uint32_t source, void *data)
{
	const char *axis_source;
	struct eventdemo *e = data;

	if (!log_axis)
		return;

	e->print_pointer_frame = true;

	switch (source) {
	case WL_POINTER_AXIS_SOURCE_WHEEL:
		axis_source = "wheel";
		break;
	case WL_POINTER_AXIS_SOURCE_FINGER:
		axis_source = "finger";
		break;
	case WL_POINTER_AXIS_SOURCE_CONTINUOUS:
		axis_source = "continuous";
		break;
	default:
		axis_source = "<invalid source value>";
		break;
	}

	printf("axis source: %s\n", axis_source);
}

static void
axis_stop_handler(struct widget *widget, struct input *input,
		  uint32_t time, uint32_t axis,
		  void *data)
{
	struct eventdemo *e = data;

	if (!log_axis)
		return;

	e->print_pointer_frame = true;
	printf("axis stop time: %u, axis: %s\n",
	       time,
	       axis == WL_POINTER_AXIS_VERTICAL_SCROLL ? "vertical" :
							 "horizontal");
}

static void
axis_discrete_handler(struct widget *widget, struct input *input,
		      uint32_t axis, int32_t discrete, void *data)
{
	struct eventdemo *e = data;

	if (!log_axis)
		return;

	e->print_pointer_frame = true;
	printf("axis discrete axis: %u value: %d\n", axis, discrete);
}

/**
 * \brief CALLBACK function, Waylands informs about pointer motion
 * \param widget widget
 * \param input input device that caused the motion event
 * \param time time the event happened
 * \param x x position relative to the window
 * \param y y position relative to the window
 * \param data user data associated to the window
 *
 * Demonstrates the use of different cursors
 */
static int
motion_handler(struct widget *widget, struct input *input, uint32_t time,
	       float x, float y, void *data)
{
	struct eventdemo *e = data;

	if (log_motion) {
		printf("motion time: %u, x: %f, y: %f\n", time, x, y);
		e->print_pointer_frame = true;
	}

	if (x > e->x && x < e->x + e->w)
		if (y > e->y && y < e->y + e->h)
			return CURSOR_HAND1;

	return CURSOR_LEFT_PTR;
}

/**
 * \brief Create and initialise a new eventdemo window.
 * The returned eventdemo instance should be destroyed using \c eventdemo_destroy().
 * \param d associated display
 */
static struct eventdemo *
eventdemo_create(struct display *d)
{
	struct eventdemo *e;

	e = zalloc(sizeof (struct eventdemo));
	if (e == NULL)
		return NULL;

	e->window = window_create(d);

	if (noborder) {
		/* Demonstrate how to create a borderless window.
		 * Move windows with META + left mouse button.
		 */
		e->widget = window_add_widget(e->window, e);
	} else {
		e->widget = window_frame_create(e->window, e);
		window_set_title(e->window, title);
		window_set_appid(e->window, appid);
	}
	e->display = d;

	/* The eventdemo window draws a red rectangle as a demonstration
	 * of per-window data. The dimensions of that rectangle are set
	 * here.
	 */
	e->x = width * 1.0 / 4.0;
	e->w = width * 2.0 / 4.0;
	e->y = height * 1.0 / 4.0;
	e->h = height * 2.0 / 4.0;

	/* Connect the user data to the window */
	window_set_user_data(e->window, e);

	/* Set the callback redraw handler for the window */
	widget_set_redraw_handler(e->widget, redraw_handler);

	/* Set the callback resize handler for the window */
	widget_set_resize_handler(e->widget, resize_handler);

	/* Set the callback focus handler for the window */
	window_set_keyboard_focus_handler(e->window,
					  keyboard_focus_handler);

	/* Set the callback key handler for the window */
	window_set_key_handler(e->window, key_handler);

	/* Set the callback button handler for the window */
	widget_set_button_handler(e->widget, button_handler);

	/* Set the callback motion handler for the window */
	widget_set_motion_handler(e->widget, motion_handler);

	/* Set the callback pointer frame handler for the window */
	widget_set_pointer_frame_handler(e->widget, pointer_frame_handler);

	/* Set the callback axis handler for the window */
	widget_set_axis_handlers(e->widget,
				 axis_handler,
				 axis_source_handler,
				 axis_stop_handler,
				 axis_discrete_handler);

	/* Initial drawing of the window */
	window_schedule_resize(e->window, width, height);

	return e;
}
/**
 * \brief Destroy eventdemo instance previously created by \c eventdemo_create().
 * \param eventdemo eventdemo instance to destroy
 */
static void eventdemo_destroy(struct eventdemo * eventdemo)
{
	widget_destroy(eventdemo->widget);
	window_destroy(eventdemo->window);
	free(eventdemo);
}
/**
 * \brief command line options for eventdemo
 */
static const struct weston_option eventdemo_options[] = {
	{ WESTON_OPTION_STRING, "title", 0, &title },
	{ WESTON_OPTION_INTEGER, "width", 'w', &width },
	{ WESTON_OPTION_INTEGER, "height", 'h', &height },
	{ WESTON_OPTION_INTEGER, "max-width", 0, &width_max },
	{ WESTON_OPTION_INTEGER, "max-height", 0, &height_max },
	{ WESTON_OPTION_BOOLEAN, "no-border", 'b', &noborder },
	{ WESTON_OPTION_BOOLEAN, "log-redraw", 0, &log_redraw },
	{ WESTON_OPTION_BOOLEAN, "log-resize", 0, &log_resize },
	{ WESTON_OPTION_BOOLEAN, "log-focus", 0, &log_focus },
	{ WESTON_OPTION_BOOLEAN, "log-key", 0, &log_key },
	{ WESTON_OPTION_BOOLEAN, "log-button", 0, &log_button },
	{ WESTON_OPTION_BOOLEAN, "log-axis", 0, &log_axis },
	{ WESTON_OPTION_BOOLEAN, "log-motion", 0, &log_motion },
};

/**
 * \brief Connects to the display, creates the window and hands over
 * to the main loop.
 */
int
main(int argc, char *argv[])
{
	struct display *d;
	struct eventdemo *e;

	if (parse_options(eventdemo_options,
			  ARRAY_LENGTH(eventdemo_options), &argc, argv) > 1) {
		unsigned k;
		printf("Usage: %s [OPTIONS]\n\n", argv[0]);
		for (k = 0; k < ARRAY_LENGTH(eventdemo_options); k++) {
			const struct weston_option* p = &eventdemo_options[k];
			if (p->name) {
				printf("  --%s", p->name);
				if (p->type != WESTON_OPTION_BOOLEAN)
					printf("=VALUE");
				putchar('\n');
			}
			if (p->short_name) {
				printf("  -%c", p->short_name);
				if (p->type != WESTON_OPTION_BOOLEAN)
					printf("VALUE");
				putchar('\n');
			}
		}
		return 1;
	}

	if (!log_redraw && !log_resize && !log_focus && !log_key &&
	    !log_button && !log_axis && !log_motion)
	  log_redraw = log_resize = log_focus = log_key =
	    log_button = log_axis = log_motion = true;

	/* Connect to the display and have the arguments parsed */
	d = display_create(&argc, argv);
	if (d == NULL) {
		fprintf(stderr, "failed to create display: %s\n",
			strerror(errno));
		return -1;
	}

	/* Create new eventdemo window */
	e = eventdemo_create(d);
	if (e == NULL) {
		fprintf(stderr, "failed to create eventdemo: %s\n",
			strerror(errno));
		return -1;
	}

	display_run(d);

	/* Release resources */
	eventdemo_destroy(e);
	display_destroy(d);

	return 0;
}

/*
 * Copyright © 2010 Kristian Høgsberg
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
#include <fcntl.h>
#include <unistd.h>
#include <math.h>
#include <sys/time.h>
#include <cairo.h>
#include <sys/epoll.h>
#include <stdbool.h>
#include <errno.h>

#include <wayland-client.h>
#include <wayland-cursor.h>

#include "window.h"
#include "shared/cairo-util.h"
#include "shared/helpers.h"
#include "shared/xalloc.h"

struct dnd_drag;

struct pointer {
	struct input *input;
	bool dragging;
	struct wl_list link;
};

struct dnd {
	struct window *window;
	struct widget *widget;
	struct display *display;
	uint32_t key;
	struct item *items[16];
	int self_only;
	struct dnd_drag *current_drag;
	struct wl_list pointers;
};

struct dnd_drag {
	cairo_surface_t *translucent;
	cairo_surface_t *opaque;
	int hotspot_x, hotspot_y;
	struct dnd *dnd;
	struct input *input;
	uint32_t time;
	struct item *item;
	int x_offset, y_offset;
	int width, height;
	uint32_t dnd_action;
	const char *mime_type;

	struct wl_surface *drag_surface;
	struct wl_data_source *data_source;
};

struct item {
	cairo_surface_t *surface;
	int seed;
	int x, y;
};

struct dnd_flower_message {
	int seed, x_offset, y_offset;
};


static const int item_width = 64;
static const int item_height = 64;
static const int item_padding = 16;

static const char flower_mime_type[] = "application/x-wayland-dnd-flower";
static const char text_mime_type[] = "text/plain;charset=utf-8";

static struct item *
item_create(struct display *display, int x, int y, int seed)
{
	struct item *item;
	struct timeval tv;

	item = malloc(sizeof *item);
	if (item == NULL)
		return NULL;


	gettimeofday(&tv, NULL);
	item->seed = seed ? seed : tv.tv_usec;
	srandom(item->seed);

	const int petal_count = 3 + random() % 5;
	const double r1 = 20 + random() % 10;
	const double r2 = 5 + random() % 12;
	const double u = (10 + random() % 90) / 100.0;
	const double v = (random() % 90) / 100.0;

	cairo_t *cr;
	int i;
	double t, dt = 2 * M_PI / (petal_count * 2);
	double x1, y1, x2, y2, x3, y3;
	struct rectangle rect;


	rect.width = item_width;
	rect.height = item_height;
	item->surface =
		display_create_surface(display, NULL, &rect, SURFACE_SHM);

	item->x = x;
	item->y = y;

	cr = cairo_create(item->surface);
	cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);
	cairo_set_source_rgba(cr, 0, 0, 0, 0);
	cairo_paint(cr);

	cairo_set_operator(cr, CAIRO_OPERATOR_OVER);
	cairo_translate(cr, item_width / 2, item_height / 2);
	t = random();
	cairo_move_to(cr, cos(t) * r1, sin(t) * r1);
	for (i = 0; i < petal_count; i++, t += dt * 2) {
		x1 = cos(t) * r1;
		y1 = sin(t) * r1;
		x2 = cos(t + dt) * r2;
		y2 = sin(t + dt) * r2;
		x3 = cos(t + 2 * dt) * r1;
		y3 = sin(t + 2 * dt) * r1;

		cairo_curve_to(cr,
			       x1 - y1 * u, y1 + x1 * u,
			       x2 + y2 * v, y2 - x2 * v,
			       x2, y2);

		cairo_curve_to(cr,
			       x2 - y2 * v, y2 + x2 * v,
			       x3 + y3 * u, y3 - x3 * u,
			       x3, y3);
	}

	cairo_close_path(cr);

	cairo_set_source_rgba(cr,
			      0.5 + (random() % 50) / 49.0,
			      0.5 + (random() % 50) / 49.0,
			      0.5 + (random() % 50) / 49.0,
			      0.5 + (random() % 100) / 99.0);

	cairo_fill_preserve(cr);

	cairo_set_line_width(cr, 1);
	cairo_set_source_rgba(cr,
			      0.5 + (random() % 50) / 49.0,
			      0.5 + (random() % 50) / 49.0,
			      0.5 + (random() % 50) / 49.0,
			      0.5 + (random() % 100) / 99.0);
	cairo_stroke(cr);

	cairo_destroy(cr);

	return item;
}

static void
dnd_redraw_handler(struct widget *widget, void *data)
{
	struct dnd *dnd = data;
	struct rectangle allocation;
	cairo_t *cr;
	cairo_surface_t *surface, *item_surface;
	unsigned int i;

	surface = window_get_surface(dnd->window);
	cr = cairo_create(surface);
	widget_get_allocation(dnd->widget, &allocation);
	cairo_rectangle(cr, allocation.x, allocation.y,
			allocation.width, allocation.height);

	cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);
	cairo_set_source_rgba(cr, 0, 0, 0, 0.8);
	cairo_fill(cr);

	cairo_rectangle(cr, allocation.x, allocation.y,
			allocation.width, allocation.height);
	cairo_clip(cr);
	cairo_set_operator(cr, CAIRO_OPERATOR_OVER);
	for (i = 0; i < ARRAY_LENGTH(dnd->items); i++) {
		if (!dnd->items[i])
			continue;

		if (dnd->current_drag && dnd->items[i] == dnd->current_drag->item)
			item_surface = dnd->current_drag->translucent;
		else
			item_surface = dnd->items[i]->surface;

		cairo_set_source_surface(cr, item_surface,
					 dnd->items[i]->x + allocation.x,
					 dnd->items[i]->y + allocation.y);
		cairo_paint(cr);
	}

	cairo_destroy(cr);
	cairo_surface_destroy(surface);
}

static void
keyboard_focus_handler(struct window *window,
		       struct input *device, void *data)
{
	struct dnd *dnd = data;

	window_schedule_redraw(dnd->window);
}

static int
dnd_add_item(struct dnd *dnd, struct item *item)
{
	unsigned int i;

	for (i = 0; i < ARRAY_LENGTH(dnd->items); i++) {
		if (dnd->items[i] == 0) {
			dnd->items[i] = item;
			return i;
		}
	}
	return -1;
}

static struct item *
dnd_get_item(struct dnd *dnd, int32_t x, int32_t y)
{
	struct item *item;
	struct rectangle allocation;
	unsigned int i;

	widget_get_allocation(dnd->widget, &allocation);

	x -= allocation.x;
	y -= allocation.y;

	for (i = 0; i < ARRAY_LENGTH(dnd->items); i++) {
		item = dnd->items[i];
		if (item &&
		    item->x <= x && x < item->x + item_width &&
		    item->y <= y && y < item->y + item_height)
			return item;
	}

	return NULL;
}

static int
lookup_dnd_cursor(uint32_t dnd_action)
{
	if (dnd_action == WL_DATA_DEVICE_MANAGER_DND_ACTION_MOVE)
		return CURSOR_DND_MOVE;
	else if (dnd_action == WL_DATA_DEVICE_MANAGER_DND_ACTION_COPY)
		return CURSOR_DND_COPY;

	return CURSOR_DND_FORBIDDEN;
}

static void
dnd_drag_update_cursor(struct dnd_drag *dnd_drag)
{
	int cursor;

	if (dnd_drag->mime_type == NULL)
		cursor = CURSOR_DND_FORBIDDEN;
	else
		cursor = lookup_dnd_cursor(dnd_drag->dnd_action);

	input_set_pointer_image(dnd_drag->input, cursor);
}

static void
dnd_drag_update_surface(struct dnd_drag *dnd_drag)
{
	struct dnd *dnd = dnd_drag->dnd;
	cairo_surface_t *surface;
	struct wl_buffer *buffer;

	if (dnd_drag->mime_type && dnd_drag->dnd_action)
		surface = dnd_drag->opaque;
	else
		surface = dnd_drag->translucent;

	buffer = display_get_buffer_for_surface(dnd->display, surface);
	wl_surface_attach(dnd_drag->drag_surface, buffer, 0, 0);
	wl_surface_damage(dnd_drag->drag_surface, 0, 0,
			  dnd_drag->width, dnd_drag->height);
	wl_surface_commit(dnd_drag->drag_surface);
}

static void
data_source_target(void *data,
		   struct wl_data_source *source, const char *mime_type)
{
	struct dnd_drag *dnd_drag = data;

	dnd_drag->mime_type = mime_type;
	dnd_drag_update_surface(dnd_drag);
	dnd_drag_update_cursor(dnd_drag);
}

static void
data_source_send(void *data, struct wl_data_source *source,
		 const char *mime_type, int32_t fd)
{
	struct dnd_flower_message dnd_flower_message;
	struct dnd_drag *dnd_drag = data;
	char buffer[128];
	int n;

	if (strcmp(mime_type, flower_mime_type) == 0) {
		dnd_flower_message.seed = dnd_drag->item->seed;
		dnd_flower_message.x_offset = dnd_drag->x_offset;
		dnd_flower_message.y_offset = dnd_drag->y_offset;

		if (write(fd, &dnd_flower_message,
			  sizeof dnd_flower_message) < 0)
			abort();
	} else if (strcmp(mime_type, text_mime_type) == 0) {
		n = snprintf(buffer, sizeof buffer, "seed=%d x=%d y=%d\n",
			     dnd_drag->item->seed,
			     dnd_drag->x_offset,
			     dnd_drag->y_offset);

		if (write(fd, buffer, n) < 0)
			abort();
	}

	close(fd);
}

static void
dnd_drag_destroy(struct dnd_drag *dnd_drag, bool delete_item)
{
	struct dnd *dnd = dnd_drag->dnd;
	unsigned int i;

	wl_data_source_destroy(dnd_drag->data_source);

	if (delete_item) {
		for (i = 0; i < ARRAY_LENGTH(dnd->items); i++) {
			if (dnd_drag->item == dnd->items[i]) {
				dnd->items[i] = NULL;
				break;
			}
		}

		/* Destroy the item that has been dragged out */
		cairo_surface_destroy(dnd_drag->item->surface);
		free(dnd_drag->item);
	}

	dnd->current_drag = NULL;

	wl_surface_destroy(dnd_drag->drag_surface);

	cairo_surface_destroy(dnd_drag->translucent);
	cairo_surface_destroy(dnd_drag->opaque);
	free(dnd_drag);
}

static void
data_source_cancelled(void *data, struct wl_data_source *source)
{
	struct dnd_drag *dnd_drag = data;
	struct dnd *dnd = dnd_drag->dnd;

	/* The 'cancelled' event means that the source is no longer in
	 * use by the drag (or current selection).  We need to clean
	 * up the drag object created and the local state. */
	dnd_drag_destroy(dnd_drag, false);
	window_schedule_redraw(dnd->window);
}

static void
data_source_dnd_drop_performed(void *data, struct wl_data_source *source)
{
}

static void
data_source_dnd_finished(void *data, struct wl_data_source *source)
{
	struct dnd_drag *dnd_drag = data;
	struct dnd *dnd = dnd_drag->dnd;
	bool delete_item;

	delete_item =
		dnd_drag->dnd_action == WL_DATA_DEVICE_MANAGER_DND_ACTION_MOVE;

	/* The operation is already finished, we can destroy all
	 * related data.
	 */
	dnd_drag_destroy(dnd_drag, delete_item);
	window_schedule_redraw(dnd->window);
}

static void
data_source_action(void *data, struct wl_data_source *source, uint32_t dnd_action)
{
	struct dnd_drag *dnd_drag = data;

	dnd_drag->dnd_action = dnd_action;
	dnd_drag_update_surface(dnd_drag);
	dnd_drag_update_cursor(dnd_drag);
}

static const struct wl_data_source_listener data_source_listener = {
	data_source_target,
	data_source_send,
	data_source_cancelled,
	data_source_dnd_drop_performed,
	data_source_dnd_finished,
	data_source_action,
};

static cairo_surface_t *
create_drag_icon(struct dnd_drag *dnd_drag,
		 struct item *item, int32_t x, int32_t y, double opacity)
{
	struct dnd *dnd = dnd_drag->dnd;
	cairo_surface_t *surface;
	struct rectangle rectangle;
	cairo_pattern_t *pattern;
	cairo_t *cr;

	rectangle.width = item_width;
	rectangle.height = item_height;
	surface = display_create_surface(dnd->display, NULL, &rectangle,
					 SURFACE_SHM);

	cr = cairo_create(surface);
	cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);
	cairo_set_source_surface(cr, item->surface, 0, 0);
	pattern = cairo_pattern_create_rgba(0, 0, 0, opacity);
	cairo_mask(cr, pattern);
	cairo_pattern_destroy(pattern);

	cairo_destroy(cr);

	dnd_drag->hotspot_x = x - item->x;
	dnd_drag->hotspot_y = y - item->y;
	dnd_drag->width = rectangle.width;
	dnd_drag->height = rectangle.height;

	return surface;
}

static int
create_drag_source(struct dnd *dnd,
		struct input *input, uint32_t time,
		int32_t x, int32_t y)
{
	struct item *item;
	struct rectangle allocation;
	struct dnd_drag *dnd_drag;
	struct display *display;
	struct wl_compositor *compositor;
	struct wl_buffer *buffer;
	unsigned int i;
	uint32_t serial;
	cairo_surface_t *icon;
	uint32_t actions;

	widget_get_allocation(dnd->widget, &allocation);
	item = dnd_get_item(dnd, x, y);
	x -= allocation.x;
	y -= allocation.y;

	if (item) {
		dnd_drag = xmalloc(sizeof *dnd_drag);
		dnd_drag->dnd = dnd;
		dnd_drag->input = input;
		dnd_drag->time = time;
		dnd_drag->item = item;
		dnd_drag->x_offset = x - item->x;
		dnd_drag->y_offset = y - item->y;
		dnd_drag->dnd_action = WL_DATA_DEVICE_MANAGER_DND_ACTION_MOVE;
		dnd_drag->mime_type = NULL;

		actions = WL_DATA_DEVICE_MANAGER_DND_ACTION_MOVE |
			WL_DATA_DEVICE_MANAGER_DND_ACTION_COPY;

		display = window_get_display(dnd->window);
		compositor = display_get_compositor(display);
		serial = display_get_serial(display);
		dnd_drag->drag_surface =
			wl_compositor_create_surface(compositor);

		if (display_get_data_device_manager_version(display) <
		    WL_DATA_SOURCE_SET_ACTIONS_SINCE_VERSION) {
			/* Data sources version < 3 will not get action
			 * nor dnd_finished events, as we can't honor
			 * the "move" action at the time of finishing
			 * drag-and-drop, do it preemptively here.
			 */
			for (i = 0; i < ARRAY_LENGTH(dnd->items); i++) {
				if (item == dnd->items[i]){
					dnd->items[i] = NULL;
					break;
				}
			}
		}

		if (dnd->self_only) {
			dnd_drag->data_source = NULL;
		} else {
			dnd_drag->data_source =
				display_create_data_source(dnd->display);
			if (!dnd_drag->data_source) {
				fprintf(stderr, "No data device manager\n");
				abort();
			}
			wl_data_source_add_listener(dnd_drag->data_source,
						    &data_source_listener,
						    dnd_drag);
			wl_data_source_offer(dnd_drag->data_source,
					     flower_mime_type);
			wl_data_source_offer(dnd_drag->data_source,
					     text_mime_type);
		}

		if (display_get_data_device_manager_version(display) >=
		    WL_DATA_SOURCE_SET_ACTIONS_SINCE_VERSION) {
			wl_data_source_set_actions(dnd_drag->data_source, actions);
		}

		wl_data_device_start_drag(input_get_data_device(input),
					  dnd_drag->data_source,
					  window_get_wl_surface(dnd->window),
					  dnd_drag->drag_surface,
					  serial);

		dnd_drag->opaque =
			create_drag_icon(dnd_drag, item, x, y, 1);
		dnd_drag->translucent =
			create_drag_icon(dnd_drag, item, x, y, 0.2);

		if (dnd->self_only)
			icon = dnd_drag->opaque;
		else
			icon = dnd_drag->translucent;

		buffer = display_get_buffer_for_surface(dnd->display, icon);
		wl_surface_attach(dnd_drag->drag_surface, buffer,
				  -dnd_drag->hotspot_x, -dnd_drag->hotspot_y);
		wl_surface_damage(dnd_drag->drag_surface, 0, 0,
				  dnd_drag->width, dnd_drag->height);
		wl_surface_commit(dnd_drag->drag_surface);

		dnd->current_drag = dnd_drag;
		window_schedule_redraw(dnd->window);

		return 0;
	} else
		return -1;
}

static int
lookup_cursor(struct dnd *dnd, int x, int y)
{
	struct item *item;

	item = dnd_get_item(dnd, x, y);
	if (item)
		return CURSOR_HAND1;
	else
		return CURSOR_LEFT_PTR;
}

/* Update all the mouse pointers in the window appropriately.
 * Optionally, skip one (which will be the current pointer just
 * about to start a drag).  This is done here to save a scan
 * through the pointer list.
 */
static void
update_pointer_images_except(struct dnd *dnd, struct input *except)
{
	struct pointer *pointer;
	int32_t x, y;

	wl_list_for_each(pointer, &dnd->pointers, link) {
		if (pointer->input == except) {
			pointer->dragging = true;
			continue;
		}
		input_get_position(pointer->input, &x, &y);
		input_set_pointer_image(pointer->input,
					lookup_cursor(dnd, x, y));
	}
}

static void
dnd_button_handler(struct widget *widget,
		   struct input *input, uint32_t time,
		   uint32_t button, enum wl_pointer_button_state state,
		   void *data)
{
	struct dnd *dnd = data;
	int32_t x, y;

	input_get_position(input, &x, &y);
	if (state == WL_POINTER_BUTTON_STATE_PRESSED) {
		input_ungrab(input);
		if (create_drag_source(dnd, input, time, x, y) == 0) {
			input_set_pointer_image(input, CURSOR_DRAGGING);
			update_pointer_images_except(dnd, input);
		}
	}
}

static void
dnd_touch_down_handler(struct widget *widget,
		struct input *input, uint32_t serial,
		uint32_t time, int32_t id,
		float x, float y, void *data)
{
	struct dnd *dnd = data;
	int32_t int_x, int_y;

	if (id > 0)
		return;

	int_x = (int32_t)x;
	int_y = (int32_t)y;
	if (create_drag_source(dnd, input, time, int_x, int_y) == 0)
		touch_grab(input, 0);
}

static int
dnd_enter_handler(struct widget *widget,
		  struct input *input, float x, float y, void *data)
{
	struct dnd *dnd = data;
	struct pointer *new_pointer = malloc(sizeof *new_pointer);

	if (new_pointer) {
		new_pointer->input = input;
		new_pointer->dragging = false;
		wl_list_insert(dnd->pointers.prev, &new_pointer->link);
	}

	return lookup_cursor(dnd, x, y);
}

static void
dnd_leave_handler(struct widget *widget,
		  struct input *input, void *data)
{
	struct dnd *dnd = data;
	struct pointer *pointer, *tmp;

	wl_list_for_each_safe(pointer, tmp, &dnd->pointers, link)
		if (pointer->input == input) {
			wl_list_remove(&pointer->link);
			free(pointer);
		}
}

static int
dnd_motion_handler(struct widget *widget,
		   struct input *input, uint32_t time,
		   float x, float y, void *data)
{
	struct dnd *dnd = data;
	struct pointer *pointer;

	wl_list_for_each(pointer, &dnd->pointers, link)
		if (pointer->input == input) {
			if (pointer->dragging)
				return CURSOR_DRAGGING;
			break;
		}

	return lookup_cursor(data, x, y);
}

static void
dnd_data_handler(struct window *window,
		 struct input *input,
		 float x, float y, const char **types, void *data)
{
	struct dnd *dnd = data;
	int i, has_flower = 0;

	if (!types)
		return;
	for (i = 0; types[i]; i++)
		if (strcmp(types[i], flower_mime_type) == 0)
			has_flower = 1;

	if (dnd_get_item(dnd, x, y) || dnd->self_only || !has_flower) {
		input_accept(input, NULL);
	} else {
		input_accept(input, flower_mime_type);
	}
}

static void
dnd_receive_func(void *data, size_t len, int32_t x, int32_t y, void *user_data)
{
	struct dnd *dnd = user_data;
	struct dnd_flower_message *message = data;
	struct item *item;
	struct rectangle allocation;

	if (len == 0) {
		return;
	} else if (len != sizeof *message) {
		fprintf(stderr, "odd message length %zu, expected %zu\n",
			len, sizeof *message);
		return;
	}

	widget_get_allocation(dnd->widget, &allocation);
	item = item_create(dnd->display,
			   x - message->x_offset - allocation.x,
			   y - message->y_offset - allocation.y,
			   message->seed);

	dnd_add_item(dnd, item);
	update_pointer_images_except(dnd, NULL);
	window_schedule_redraw(dnd->window);
}

static void
dnd_drop_handler(struct window *window, struct input *input,
		 int32_t x, int32_t y, void *data)
{
	struct dnd *dnd = data;
	struct dnd_flower_message message;

	if (dnd_get_item(dnd, x, y)) {
		fprintf(stderr, "got 'drop', but no target\n");
		return;
	}

	if (!dnd->self_only) {
		input_receive_drag_data(input,
					flower_mime_type,
					dnd_receive_func, dnd);
	} else if (dnd->current_drag) {
		message.seed = dnd->current_drag->item->seed;
		message.x_offset = dnd->current_drag->x_offset;
		message.y_offset = dnd->current_drag->y_offset;
		dnd_receive_func(&message, sizeof message, x, y, dnd);
	} else {
		fprintf(stderr, "ignoring drop from another client\n");
	}
}

static struct dnd *
dnd_create(struct display *display)
{
	struct dnd *dnd;
	int x, y;
	int32_t width, height;
	unsigned int i;

	dnd = xzalloc(sizeof *dnd);
	dnd->window = window_create(display);
	dnd->widget = window_frame_create(dnd->window, dnd);
	window_set_title(dnd->window, "Wayland Drag and Drop Demo");
	window_set_appid(dnd->window,
			 "org.freedesktop.weston.wayland-drag-and-drop-demo");

	dnd->display = display;
	dnd->key = 100;

	wl_list_init(&dnd->pointers);

	for (i = 0; i < ARRAY_LENGTH(dnd->items); i++) {
		x = (i % 4) * (item_width + item_padding) + item_padding;
		y = (i / 4) * (item_height + item_padding) + item_padding;
		if ((i ^ (i >> 2)) & 1)
			dnd->items[i] = item_create(display, x, y, 0);
		else
			dnd->items[i] = NULL;
	}

	window_set_user_data(dnd->window, dnd);
	window_set_keyboard_focus_handler(dnd->window,
					  keyboard_focus_handler);
	window_set_data_handler(dnd->window, dnd_data_handler);
	window_set_drop_handler(dnd->window, dnd_drop_handler);

	widget_set_redraw_handler(dnd->widget, dnd_redraw_handler);
	widget_set_enter_handler(dnd->widget, dnd_enter_handler);
	widget_set_leave_handler(dnd->widget, dnd_leave_handler);
	widget_set_motion_handler(dnd->widget, dnd_motion_handler);
	widget_set_button_handler(dnd->widget, dnd_button_handler);
	widget_set_touch_down_handler(dnd->widget, dnd_touch_down_handler);

	width = 4 * (item_width + item_padding) + item_padding;
	height = 4 * (item_height + item_padding) + item_padding;

	window_frame_set_child_size(dnd->widget, width, height);

	return dnd;
}

static void
dnd_destroy(struct dnd *dnd)
{
	widget_destroy(dnd->widget);
	window_destroy(dnd->window);
	free(dnd);
}

int
main(int argc, char *argv[])
{
	struct display *d;
	struct dnd *dnd;
	int self_only = 0;

	if (argc == 2 && !strcmp(argv[1], "--self-only"))
		self_only = 1;
	else if (argc > 1) {
		printf("Usage: %s [OPTIONS]\n  --self-only\n", argv[0]);
		return 1;
	}

	d = display_create(&argc, argv);
	if (d == NULL) {
		fprintf(stderr, "failed to create display: %s\n",
			strerror(errno));
		return -1;
	}

	dnd = dnd_create(d);
	if (self_only)
		dnd->self_only = 1;

	display_run(d);

	dnd_destroy(dnd);
	display_destroy(d);

	return 0;
}

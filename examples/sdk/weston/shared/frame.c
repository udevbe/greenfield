/*
 * Copyright © 2008 Kristian Høgsberg
 * Copyright © 2012-2013 Collabora, Ltd.
 * Copyright © 2013 Jason Ekstrand
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

#include "config.h"

#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <wayland-util.h>
#include <linux/input.h>

#include "cairo-util.h"
#include "shared/file-util.h"

enum frame_button_flags {
	FRAME_BUTTON_ALIGN_RIGHT = 0x1,
	FRAME_BUTTON_DECORATED = 0x2,
	FRAME_BUTTON_CLICK_DOWN = 0x4,
};

struct frame_button {
	struct frame *frame;
	struct wl_list link;	/* buttons_list */

	cairo_surface_t *icon;
	enum frame_button_flags flags;
	int hover_count;
	int press_count;

	struct {
		int x, y;
		int width, height;
	} allocation;

	enum frame_status status_effect;
};

struct frame_pointer_button {
	struct wl_list link;
	uint32_t button;
	enum theme_location press_location;
	struct frame_button *frame_button;
};

struct frame_pointer {
	struct wl_list link;
	void *data;

	int x, y;

	struct frame_button *hover_button;
	struct wl_list down_buttons;
};

struct frame_touch {
	struct wl_list link;
	void *data;

	int x, y;

	struct frame_button *button;
};

struct frame {
	int32_t width, height;
	char *title;
	uint32_t flags;
	struct theme *theme;

	struct {
		int32_t x, y;
		int32_t width, height;
	} interior;
	int shadow_margin;
	int opaque_margin;
	int geometry_dirty;

	cairo_rectangle_int_t title_rect;

	uint32_t status;

	struct wl_list buttons;
	struct wl_list pointers;
	struct wl_list touches;
};

static struct frame_button *
frame_button_create_from_surface(struct frame *frame, cairo_surface_t *icon,
                                 enum frame_status status_effect,
                                 enum frame_button_flags flags)
{
	struct frame_button *button;

	button = calloc(1, sizeof *button);
	if (!button)
		return NULL;

	button->icon = icon;
	button->frame = frame;
	button->flags = flags;
	button->status_effect = status_effect;

	wl_list_insert(frame->buttons.prev, &button->link);

	return button;
}

static struct frame_button *
frame_button_create(struct frame *frame, const char *icon_name,
                    enum frame_status status_effect,
                    enum frame_button_flags flags)
{
	struct frame_button *button;
	cairo_surface_t *icon;

	icon = cairo_image_surface_create_from_png(icon_name);
	if (cairo_surface_status(icon) != CAIRO_STATUS_SUCCESS)
		goto error;

	button = frame_button_create_from_surface(frame, icon, status_effect,
	                                          flags);
	if (!button)
		goto error;

	return button;

error:
	cairo_surface_destroy(icon);
	return NULL;
}

static void
frame_button_destroy(struct frame_button *button)
{
	cairo_surface_destroy(button->icon);
	free(button);
}

static void
frame_button_enter(struct frame_button *button)
{
	if (!button->hover_count)
		button->frame->status |= FRAME_STATUS_REPAINT;
	button->hover_count++;
}

static void
frame_button_leave(struct frame_button *button, struct frame_pointer *pointer)
{
	button->hover_count--;
	if (!button->hover_count)
		button->frame->status |= FRAME_STATUS_REPAINT;
}

static void
frame_button_press(struct frame_button *button)
{
	if (!button->press_count)
		button->frame->status |= FRAME_STATUS_REPAINT;
	button->press_count++;

	if (button->flags & FRAME_BUTTON_CLICK_DOWN)
		button->frame->status |= button->status_effect;
}

static void
frame_button_release(struct frame_button *button)
{
	button->press_count--;
	if (button->press_count)
		return;

	button->frame->status |= FRAME_STATUS_REPAINT;

	if (!(button->flags & FRAME_BUTTON_CLICK_DOWN))
		button->frame->status |= button->status_effect;
}

static void
frame_button_cancel(struct frame_button *button)
{
	button->press_count--;
	if (!button->press_count)
		button->frame->status |= FRAME_STATUS_REPAINT;
}

static void
frame_button_repaint(struct frame_button *button, cairo_t *cr)
{
	int x, y;

	if (!button->allocation.width)
		return;
	if (!button->allocation.height)
		return;

	x = button->allocation.x;
	y = button->allocation.y;

	cairo_save(cr);

	if (button->flags & FRAME_BUTTON_DECORATED) {
		cairo_set_line_width(cr, 1);

		cairo_set_source_rgb(cr, 0.0, 0.0, 0.0);
		cairo_rectangle(cr, x, y, 25, 16);

		cairo_stroke_preserve(cr);

		if (button->press_count) {
			cairo_set_source_rgb(cr, 0.7, 0.7, 0.7);
		} else if (button->hover_count) {
			cairo_set_source_rgb(cr, 1.0, 1.0, 1.0);
		} else {
			cairo_set_source_rgb(cr, 0.88, 0.88, 0.88);
		}

		cairo_fill (cr);

		x += 4;
	}

	cairo_set_source_surface(cr, button->icon, x, y);
	cairo_paint(cr);

	cairo_restore(cr);
}

static struct frame_pointer *
frame_pointer_get(struct frame *frame, void *data)
{
	struct frame_pointer *pointer;

	wl_list_for_each(pointer, &frame->pointers, link)
		if (pointer->data == data)
			return pointer;

	pointer = calloc(1, sizeof *pointer);
	if (!pointer)
		return NULL;

	pointer->data = data;
	wl_list_init(&pointer->down_buttons);
	wl_list_insert(&frame->pointers, &pointer->link);

	return pointer;
}

static void
frame_pointer_destroy(struct frame_pointer *pointer)
{
	wl_list_remove(&pointer->link);
	free(pointer);
}

static struct frame_touch *
frame_touch_get(struct frame *frame, void *data)
{
	struct frame_touch *touch;

	wl_list_for_each(touch, &frame->touches, link)
		if (touch->data == data)
			return touch;

	touch = calloc(1, sizeof *touch);
	if (!touch)
		return NULL;

	touch->data = data;
	wl_list_insert(&frame->touches, &touch->link);

	return touch;
}

static void
frame_touch_destroy(struct frame_touch *touch)
{
	wl_list_remove(&touch->link);
	free(touch);
}

void
frame_destroy(struct frame *frame)
{
	struct frame_button *button, *next;
	struct frame_touch *touch, *next_touch;
	struct frame_pointer *pointer, *next_pointer;

	wl_list_for_each_safe(button, next, &frame->buttons, link)
		frame_button_destroy(button);

	wl_list_for_each_safe(touch, next_touch, &frame->touches, link)
		frame_touch_destroy(touch);

	wl_list_for_each_safe(pointer, next_pointer, &frame->pointers, link)
		frame_pointer_destroy(pointer);

	free(frame->title);
	free(frame);
}

struct frame *
frame_create(struct theme *t, int32_t width, int32_t height, uint32_t buttons,
             const char *title, cairo_surface_t *icon)
{
	struct frame *frame;
	struct frame_button *button;

	frame = calloc(1, sizeof *frame);
	if (!frame)
		return NULL;

	frame->width = width;
	frame->height = height;
	frame->flags = 0;
	frame->theme = t;
	frame->status = FRAME_STATUS_REPAINT;
	frame->geometry_dirty = 1;

	wl_list_init(&frame->buttons);
	wl_list_init(&frame->pointers);
	wl_list_init(&frame->touches);

	if (title) {
		frame->title = strdup(title);
		if (!frame->title)
			goto free_frame;
	}

	if (title) {
		if (icon) {
			button = frame_button_create_from_surface(frame,
			                                          icon,
			                                          FRAME_STATUS_MENU,
			                                          FRAME_BUTTON_CLICK_DOWN);
		} else {
			char *name = file_name_with_datadir("icon_window.png");

			if (!name)
				goto free_frame;

			button = frame_button_create(frame,
			                             name,
			                             FRAME_STATUS_MENU,
			                             FRAME_BUTTON_CLICK_DOWN);
			free(name);
		}
		if (!button)
			goto free_frame;
	}

	if (buttons & FRAME_BUTTON_CLOSE) {
		char *name = file_name_with_datadir("sign_close.png");

		if (!name)
			goto free_frame;

		button = frame_button_create(frame,
					     name,
					     FRAME_STATUS_CLOSE,
					     FRAME_BUTTON_ALIGN_RIGHT |
					     FRAME_BUTTON_DECORATED);
		free(name);
		if (!button)
			goto free_frame;
	}

	if (buttons & FRAME_BUTTON_MAXIMIZE) {
		char *name = file_name_with_datadir("sign_maximize.png");

		if (!name)
			goto free_frame;

		button = frame_button_create(frame,
					     name,
					     FRAME_STATUS_MAXIMIZE,
					     FRAME_BUTTON_ALIGN_RIGHT |
					     FRAME_BUTTON_DECORATED);
		free(name);
		if (!button)
			goto free_frame;
	}

	if (buttons & FRAME_BUTTON_MINIMIZE) {
		char *name = file_name_with_datadir("sign_minimize.png");

		if (!name)
			goto free_frame;

		button = frame_button_create(frame,
					     name,
					     FRAME_STATUS_MINIMIZE,
					     FRAME_BUTTON_ALIGN_RIGHT |
					     FRAME_BUTTON_DECORATED);
		free(name);
		if (!button)
			goto free_frame;
	}

	return frame;

free_frame:
	frame_destroy(frame);
	return NULL;
}

int
frame_set_title(struct frame *frame, const char *title)
{
	char *dup = NULL;

	if (title) {
		dup = strdup(title);
		if (!dup)
			return -1;
	}

	free(frame->title);
	frame->title = dup;

	frame->geometry_dirty = 1;
	frame->status |= FRAME_STATUS_REPAINT;

	return 0;
}

void
frame_set_icon(struct frame *frame, cairo_surface_t *icon)
{
	struct frame_button *button;
	wl_list_for_each(button, &frame->buttons, link) {
		if (button->status_effect != FRAME_STATUS_MENU)
			continue;
		if (button->icon)
			cairo_surface_destroy(button->icon);
		button->icon = icon;
		frame->status |= FRAME_STATUS_REPAINT;
	}
}

void
frame_set_flag(struct frame *frame, enum frame_flag flag)
{
	if (flag & FRAME_FLAG_MAXIMIZED && !(frame->flags & FRAME_FLAG_MAXIMIZED))
		frame->geometry_dirty = 1;

	frame->flags |= flag;
	frame->status |= FRAME_STATUS_REPAINT;
}

void
frame_unset_flag(struct frame *frame, enum frame_flag flag)
{
	if (flag & FRAME_FLAG_MAXIMIZED && frame->flags & FRAME_FLAG_MAXIMIZED)
		frame->geometry_dirty = 1;

	frame->flags &= ~flag;
	frame->status |= FRAME_STATUS_REPAINT;
}

void
frame_resize(struct frame *frame, int32_t width, int32_t height)
{
	frame->width = width;
	frame->height = height;

	frame->geometry_dirty = 1;
	frame->status |= FRAME_STATUS_REPAINT;
}

void
frame_decoration_sizes(struct frame *frame, int32_t *top, int32_t *bottom,
		       int32_t *left, int32_t *right)
{
	struct theme *t = frame->theme;

	/* Top may have a titlebar */
	if (frame->title || !wl_list_empty(&frame->buttons))
		*top = t->titlebar_height;
	else
		*top = t->width;

	/* All other sides have the basic frame thickness */
	*bottom = t->width;
	*right = t->width;
	*left = t->width;

	if (frame->flags & FRAME_FLAG_MAXIMIZED)
		return;

	/* Not maximized, add shadows */
	*top += t->margin;
	*bottom += t->margin;
	*left += t->margin;
	*right += t->margin;
}

void
frame_resize_inside(struct frame *frame, int32_t width, int32_t height)
{
	int32_t top, bottom, left, right;

	frame_decoration_sizes(frame, &top, &bottom, &left, &right);
	frame_resize(frame, width + left + right,
		     height + top + bottom);
}

int32_t
frame_width(struct frame *frame)
{
	return frame->width;
}

int32_t
frame_height(struct frame *frame)
{
	return frame->height;
}

static void
frame_refresh_geometry(struct frame *frame)
{
	struct frame_button *button;
	struct theme *t = frame->theme;
	int x_l, x_r, y, w, h, titlebar_height;
	int32_t decoration_width, decoration_height;

	if (!frame->geometry_dirty)
		return;

	if (frame->title || !wl_list_empty(&frame->buttons))
		titlebar_height = t->titlebar_height;
	else
		titlebar_height = t->width;

	if (frame->flags & FRAME_FLAG_MAXIMIZED) {
		decoration_width = t->width * 2;
		decoration_height = t->width + titlebar_height;

		frame->interior.x = t->width;
		frame->interior.y = titlebar_height;
		frame->interior.width = frame->width - decoration_width;
		frame->interior.height = frame->height - decoration_height;

		frame->opaque_margin = 0;
		frame->shadow_margin = 0;
	} else {
		decoration_width = (t->width + t->margin) * 2;
		decoration_height = t->width + titlebar_height + t->margin * 2;

		frame->interior.x = t->width + t->margin;
		frame->interior.y = titlebar_height + t->margin;
		frame->interior.width = frame->width - decoration_width;
		frame->interior.height = frame->height - decoration_height;

		frame->opaque_margin = t->margin + t->frame_radius;
		frame->shadow_margin = t->margin;
	}

	x_r = frame->width - t->width - frame->shadow_margin;
	x_l = t->width + frame->shadow_margin;
	y = t->width + frame->shadow_margin;
	wl_list_for_each(button, &frame->buttons, link) {
		const int button_padding = 4;
		w = cairo_image_surface_get_width(button->icon);
		h = cairo_image_surface_get_height(button->icon);

		if (button->flags & FRAME_BUTTON_DECORATED)
			w += 10;

		if (button->flags & FRAME_BUTTON_ALIGN_RIGHT) {
			x_r -= w;

			button->allocation.x = x_r;
			button->allocation.y = y;
			button->allocation.width = w + 1;
			button->allocation.height = h + 1;

			x_r -= button_padding;
		} else {
			button->allocation.x = x_l;
			button->allocation.y = y;
			button->allocation.width = w + 1;
			button->allocation.height = h + 1;

			x_l += w;
			x_l += button_padding;
		}
	}

	frame->title_rect.x = x_l;
	frame->title_rect.y = y;
	frame->title_rect.width = x_r - x_l;
	frame->title_rect.height = titlebar_height;

	frame->geometry_dirty = 0;
}

void
frame_interior(struct frame *frame, int32_t *x, int32_t *y,
		int32_t *width, int32_t *height)
{
	frame_refresh_geometry(frame);

	if (x)
		*x = frame->interior.x;
	if (y)
		*y = frame->interior.y;
	if (width)
		*width = frame->interior.width;
	if (height)
		*height = frame->interior.height;
}

void
frame_input_rect(struct frame *frame, int32_t *x, int32_t *y,
		 int32_t *width, int32_t *height)
{
	frame_refresh_geometry(frame);

	if (x)
		*x = frame->shadow_margin;
	if (y)
		*y = frame->shadow_margin;
	if (width)
		*width = frame->width - frame->shadow_margin * 2;
	if (height)
		*height = frame->height - frame->shadow_margin * 2;
}

void
frame_opaque_rect(struct frame *frame, int32_t *x, int32_t *y,
		  int32_t *width, int32_t *height)
{
	frame_refresh_geometry(frame);

	if (x)
		*x = frame->opaque_margin;
	if (y)
		*y = frame->opaque_margin;
	if (width)
		*width = frame->width - frame->opaque_margin * 2;
	if (height)
		*height = frame->height - frame->opaque_margin * 2;
}

int
frame_get_shadow_margin(struct frame *frame)
{
	frame_refresh_geometry(frame);

	return frame->shadow_margin;
}

uint32_t
frame_status(struct frame *frame)
{
	return frame->status;
}

void
frame_status_clear(struct frame *frame, enum frame_status status)
{
	frame->status &= ~status;
}

static struct frame_button *
frame_find_button(struct frame *frame, int x, int y)
{
	struct frame_button *button;
	int rel_x, rel_y;

	wl_list_for_each(button, &frame->buttons, link) {
		rel_x = x - button->allocation.x;
		rel_y = y - button->allocation.y;

		if (0 <= rel_x && rel_x < button->allocation.width &&
		    0 <= rel_y && rel_y < button->allocation.height)
			return button;
	}

	return NULL;
}

enum theme_location
frame_pointer_enter(struct frame *frame, void *data, int x, int y)
{
	return frame_pointer_motion(frame, data, x, y);
}

enum theme_location
frame_pointer_motion(struct frame *frame, void *data, int x, int y)
{
	struct frame_pointer *pointer = frame_pointer_get(frame, data);
	struct frame_button *button = frame_find_button(frame, x, y);
	enum theme_location location;

	location = theme_get_location(frame->theme, x, y,
				      frame->width, frame->height,
				      frame->flags & FRAME_FLAG_MAXIMIZED ?
				      THEME_FRAME_MAXIMIZED : 0);
	if (!pointer)
		return location;

	pointer->x = x;
	pointer->y = y;

	if (pointer->hover_button == button)
		return location;

	if (pointer->hover_button)
		frame_button_leave(pointer->hover_button, pointer);

	pointer->hover_button = button;

	if (pointer->hover_button)
		frame_button_enter(pointer->hover_button);

	return location;
}

static void
frame_pointer_button_destroy(struct frame_pointer_button *button)
{
	wl_list_remove(&button->link);
	free(button);
}

static void
frame_pointer_button_press(struct frame *frame, struct frame_pointer *pointer,
			   struct frame_pointer_button *button)
{
	if (button->button == BTN_RIGHT) {
		if (button->press_location == THEME_LOCATION_TITLEBAR)
			frame->status |= FRAME_STATUS_MENU;

		frame_pointer_button_destroy(button);

	} else if (button->button == BTN_LEFT) {
		if (pointer->hover_button) {
			frame_button_press(pointer->hover_button);
		} else {
			switch (button->press_location) {
			case THEME_LOCATION_TITLEBAR:
				frame->status |= FRAME_STATUS_MOVE;

				frame_pointer_button_destroy(button);
				break;
			case THEME_LOCATION_RESIZING_TOP:
			case THEME_LOCATION_RESIZING_BOTTOM:
			case THEME_LOCATION_RESIZING_LEFT:
			case THEME_LOCATION_RESIZING_RIGHT:
			case THEME_LOCATION_RESIZING_TOP_LEFT:
			case THEME_LOCATION_RESIZING_TOP_RIGHT:
			case THEME_LOCATION_RESIZING_BOTTOM_LEFT:
			case THEME_LOCATION_RESIZING_BOTTOM_RIGHT:
				frame->status |= FRAME_STATUS_RESIZE;

				frame_pointer_button_destroy(button);
				break;
			default:
				break;
			}
		}
	}
}

static void
frame_pointer_button_release(struct frame *frame, struct frame_pointer *pointer,
			     struct frame_pointer_button *button)
{
	if (button->button == BTN_LEFT && button->frame_button) {
		if (button->frame_button == pointer->hover_button)
			frame_button_release(button->frame_button);
		else
			frame_button_cancel(button->frame_button);
	}
}

static void
frame_pointer_button_cancel(struct frame *frame, struct frame_pointer *pointer,
			    struct frame_pointer_button *button)
{
	if (button->frame_button)
		frame_button_cancel(button->frame_button);
}

void
frame_pointer_leave(struct frame *frame, void *data)
{
	struct frame_pointer *pointer = frame_pointer_get(frame, data);
	struct frame_pointer_button *button, *next;
	if (!pointer)
		return;

	if (pointer->hover_button)
		frame_button_leave(pointer->hover_button, pointer);

	wl_list_for_each_safe(button, next, &pointer->down_buttons, link) {
		frame_pointer_button_cancel(frame, pointer, button);
		frame_pointer_button_destroy(button);
	}

	frame_pointer_destroy(pointer);
}

enum theme_location
frame_pointer_button(struct frame *frame, void *data,
		     uint32_t btn, enum wl_pointer_button_state state)
{
	struct frame_pointer *pointer = frame_pointer_get(frame, data);
	struct frame_pointer_button *button;
	enum theme_location location = THEME_LOCATION_EXTERIOR;

	if (!pointer)
		return location;

	location = theme_get_location(frame->theme, pointer->x, pointer->y,
				      frame->width, frame->height,
				      frame->flags & FRAME_FLAG_MAXIMIZED ?
				      THEME_FRAME_MAXIMIZED : 0);

	if (state == WL_POINTER_BUTTON_STATE_PRESSED) {
		button = malloc(sizeof *button);
		if (!button)
			return location;

		button->button = btn;
		button->press_location = location;
		button->frame_button = pointer->hover_button;
		wl_list_insert(&pointer->down_buttons, &button->link);

		frame_pointer_button_press(frame, pointer, button);
	} else if (state == WL_POINTER_BUTTON_STATE_RELEASED) {
		button = NULL;
		wl_list_for_each(button, &pointer->down_buttons, link)
			if (button->button == btn)
				break;
		/* Make sure we didn't hit the end */
		if (&button->link == &pointer->down_buttons)
			return location;

		location = button->press_location;
		frame_pointer_button_release(frame, pointer, button);
		frame_pointer_button_destroy(button);
	}

	return location;
}

enum theme_location
frame_touch_down(struct frame *frame, void *data, int32_t id, int x, int y)
{
	struct frame_touch *touch = frame_touch_get(frame, data);
	struct frame_button *button = frame_find_button(frame, x, y);
	enum theme_location location;

	location = theme_get_location(frame->theme, x, y,
				      frame->width, frame->height,
				      frame->flags & FRAME_FLAG_MAXIMIZED ?
				      THEME_FRAME_MAXIMIZED : 0);

	if (id > 0)
		return location;

	if (touch && button) {
		touch->button = button;
		frame_button_press(touch->button);
		return location;
	}

	switch (location) {
	case THEME_LOCATION_TITLEBAR:
		frame->status |= FRAME_STATUS_MOVE;
		break;
	case THEME_LOCATION_RESIZING_TOP:
	case THEME_LOCATION_RESIZING_BOTTOM:
	case THEME_LOCATION_RESIZING_LEFT:
	case THEME_LOCATION_RESIZING_RIGHT:
	case THEME_LOCATION_RESIZING_TOP_LEFT:
	case THEME_LOCATION_RESIZING_TOP_RIGHT:
	case THEME_LOCATION_RESIZING_BOTTOM_LEFT:
	case THEME_LOCATION_RESIZING_BOTTOM_RIGHT:
		frame->status |= FRAME_STATUS_RESIZE;
		break;
	default:
		break;
	}
	return location;
}

void
frame_touch_up(struct frame *frame, void *data, int32_t id)
{
	struct frame_touch *touch = frame_touch_get(frame, data);

	if (id > 0)
		return;

	if (touch && touch->button) {
		frame_button_release(touch->button);
		frame_touch_destroy(touch);
	}
}

enum theme_location
frame_double_click(struct frame *frame, void *data,
		   uint32_t btn, enum wl_pointer_button_state state)
{
	struct frame_pointer *pointer = frame_pointer_get(frame, data);
	struct frame_button *button;
	enum theme_location location = THEME_LOCATION_EXTERIOR;

	location = theme_get_location(frame->theme, pointer->x, pointer->y,
				      frame->width, frame->height,
				      frame->flags & FRAME_FLAG_MAXIMIZED ?
				      THEME_FRAME_MAXIMIZED : 0);

	button = frame_find_button(frame, pointer->x, pointer->y);

	if (location != THEME_LOCATION_TITLEBAR || btn != BTN_LEFT)
		return location;

	if (state == WL_POINTER_BUTTON_STATE_PRESSED) {
		if (button)
			frame_button_press(button);
		else
			frame->status |= FRAME_STATUS_MAXIMIZE;
	} else if (state == WL_POINTER_BUTTON_STATE_RELEASED) {
		if (button)
			frame_button_release(button);
	}

	return location;
}

void
frame_double_touch_down(struct frame *frame, void *data, int32_t id,
			int x, int y)
{
	struct frame_touch *touch = frame_touch_get(frame, data);
	struct frame_button *button = frame_find_button(frame, x, y);
	enum theme_location location;

	if (touch && button) {
		touch->button = button;
		frame_button_press(touch->button);
		return;
	}

	location = theme_get_location(frame->theme, x, y,
				      frame->width, frame->height,
				      frame->flags & FRAME_FLAG_MAXIMIZED ?
				      THEME_FRAME_MAXIMIZED : 0);

	switch (location) {
	case THEME_LOCATION_TITLEBAR:
		frame->status |= FRAME_STATUS_MAXIMIZE;
		break;
	case THEME_LOCATION_RESIZING_TOP:
	case THEME_LOCATION_RESIZING_BOTTOM:
	case THEME_LOCATION_RESIZING_LEFT:
	case THEME_LOCATION_RESIZING_RIGHT:
	case THEME_LOCATION_RESIZING_TOP_LEFT:
	case THEME_LOCATION_RESIZING_TOP_RIGHT:
	case THEME_LOCATION_RESIZING_BOTTOM_LEFT:
	case THEME_LOCATION_RESIZING_BOTTOM_RIGHT:
		frame->status |= FRAME_STATUS_RESIZE;
		break;
	default:
		break;
	}
}

void
frame_double_touch_up(struct frame *frame, void *data, int32_t id)
{
	struct frame_touch *touch = frame_touch_get(frame, data);

	if (touch && touch->button) {
		frame_button_release(touch->button);
		frame_touch_destroy(touch);
	}
}

void
frame_repaint(struct frame *frame, cairo_t *cr)
{
	struct frame_button *button;
	uint32_t flags = 0;

	frame_refresh_geometry(frame);

	if (frame->flags & FRAME_FLAG_MAXIMIZED)
		flags |= THEME_FRAME_MAXIMIZED;

	if (frame->flags & FRAME_FLAG_ACTIVE)
		flags |= THEME_FRAME_ACTIVE;

	cairo_save(cr);
	theme_render_frame(frame->theme, cr, frame->width, frame->height,
			   frame->title, &frame->title_rect,
			   &frame->buttons, flags);
	cairo_restore(cr);

	wl_list_for_each(button, &frame->buttons, link)
		frame_button_repaint(button, cr);

	frame_status_clear(frame, FRAME_STATUS_REPAINT);
}

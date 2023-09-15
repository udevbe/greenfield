/*
 * Copyright © 2008 Kristian Høgsberg
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

#ifndef _WINDOW_H_
#define _WINDOW_H_

#include "config.h"

#include <stdint.h>
#include <time.h>
#include <xkbcommon/xkbcommon.h>
#include <wayland-client.h>
#include <cairo.h>
#include <libweston/config-parser.h>
#include <libweston/zalloc.h>
#include "shared/platform.h"

struct window;
struct widget;
struct display;
struct input;
struct output;

struct task {
	void (*run)(struct task *task, uint32_t events);
	struct wl_list link;
};

struct rectangle {
	int32_t x;
	int32_t y;
	int32_t width;
	int32_t height;
};

struct display *
display_create(int *argc, char *argv[]);

void
display_destroy(struct display *display);

void
display_set_user_data(struct display *display, void *data);

void *
display_get_user_data(struct display *display);

struct wl_display *
display_get_display(struct display *display);

int
display_has_subcompositor(struct display *display);

struct wl_compositor *
display_get_compositor(struct display *display);

struct output *
display_get_output(struct display *display);

uint32_t
display_get_serial(struct display *display);

typedef void (*display_global_handler_t)(struct display *display,
					 uint32_t name,
					 const char *interface,
					 uint32_t version, void *data);

void
display_set_global_handler(struct display *display,
			   display_global_handler_t handler);
void
display_set_global_handler_remove(struct display *display,
			   display_global_handler_t remove_handler);
void *
display_bind(struct display *display, uint32_t name,
	     const struct wl_interface *interface, uint32_t version);

typedef void (*display_output_handler_t)(struct output *output, void *data);

/*
 * The output configure handler is called, when a new output is connected
 * and we know its current mode, or when the current mode changes.
 * Test and set the output user data in your handler to know, if the
 * output is new. Note: 'data' in the configure handler is the display
 * user data.
 */
void
display_set_output_configure_handler(struct display *display,
				     display_output_handler_t handler);

struct wl_data_source *
display_create_data_source(struct display *display);

#define SURFACE_OPAQUE 0x01
#define SURFACE_SHM    0x02

#define SURFACE_HINT_RESIZE 0x10

cairo_surface_t *
display_create_surface(struct display *display,
		       struct wl_surface *surface,
		       struct rectangle *rectangle,
		       uint32_t flags);

struct wl_buffer *
display_get_buffer_for_surface(struct display *display,
			       cairo_surface_t *surface);

struct wl_cursor_image *
display_get_pointer_image(struct display *display, int pointer);

void
display_defer(struct display *display, struct task *task);

void
display_watch_fd(struct display *display,
		 int fd, uint32_t events, struct task *task);

void
display_unwatch_fd(struct display *display, int fd);

void
display_run(struct display *d);

void
display_exit(struct display *d);

int
display_get_data_device_manager_version(struct display *d);

enum cursor_type {
	CURSOR_BOTTOM_LEFT,
	CURSOR_BOTTOM_RIGHT,
	CURSOR_BOTTOM,
	CURSOR_DRAGGING,
	CURSOR_LEFT_PTR,
	CURSOR_LEFT,
	CURSOR_RIGHT,
	CURSOR_TOP_LEFT,
	CURSOR_TOP_RIGHT,
	CURSOR_TOP,
	CURSOR_IBEAM,
	CURSOR_HAND1,
	CURSOR_WATCH,
	CURSOR_DND_MOVE,
	CURSOR_DND_COPY,
	CURSOR_DND_FORBIDDEN,

	CURSOR_BLANK
};

typedef void (*window_key_handler_t)(struct window *window, struct input *input,
				     uint32_t time, uint32_t key, uint32_t unicode,
				     enum wl_keyboard_key_state state, void *data);

typedef void (*window_keyboard_focus_handler_t)(struct window *window,
						struct input *device, void *data);

typedef void (*window_data_handler_t)(struct window *window,
				      struct input *input,
				      float x, float y,
				      const char **types,
				      void *data);

typedef void (*window_drop_handler_t)(struct window *window,
				      struct input *input,
				      int32_t x, int32_t y, void *data);

typedef void (*window_close_handler_t)(void *data);
typedef void (*window_fullscreen_handler_t)(struct window *window, void *data);

typedef void (*window_output_handler_t)(struct window *window, struct output *output,
					int enter, void *data);
typedef void (*window_state_changed_handler_t)(struct window *window,
					       void *data);


typedef void (*window_locked_pointer_motion_handler_t)(struct window *window,
						       struct input *input,
						       uint32_t time,
						       float x, float y,
						       void *data);

typedef void (*locked_pointer_locked_handler_t)(struct window *window,
						struct input *input,
						void *data);

typedef void (*locked_pointer_unlocked_handler_t)(struct window *window,
						  struct input *input,
						  void *data);

typedef void (*confined_pointer_confined_handler_t)(struct window *window,
						    struct input *input,
						    void *data);

typedef void (*confined_pointer_unconfined_handler_t)(struct window *window,
						      struct input *input,
						      void *data);

typedef void (*widget_resize_handler_t)(struct widget *widget,
					int32_t width, int32_t height,
					void *data);
typedef void (*widget_redraw_handler_t)(struct widget *widget, void *data);

typedef int (*widget_enter_handler_t)(struct widget *widget,
				      struct input *input,
				      float x, float y, void *data);
typedef void (*widget_leave_handler_t)(struct widget *widget,
				       struct input *input, void *data);
typedef int (*widget_motion_handler_t)(struct widget *widget,
				       struct input *input, uint32_t time,
				       float x, float y, void *data);
typedef void (*widget_button_handler_t)(struct widget *widget,
					struct input *input, uint32_t time,
					uint32_t button,
					enum wl_pointer_button_state state,
					void *data);
typedef void (*widget_touch_down_handler_t)(struct widget *widget,
					    struct input *input,
					    uint32_t serial,
					    uint32_t time,
					    int32_t id,
					    float x,
					    float y,
					    void *data);
typedef void (*widget_touch_up_handler_t)(struct widget *widget,
					  struct input *input,
					  uint32_t serial,
					  uint32_t time,
					  int32_t id,
					  void *data);
typedef void (*widget_touch_motion_handler_t)(struct widget *widget,
					      struct input *input,
					      uint32_t time,
					      int32_t id,
					      float x,
					      float y,
					      void *data);
typedef void (*widget_touch_frame_handler_t)(struct widget *widget,
					     struct input *input, void *data);
typedef void (*widget_touch_cancel_handler_t)(struct widget *widget,
					      struct input *input, void *data);
typedef void (*widget_axis_handler_t)(struct widget *widget,
				      struct input *input, uint32_t time,
				      uint32_t axis,
				      wl_fixed_t value,
				      void *data);

typedef void (*widget_pointer_frame_handler_t)(struct widget *widget,
					       struct input *input,
					       void *data);

typedef void (*widget_axis_source_handler_t)(struct widget *widget,
					     struct input *input,
					     uint32_t source,
					     void *data);

typedef void (*widget_axis_stop_handler_t)(struct widget *widget,
					   struct input *input,
					   uint32_t time,
					   uint32_t axis,
					   void *data);

typedef void (*widget_axis_discrete_handler_t)(struct widget *widget,
					       struct input *input,
					       uint32_t axis,
					       int32_t discrete,
					       void *data);

struct window *
window_create(struct display *display);
struct window *
window_create_custom(struct display *display);

void
window_set_parent(struct window *window, struct window *parent_window);
struct window *
window_get_parent(struct window *window);

int
window_has_focus(struct window *window);

typedef void (*menu_func_t)(void *data, struct input *input, int index);

void
window_show_menu(struct display *display,
		 struct input *input, uint32_t time, struct window *parent,
		 int32_t x, int32_t y,
		 menu_func_t func, const char **entries, int count);

void
window_show_frame_menu(struct window *window,
		       struct input *input, uint32_t time);

int
window_get_buffer_transform(struct window *window);

void
window_set_buffer_transform(struct window *window,
			    enum wl_output_transform transform);

uint32_t
window_get_buffer_scale(struct window *window);

void
window_set_buffer_scale(struct window *window,
                        int32_t scale);

uint32_t
window_get_output_scale(struct window *window);

void
window_destroy(struct window *window);

struct widget *
window_add_widget(struct window *window, void *data);

enum subsurface_mode {
	SUBSURFACE_SYNCHRONIZED,
	SUBSURFACE_DESYNCHRONIZED
};

struct widget *
window_add_subsurface(struct window *window, void *data,
		      enum subsurface_mode default_mode);

typedef void (*data_func_t)(void *data, size_t len,
			    int32_t x, int32_t y, void *user_data);

struct display *
window_get_display(struct window *window);
void
window_move(struct window *window, struct input *input, uint32_t time);
void
window_get_allocation(struct window *window, struct rectangle *allocation);
void
window_schedule_redraw(struct window *window);
void
window_schedule_resize(struct window *window, int width, int height);

int
window_lock_pointer(struct window *window, struct input *input);

void
window_unlock_pointer(struct window *window);

void
widget_set_locked_pointer_cursor_hint(struct widget *widget,
				      float x, float y);

int
window_confine_pointer_to_rectangles(struct window *window,
				     struct input *input,
				     struct rectangle *rectangles,
				     int num_rectangles);

void
window_update_confine_rectangles(struct window *window,
				 struct rectangle *rectangles,
				 int num_rectangles);

int
window_confine_pointer_to_widget(struct window *window,
				 struct widget *widget,
				 struct input *input);

void
window_unconfine_pointer(struct window *window);

cairo_surface_t *
window_get_surface(struct window *window);

struct wl_surface *
window_get_wl_surface(struct window *window);

struct wl_subsurface *
widget_get_wl_subsurface(struct widget *widget);

enum window_buffer_type {
	WINDOW_BUFFER_TYPE_SHM,
};

void
display_surface_damage(struct display *display, cairo_surface_t *cairo_surface,
		       int32_t x, int32_t y, int32_t width, int32_t height);

void
window_set_buffer_type(struct window *window, enum window_buffer_type type);

enum window_buffer_type
window_get_buffer_type(struct window *window);

int
window_is_fullscreen(struct window *window);

void
window_set_fullscreen(struct window *window, int fullscreen);

int
window_is_maximized(struct window *window);

void
window_set_maximized(struct window *window, int maximized);

int
window_is_resizing(struct window *window);

void
window_set_minimized(struct window *window);

void
window_set_user_data(struct window *window, void *data);

void *
window_get_user_data(struct window *window);

void
window_set_key_handler(struct window *window,
		       window_key_handler_t handler);

void
window_set_keyboard_focus_handler(struct window *window,
				  window_keyboard_focus_handler_t handler);

void
window_set_data_handler(struct window *window,
			window_data_handler_t handler);

void
window_set_drop_handler(struct window *window,
			window_drop_handler_t handler);

void
window_set_close_handler(struct window *window,
			 window_close_handler_t handler);
void
window_set_fullscreen_handler(struct window *window,
			      window_fullscreen_handler_t handler);
void
window_set_output_handler(struct window *window,
			  window_output_handler_t handler);
void
window_set_state_changed_handler(struct window *window,
				 window_state_changed_handler_t handler);

void
window_set_pointer_locked_handler(struct window *window,
				  locked_pointer_locked_handler_t locked,
				  locked_pointer_unlocked_handler_t unlocked);

void
window_set_pointer_confined_handler(struct window *window,
				    confined_pointer_confined_handler_t confined,
				    confined_pointer_unconfined_handler_t unconfined);

void
window_set_locked_pointer_motion_handler(
	struct window *window, window_locked_pointer_motion_handler_t handler);

void
window_set_title(struct window *window, const char *title);

void
window_set_appid(struct window *window, const char *appid);

const char *
window_get_title(struct window *window);

const char *
window_get_appid(struct window *window);

int
widget_set_tooltip(struct widget *parent, char *entry, float x, float y);

void
widget_destroy_tooltip(struct widget *parent);

struct widget *
widget_add_widget(struct widget *parent, void *data);

void
widget_destroy(struct widget *widget);
void
widget_set_default_cursor(struct widget *widget, int cursor);
void
widget_get_allocation(struct widget *widget, struct rectangle *allocation);

void
widget_set_allocation(struct widget *widget,
		      int32_t x, int32_t y, int32_t width, int32_t height);
void
widget_set_size(struct widget *widget, int32_t width, int32_t height);
void
widget_set_transparent(struct widget *widget, int transparent);
void
widget_schedule_resize(struct widget *widget, int32_t width, int32_t height);

void *
widget_get_user_data(struct widget *widget);

cairo_t *
widget_cairo_create(struct widget *widget);

struct wl_surface *
widget_get_wl_surface(struct widget *widget);

uint32_t
widget_get_last_time(struct widget *widget);

void
widget_input_region_add(struct widget *widget, const struct rectangle *rect);

void
widget_set_redraw_handler(struct widget *widget,
			  widget_redraw_handler_t handler);
void
widget_set_resize_handler(struct widget *widget,
			  widget_resize_handler_t handler);
void
widget_set_enter_handler(struct widget *widget,
			 widget_enter_handler_t handler);
void
widget_set_leave_handler(struct widget *widget,
			 widget_leave_handler_t handler);
void
widget_set_motion_handler(struct widget *widget,
			  widget_motion_handler_t handler);
void
widget_set_button_handler(struct widget *widget,
			  widget_button_handler_t handler);
void
widget_set_touch_down_handler(struct widget *widget,
			      widget_touch_down_handler_t handler);
void
widget_set_touch_up_handler(struct widget *widget,
			    widget_touch_up_handler_t handler);
void
widget_set_touch_motion_handler(struct widget *widget,
				widget_touch_motion_handler_t handler);
void
widget_set_touch_frame_handler(struct widget *widget,
			       widget_touch_frame_handler_t handler);
void
widget_set_touch_cancel_handler(struct widget *widget,
				widget_touch_cancel_handler_t handler);
void
widget_set_axis_handler(struct widget *widget,
			widget_axis_handler_t handler);
void
widget_set_pointer_frame_handler(struct widget *widget,
				 widget_pointer_frame_handler_t handler);
void
widget_set_axis_handlers(struct widget *widget,
			widget_axis_handler_t axis_handler,
			widget_axis_source_handler_t axis_source_handler,
			widget_axis_stop_handler_t axis_stop_handler,
			widget_axis_discrete_handler_t axis_discrete_handler);

void
window_inhibit_redraw(struct window *window);
void
window_uninhibit_redraw(struct window *window);
void
widget_schedule_redraw(struct widget *widget);
void
widget_set_use_cairo(struct widget *widget, int use_cairo);

/*
 * Sets the viewport destination for the widget's surface
 * return 0 on success and -1 on failure. Set width and height to
 * -1 to reset the viewport.
 */
int
widget_set_viewport_destination(struct widget *widget, int width, int height);

struct widget *
window_frame_create(struct window *window, void *data);

void
window_frame_set_child_size(struct widget *widget, int child_width,
			    int child_height);

void
input_set_pointer_image(struct input *input, int pointer);

void
input_get_position(struct input *input, int32_t *x, int32_t *y);

int
input_get_touch(struct input *input, int32_t id, float *x, float *y);

#define MOD_SHIFT_MASK		0x01
#define MOD_ALT_MASK		0x02
#define MOD_CONTROL_MASK	0x04

uint32_t
input_get_modifiers(struct input *input);

void
touch_grab(struct input *input, int32_t touch_id);

void
touch_ungrab(struct input *input);

void
input_grab(struct input *input, struct widget *widget, uint32_t button);

void
input_ungrab(struct input *input);

struct widget *
input_get_focus_widget(struct input *input);

struct display *
input_get_display(struct input *input);

struct wl_seat *
input_get_seat(struct input *input);

struct wl_data_device *
input_get_data_device(struct input *input);

void
input_set_selection(struct input *input,
		    struct wl_data_source *source, uint32_t time);

void
input_accept(struct input *input, const char *type);


void
input_receive_drag_data(struct input *input, const char *mime_type,
			data_func_t func, void *user_data);
int
input_receive_drag_data_to_fd(struct input *input,
			      const char *mime_type, int fd);

int
input_receive_selection_data(struct input *input, const char *mime_type,
			     data_func_t func, void *data);
int
input_receive_selection_data_to_fd(struct input *input,
				   const char *mime_type, int fd);

void
output_set_user_data(struct output *output, void *data);

void *
output_get_user_data(struct output *output);

void
output_set_destroy_handler(struct output *output,
			   display_output_handler_t handler);

void
output_get_allocation(struct output *output, struct rectangle *allocation);

struct wl_output *
output_get_wl_output(struct output *output);

enum wl_output_transform
output_get_transform(struct output *output);

uint32_t
output_get_scale(struct output *output);

const char *
output_get_make(struct output *output);

const char *
output_get_model(struct output *output);

void
keysym_modifiers_add(struct wl_array *modifiers_map,
		     const char *name);

xkb_mod_mask_t
keysym_modifiers_get_mask(struct wl_array *modifiers_map,
			  const char *name);

struct toytimer;
typedef void (*toytimer_cb)(struct toytimer *);

struct toytimer {
	struct display *display;
	struct task tsk;
	int fd;
	toytimer_cb callback;
};
#endif

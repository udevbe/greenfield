/* Generated by wayland-scanner 1.19.92 */

/*
 * Copyright © 2008-2011 Kristian Høgsberg
 * Copyright © 2010-2011 Intel Corporation
 * Copyright © 2012-2013 Collabora, Ltd.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
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

#include <stdlib.h>
#include <stdint.h>
#include "wayland-util.h"

extern const struct wl_interface wl_buffer_interface;
extern const struct wl_interface wl_callback_interface;
extern const struct wl_interface wl_data_device_interface;
extern const struct wl_interface wl_data_offer_interface;
extern const struct wl_interface wl_data_source_interface;
extern const struct wl_interface wl_keyboard_interface;
extern const struct wl_interface wl_output_interface;
extern const struct wl_interface wl_pointer_interface;
extern const struct wl_interface wl_region_interface;
extern const struct wl_interface wl_registry_interface;
extern const struct wl_interface wl_seat_interface;
extern const struct wl_interface wl_shell_surface_interface;
extern const struct wl_interface wl_shm_pool_interface;
extern const struct wl_interface wl_subsurface_interface;
extern const struct wl_interface wl_surface_interface;
extern const struct wl_interface wl_touch_interface;

static const struct wl_interface *wayland_types[] = {
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	&wl_callback_interface,
	&wl_registry_interface,
	&wl_surface_interface,
	&wl_region_interface,
	&wl_buffer_interface,
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	&wl_shm_pool_interface,
	NULL,
	NULL,
	&wl_data_source_interface,
	&wl_surface_interface,
	&wl_surface_interface,
	NULL,
	&wl_data_source_interface,
	NULL,
	&wl_data_offer_interface,
	NULL,
	&wl_surface_interface,
	NULL,
	NULL,
	&wl_data_offer_interface,
	&wl_data_offer_interface,
	&wl_data_source_interface,
	&wl_data_device_interface,
	&wl_seat_interface,
	&wl_shell_surface_interface,
	&wl_surface_interface,
	&wl_seat_interface,
	NULL,
	&wl_seat_interface,
	NULL,
	NULL,
	&wl_surface_interface,
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	&wl_output_interface,
	&wl_seat_interface,
	NULL,
	&wl_surface_interface,
	NULL,
	NULL,
	NULL,
	&wl_output_interface,
	&wl_buffer_interface,
	NULL,
	NULL,
	&wl_callback_interface,
	&wl_region_interface,
	&wl_region_interface,
	&wl_output_interface,
	&wl_output_interface,
	&wl_pointer_interface,
	&wl_keyboard_interface,
	&wl_touch_interface,
	NULL,
	&wl_surface_interface,
	NULL,
	NULL,
	NULL,
	&wl_surface_interface,
	NULL,
	NULL,
	NULL,
	&wl_surface_interface,
	NULL,
	&wl_surface_interface,
	NULL,
	NULL,
	&wl_surface_interface,
	NULL,
	NULL,
	&wl_surface_interface,
	NULL,
	NULL,
	NULL,
	&wl_subsurface_interface,
	&wl_surface_interface,
	&wl_surface_interface,
	&wl_surface_interface,
	&wl_surface_interface,
};

static const struct wl_message wl_display_requests[] = {
	{ "sync", "n", wayland_types + 8 },
	{ "get_registry", "n", wayland_types + 9 },
};

static const struct wl_message wl_display_events[] = {
	{ "error", "ous", wayland_types + 0 },
	{ "delete_id", "u", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_display_interface = {
	"wl_display", 1,
	2, wl_display_requests,
	2, wl_display_events,
};

static const struct wl_message wl_registry_requests[] = {
	{ "bind", "usun", wayland_types + 0 },
};

static const struct wl_message wl_registry_events[] = {
	{ "global", "usu", wayland_types + 0 },
	{ "global_remove", "u", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_registry_interface = {
	"wl_registry", 1,
	1, wl_registry_requests,
	2, wl_registry_events,
};

static const struct wl_message wl_callback_events[] = {
	{ "done", "u", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_callback_interface = {
	"wl_callback", 1,
	0, NULL,
	1, wl_callback_events,
};

static const struct wl_message wl_compositor_requests[] = {
	{ "create_surface", "n", wayland_types + 10 },
	{ "create_region", "n", wayland_types + 11 },
};

WL_EXPORT const struct wl_interface wl_compositor_interface = {
	"wl_compositor", 5,
	2, wl_compositor_requests,
	0, NULL,
};

static const struct wl_message wl_shm_pool_requests[] = {
	{ "create_buffer", "niiiiu", wayland_types + 12 },
	{ "destroy", "", wayland_types + 0 },
	{ "resize", "i", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_shm_pool_interface = {
	"wl_shm_pool", 1,
	3, wl_shm_pool_requests,
	0, NULL,
};

static const struct wl_message wl_shm_requests[] = {
	{ "create_pool", "nhi", wayland_types + 18 },
};

static const struct wl_message wl_shm_events[] = {
	{ "format", "u", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_shm_interface = {
	"wl_shm", 1,
	1, wl_shm_requests,
	1, wl_shm_events,
};

static const struct wl_message wl_buffer_requests[] = {
	{ "destroy", "", wayland_types + 0 },
};

static const struct wl_message wl_buffer_events[] = {
	{ "release", "", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_buffer_interface = {
	"wl_buffer", 1,
	1, wl_buffer_requests,
	1, wl_buffer_events,
};

static const struct wl_message wl_data_offer_requests[] = {
	{ "accept", "u?s", wayland_types + 0 },
	{ "receive", "sh", wayland_types + 0 },
	{ "destroy", "", wayland_types + 0 },
	{ "finish", "3", wayland_types + 0 },
	{ "set_actions", "3uu", wayland_types + 0 },
};

static const struct wl_message wl_data_offer_events[] = {
	{ "offer", "s", wayland_types + 0 },
	{ "source_actions", "3u", wayland_types + 0 },
	{ "action", "3u", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_data_offer_interface = {
	"wl_data_offer", 3,
	5, wl_data_offer_requests,
	3, wl_data_offer_events,
};

static const struct wl_message wl_data_source_requests[] = {
	{ "offer", "s", wayland_types + 0 },
	{ "destroy", "", wayland_types + 0 },
	{ "set_actions", "3u", wayland_types + 0 },
};

static const struct wl_message wl_data_source_events[] = {
	{ "target", "?s", wayland_types + 0 },
	{ "send", "sh", wayland_types + 0 },
	{ "cancelled", "", wayland_types + 0 },
	{ "dnd_drop_performed", "3", wayland_types + 0 },
	{ "dnd_finished", "3", wayland_types + 0 },
	{ "action", "3u", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_data_source_interface = {
	"wl_data_source", 3,
	3, wl_data_source_requests,
	6, wl_data_source_events,
};

static const struct wl_message wl_data_device_requests[] = {
	{ "start_drag", "?oo?ou", wayland_types + 21 },
	{ "set_selection", "?ou", wayland_types + 25 },
	{ "release", "2", wayland_types + 0 },
};

static const struct wl_message wl_data_device_events[] = {
	{ "data_offer", "n", wayland_types + 27 },
	{ "enter", "uoff?o", wayland_types + 28 },
	{ "leave", "", wayland_types + 0 },
	{ "motion", "uff", wayland_types + 0 },
	{ "drop", "", wayland_types + 0 },
	{ "selection", "?o", wayland_types + 33 },
};

WL_EXPORT const struct wl_interface wl_data_device_interface = {
	"wl_data_device", 3,
	3, wl_data_device_requests,
	6, wl_data_device_events,
};

static const struct wl_message wl_data_device_manager_requests[] = {
	{ "create_data_source", "n", wayland_types + 34 },
	{ "get_data_device", "no", wayland_types + 35 },
};

WL_EXPORT const struct wl_interface wl_data_device_manager_interface = {
	"wl_data_device_manager", 3,
	2, wl_data_device_manager_requests,
	0, NULL,
};

static const struct wl_message wl_shell_requests[] = {
	{ "get_shell_surface", "no", wayland_types + 37 },
};

WL_EXPORT const struct wl_interface wl_shell_interface = {
	"wl_shell", 1,
	1, wl_shell_requests,
	0, NULL,
};

static const struct wl_message wl_shell_surface_requests[] = {
	{ "pong", "u", wayland_types + 0 },
	{ "move", "ou", wayland_types + 39 },
	{ "resize", "ouu", wayland_types + 41 },
	{ "set_toplevel", "", wayland_types + 0 },
	{ "set_transient", "oiiu", wayland_types + 44 },
	{ "set_fullscreen", "uu?o", wayland_types + 48 },
	{ "set_popup", "ouoiiu", wayland_types + 51 },
	{ "set_maximized", "?o", wayland_types + 57 },
	{ "set_title", "s", wayland_types + 0 },
	{ "set_class", "s", wayland_types + 0 },
};

static const struct wl_message wl_shell_surface_events[] = {
	{ "ping", "u", wayland_types + 0 },
	{ "configure", "uii", wayland_types + 0 },
	{ "popup_done", "", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_shell_surface_interface = {
	"wl_shell_surface", 1,
	10, wl_shell_surface_requests,
	3, wl_shell_surface_events,
};

static const struct wl_message wl_surface_requests[] = {
	{ "destroy", "", wayland_types + 0 },
	{ "attach", "?oii", wayland_types + 58 },
	{ "damage", "iiii", wayland_types + 0 },
	{ "frame", "n", wayland_types + 61 },
	{ "set_opaque_region", "?o", wayland_types + 62 },
	{ "set_input_region", "?o", wayland_types + 63 },
	{ "commit", "", wayland_types + 0 },
	{ "set_buffer_transform", "2i", wayland_types + 0 },
	{ "set_buffer_scale", "3i", wayland_types + 0 },
	{ "damage_buffer", "4iiii", wayland_types + 0 },
	{ "offset", "5ii", wayland_types + 0 },
};

static const struct wl_message wl_surface_events[] = {
	{ "enter", "o", wayland_types + 64 },
	{ "leave", "o", wayland_types + 65 },
};

WL_EXPORT const struct wl_interface wl_surface_interface = {
	"wl_surface", 5,
	11, wl_surface_requests,
	2, wl_surface_events,
};

static const struct wl_message wl_seat_requests[] = {
	{ "get_pointer", "n", wayland_types + 66 },
	{ "get_keyboard", "n", wayland_types + 67 },
	{ "get_touch", "n", wayland_types + 68 },
	{ "release", "5", wayland_types + 0 },
};

static const struct wl_message wl_seat_events[] = {
	{ "capabilities", "u", wayland_types + 0 },
	{ "name", "2s", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_seat_interface = {
	"wl_seat", 7,
	4, wl_seat_requests,
	2, wl_seat_events,
};

static const struct wl_message wl_pointer_requests[] = {
	{ "set_cursor", "u?oii", wayland_types + 69 },
	{ "release", "3", wayland_types + 0 },
};

static const struct wl_message wl_pointer_events[] = {
	{ "enter", "uoff", wayland_types + 73 },
	{ "leave", "uo", wayland_types + 77 },
	{ "motion", "uff", wayland_types + 0 },
	{ "button", "uuuu", wayland_types + 0 },
	{ "axis", "uuf", wayland_types + 0 },
	{ "frame", "5", wayland_types + 0 },
	{ "axis_source", "5u", wayland_types + 0 },
	{ "axis_stop", "5uu", wayland_types + 0 },
	{ "axis_discrete", "5ui", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_pointer_interface = {
	"wl_pointer", 7,
	2, wl_pointer_requests,
	9, wl_pointer_events,
};

static const struct wl_message wl_keyboard_requests[] = {
	{ "release", "3", wayland_types + 0 },
};

static const struct wl_message wl_keyboard_events[] = {
	{ "keymap", "uhu", wayland_types + 0 },
	{ "enter", "uoa", wayland_types + 79 },
	{ "leave", "uo", wayland_types + 82 },
	{ "key", "uuuu", wayland_types + 0 },
	{ "modifiers", "uuuuu", wayland_types + 0 },
	{ "repeat_info", "4ii", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_keyboard_interface = {
	"wl_keyboard", 7,
	1, wl_keyboard_requests,
	6, wl_keyboard_events,
};

static const struct wl_message wl_touch_requests[] = {
	{ "release", "3", wayland_types + 0 },
};

static const struct wl_message wl_touch_events[] = {
	{ "down", "uuoiff", wayland_types + 84 },
	{ "up", "uui", wayland_types + 0 },
	{ "motion", "uiff", wayland_types + 0 },
	{ "frame", "", wayland_types + 0 },
	{ "cancel", "", wayland_types + 0 },
	{ "shape", "6iff", wayland_types + 0 },
	{ "orientation", "6if", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_touch_interface = {
	"wl_touch", 7,
	1, wl_touch_requests,
	7, wl_touch_events,
};

static const struct wl_message wl_output_requests[] = {
	{ "release", "3", wayland_types + 0 },
};

static const struct wl_message wl_output_events[] = {
	{ "geometry", "iiiiissi", wayland_types + 0 },
	{ "mode", "uiii", wayland_types + 0 },
	{ "done", "2", wayland_types + 0 },
	{ "scale", "2i", wayland_types + 0 },
	{ "name", "4s", wayland_types + 0 },
	{ "description", "4s", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_output_interface = {
	"wl_output", 4,
	1, wl_output_requests,
	6, wl_output_events,
};

static const struct wl_message wl_region_requests[] = {
	{ "destroy", "", wayland_types + 0 },
	{ "add", "iiii", wayland_types + 0 },
	{ "subtract", "iiii", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_region_interface = {
	"wl_region", 1,
	3, wl_region_requests,
	0, NULL,
};

static const struct wl_message wl_subcompositor_requests[] = {
	{ "destroy", "", wayland_types + 0 },
	{ "get_subsurface", "noo", wayland_types + 90 },
};

WL_EXPORT const struct wl_interface wl_subcompositor_interface = {
	"wl_subcompositor", 1,
	2, wl_subcompositor_requests,
	0, NULL,
};

static const struct wl_message wl_subsurface_requests[] = {
	{ "destroy", "", wayland_types + 0 },
	{ "set_position", "ii", wayland_types + 0 },
	{ "place_above", "o", wayland_types + 93 },
	{ "place_below", "o", wayland_types + 94 },
	{ "set_sync", "", wayland_types + 0 },
	{ "set_desync", "", wayland_types + 0 },
};

WL_EXPORT const struct wl_interface wl_subsurface_interface = {
	"wl_subsurface", 1,
	6, wl_subsurface_requests,
	0, NULL,
};


/*
 * Copyright © 2011 Intel Corporation
 * Copyright © 2021 Collabora, Ltd.
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

#pragma once

#include <xcb/xcb.h>

#define SEND_EVENT_MASK (0x80)
#define EVENT_TYPE(event) ((event)->response_type & ~SEND_EVENT_MASK)

struct atom_x11 {
	xcb_atom_t		 wm_protocols;
	xcb_atom_t		 wm_normal_hints;
	xcb_atom_t		 wm_take_focus;
	xcb_atom_t		 wm_delete_window;
	xcb_atom_t		 wm_state;
	xcb_atom_t		 wm_s0;
	xcb_atom_t		 wm_client_machine;
	xcb_atom_t		 wm_change_state;
	xcb_atom_t		 net_frame_extents;
	xcb_atom_t		 net_wm_cm_s0;
	xcb_atom_t		 net_wm_name;
	xcb_atom_t		 net_wm_pid;
	xcb_atom_t		 net_wm_icon;
	xcb_atom_t		 net_wm_state;
	xcb_atom_t		 net_wm_state_maximized_vert;
	xcb_atom_t		 net_wm_state_maximized_horz;
	xcb_atom_t		 net_wm_state_fullscreen;
	xcb_atom_t		 net_wm_user_time;
	xcb_atom_t		 net_wm_icon_name;
	xcb_atom_t		 net_wm_desktop;
	xcb_atom_t		 net_wm_window_type;
	xcb_atom_t		 net_wm_window_type_desktop;
	xcb_atom_t		 net_wm_window_type_dock;
	xcb_atom_t		 net_wm_window_type_toolbar;
	xcb_atom_t		 net_wm_window_type_menu;
	xcb_atom_t		 net_wm_window_type_utility;
	xcb_atom_t		 net_wm_window_type_splash;
	xcb_atom_t		 net_wm_window_type_dialog;
	xcb_atom_t		 net_wm_window_type_dropdown;
	xcb_atom_t		 net_wm_window_type_popup;
	xcb_atom_t		 net_wm_window_type_tooltip;
	xcb_atom_t		 net_wm_window_type_notification;
	xcb_atom_t		 net_wm_window_type_combo;
	xcb_atom_t		 net_wm_window_type_dnd;
	xcb_atom_t		 net_wm_window_type_normal;
	xcb_atom_t		 net_wm_moveresize;
	xcb_atom_t		 net_supporting_wm_check;
	xcb_atom_t		 net_supported;
	xcb_atom_t		 net_active_window;
	xcb_atom_t		 motif_wm_hints;
	xcb_atom_t		 clipboard;
	xcb_atom_t		 clipboard_manager;
	xcb_atom_t		 targets;
	xcb_atom_t		 utf8_string;
	xcb_atom_t		 wl_selection;
	xcb_atom_t		 incr;
	xcb_atom_t		 timestamp;
	xcb_atom_t		 multiple;
	xcb_atom_t		 compound_text;
	xcb_atom_t		 text;
	xcb_atom_t		 string;
	xcb_atom_t		 window;
	xcb_atom_t		 text_plain_utf8;
	xcb_atom_t		 text_plain;
	xcb_atom_t		 xdnd_selection;
	xcb_atom_t		 xdnd_aware;
	xcb_atom_t		 xdnd_enter;
	xcb_atom_t		 xdnd_leave;
	xcb_atom_t		 xdnd_drop;
	xcb_atom_t		 xdnd_status;
	xcb_atom_t		 xdnd_finished;
	xcb_atom_t		 xdnd_type_list;
	xcb_atom_t		 xdnd_action_copy;
	xcb_atom_t		 wl_surface_id;
	xcb_atom_t		 allow_commits;
	xcb_atom_t		 weston_focus_ping;
};

const char *
get_atom_name(xcb_connection_t *c, xcb_atom_t atom);

void
x11_get_atoms(xcb_connection_t *connection, struct atom_x11 *atom);

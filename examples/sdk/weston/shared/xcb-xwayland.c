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
#include "config.h"

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <stddef.h>
#include <assert.h>

#include "shared/helpers.h"
#include "xcb-xwayland.h"

const char *
get_atom_name(xcb_connection_t *c, xcb_atom_t atom)
{
	xcb_get_atom_name_cookie_t cookie;
	xcb_get_atom_name_reply_t *reply;
	xcb_generic_error_t *e;
	static char buffer[64];

	if (atom == XCB_ATOM_NONE)
		return "None";

	cookie = xcb_get_atom_name(c, atom);
	reply = xcb_get_atom_name_reply(c, cookie, &e);

	if (reply) {
		snprintf(buffer, sizeof buffer, "%.*s",
			 xcb_get_atom_name_name_length(reply),
			 xcb_get_atom_name_name(reply));
	} else {
		snprintf(buffer, sizeof buffer, "(atom %u)", atom);
	}

	free(reply);

	return buffer;
}

void
x11_get_atoms(xcb_connection_t *connection, struct atom_x11 *atom)
{
	unsigned int i;

#define F(field) offsetof(struct atom_x11, field)

	static const struct { const char *name; int offset; } atoms[] = {
		{ "WM_PROTOCOLS",			F(wm_protocols) },
		{ "WM_NORMAL_HINTS",			F(wm_normal_hints) },
		{ "WM_TAKE_FOCUS",			F(wm_take_focus) },
		{ "WM_DELETE_WINDOW",			F(wm_delete_window) },
		{ "WM_STATE",				F(wm_state) },
		{ "WM_S0",				F(wm_s0) },
		{ "WM_CLIENT_MACHINE",			F(wm_client_machine) },
		{ "WM_CHANGE_STATE",			F(wm_change_state) },
		{ "_NET_FRAME_EXTENTS",			F(net_frame_extents) },
		{ "_NET_WM_CM_S0",			F(net_wm_cm_s0) },
		{ "_NET_WM_NAME",			F(net_wm_name) },
		{ "_NET_WM_PID",			F(net_wm_pid) },
		{ "_NET_WM_ICON",			F(net_wm_icon) },
		{ "_NET_WM_STATE",			F(net_wm_state) },
		{ "_NET_WM_STATE_MAXIMIZED_VERT", 	F(net_wm_state_maximized_vert) },
		{ "_NET_WM_STATE_MAXIMIZED_HORZ", 	F(net_wm_state_maximized_horz) },
		{ "_NET_WM_STATE_FULLSCREEN", 		F(net_wm_state_fullscreen) },
		{ "_NET_WM_USER_TIME", 			F(net_wm_user_time) },
		{ "_NET_WM_ICON_NAME", 			F(net_wm_icon_name) },
		{ "_NET_WM_DESKTOP", 			F(net_wm_desktop) },
		{ "_NET_WM_WINDOW_TYPE", 		F(net_wm_window_type) },

		{ "_NET_WM_WINDOW_TYPE_DESKTOP", 	F(net_wm_window_type_desktop) },
		{ "_NET_WM_WINDOW_TYPE_DOCK", 		F(net_wm_window_type_dock) },
		{ "_NET_WM_WINDOW_TYPE_TOOLBAR", 	F(net_wm_window_type_toolbar) },
		{ "_NET_WM_WINDOW_TYPE_MENU", 		F(net_wm_window_type_menu) },
		{ "_NET_WM_WINDOW_TYPE_UTILITY", 	F(net_wm_window_type_utility) },
		{ "_NET_WM_WINDOW_TYPE_SPLASH", 	F(net_wm_window_type_splash) },
		{ "_NET_WM_WINDOW_TYPE_DIALOG", 	F(net_wm_window_type_dialog) },
		{ "_NET_WM_WINDOW_TYPE_DROPDOWN_MENU", 	F(net_wm_window_type_dropdown) },
		{ "_NET_WM_WINDOW_TYPE_POPUP_MENU", 	F(net_wm_window_type_popup) },
		{ "_NET_WM_WINDOW_TYPE_TOOLTIP", 	F(net_wm_window_type_tooltip) },
		{ "_NET_WM_WINDOW_TYPE_NOTIFICATION", 	F(net_wm_window_type_notification) },
		{ "_NET_WM_WINDOW_TYPE_COMBO", 		F(net_wm_window_type_combo) },
		{ "_NET_WM_WINDOW_TYPE_DND", 		F(net_wm_window_type_dnd) },
		{ "_NET_WM_WINDOW_TYPE_NORMAL",		F(net_wm_window_type_normal) },

		{ "_NET_WM_MOVERESIZE", 		F(net_wm_moveresize) },
		{ "_NET_SUPPORTING_WM_CHECK", 		F(net_supporting_wm_check) },

		{ "_NET_SUPPORTED",     		F(net_supported) },
		{ "_NET_ACTIVE_WINDOW",     		F(net_active_window) },
		{ "_MOTIF_WM_HINTS",			F(motif_wm_hints) },
		{ "CLIPBOARD",				F(clipboard) },
		{ "CLIPBOARD_MANAGER",			F(clipboard_manager) },
		{ "TARGETS",				F(targets) },
		{ "UTF8_STRING",			F(utf8_string) },
		{ "_WL_SELECTION",			F(wl_selection) },
		{ "INCR",				F(incr) },
		{ "TIMESTAMP",				F(timestamp) },
		{ "MULTIPLE",				F(multiple) },
		{ "UTF8_STRING"	,			F(utf8_string) },
		{ "COMPOUND_TEXT",			F(compound_text) },
		{ "TEXT",				F(text) },
		{ "STRING",				F(string) },
		{ "WINDOW",				F(window) },
                { "text/plain;charset=utf-8",   	F(text_plain_utf8) },
                { "text/plain",         		F(text_plain) },
                { "XdndSelection",      		F(xdnd_selection) },
                { "XdndAware",          		F(xdnd_aware) },
                { "XdndEnter",          		F(xdnd_enter) },
                { "XdndLeave",          		F(xdnd_leave) },
                { "XdndDrop",           		F(xdnd_drop) },
                { "XdndStatus",         		F(xdnd_status) },
                { "XdndFinished",       		F(xdnd_finished) },
                { "XdndTypeList",       		F(xdnd_type_list) },
                { "XdndActionCopy",     		F(xdnd_action_copy) },
                { "_XWAYLAND_ALLOW_COMMITS",    	F(allow_commits) },
		{ "WL_SURFACE_ID",			F(wl_surface_id) },
		{ "_WESTON_FOCUS_PING",			F(weston_focus_ping) },
	};

	xcb_intern_atom_cookie_t cookies[ARRAY_LENGTH(atoms)];

	for (i = 0; i < ARRAY_LENGTH(atoms); i++)
		cookies[i] =
			xcb_intern_atom(connection, 0, strlen(atoms[i].name), atoms[i].name);

	for (i = 0; i < ARRAY_LENGTH(atoms); i++) {
		xcb_intern_atom_reply_t *reply_atom;
		reply_atom = xcb_intern_atom_reply(connection, cookies[i], NULL);
		assert(reply_atom);

		xcb_atom_t rr_atom = reply_atom->atom;
		*(xcb_atom_t *) ((char *) atom + atoms[i].offset) = rr_atom;

		free(reply_atom);
	}
}

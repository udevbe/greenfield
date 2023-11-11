/*
 * Copyright © 2012 Openismus GmbH
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

#include <assert.h>
#include <errno.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <unistd.h>

#include <linux/input.h>
#include <cairo.h>

#include <pango/pangocairo.h>

#include <libweston/config-parser.h>
#include "shared/helpers.h"
#include "shared/xalloc.h"
#include "window.h"
#include "text-input-unstable-v1-client-protocol.h"

struct text_entry {
	struct widget *widget;
	struct window *window;
	char *text;
	int active;
	bool panel_visible;
	uint32_t cursor;
	uint32_t anchor;
	struct {
		char *text;
		int32_t cursor;
		char *commit;
		PangoAttrList *attr_list;
	} preedit;
	struct {
		PangoAttrList *attr_list;
		int32_t cursor;
	} preedit_info;
	struct {
		int32_t cursor;
		int32_t anchor;
		uint32_t delete_index;
		uint32_t delete_length;
		bool invalid_delete;
	} pending_commit;
	struct zwp_text_input_v1 *text_input;
	PangoLayout *layout;
	struct {
		xkb_mod_mask_t shift_mask;
	} keysym;
	uint32_t serial;
	uint32_t reset_serial;
	uint32_t content_purpose;
	bool click_to_show;
	char *preferred_language;
	bool button_pressed;
};

struct editor {
	struct zwp_text_input_manager_v1 *text_input_manager;
	struct wl_data_source *selection;
	char *selected_text;
	struct display *display;
	struct window *window;
	struct widget *widget;
	struct text_entry *entry;
	struct text_entry *editor;
	struct text_entry *active_entry;
};

static const char *
utf8_end_char(const char *p)
{
	while ((*p & 0xc0) == 0x80)
		p++;
	return p;
}

static const char *
utf8_prev_char(const char *s, const char *p)
{
	for (--p; p >= s; --p) {
		if ((*p & 0xc0) != 0x80)
			return p;
	}
	return NULL;
}

static const char *
utf8_next_char(const char *p)
{
	if (*p != 0)
		return utf8_end_char(++p);
	return NULL;
}

static void
move_up(const char *p, uint32_t *cursor)
{
	const char *posr, *posr_i;
	char text[16];

	xkb_keysym_to_utf8(XKB_KEY_Return, text, sizeof(text));

	posr = strstr(p, text);
	while (posr) {
		if (*cursor > (unsigned)(posr-p)) {
			posr_i = strstr(posr+1, text);
			if (!posr_i || !(*cursor > (unsigned)(posr_i-p))) {
				*cursor = posr-p;
				break;
			}
			posr = posr_i;
		} else {
			break;
		}
	}
}

static void
move_down(const char *p, uint32_t *cursor)
{
	const char *posr;
	char text[16];

	xkb_keysym_to_utf8(XKB_KEY_Return, text, sizeof(text));

	posr = strstr(p, text);
	while (posr) {
		if (*cursor <= (unsigned)(posr-p)) {
			*cursor = posr-p + 1;
			break;
		}
		posr = strstr(posr+1, text);
	}
}

static void text_entry_redraw_handler(struct widget *widget, void *data);
static void text_entry_button_handler(struct widget *widget,
				      struct input *input, uint32_t time,
				      uint32_t button,
				      enum wl_pointer_button_state state, void *data);
static void text_entry_touch_handler(struct widget *widget, struct input *input,
				     uint32_t serial, uint32_t time, int32_t id,
				     float tx, float ty, void *data);
static int text_entry_motion_handler(struct widget *widget,
				     struct input *input, uint32_t time,
				     float x, float y, void *data);
static void text_entry_insert_at_cursor(struct text_entry *entry, const char *text,
					int32_t cursor, int32_t anchor);
static void text_entry_set_preedit(struct text_entry *entry,
				   const char *preedit_text,
				   int preedit_cursor);
static void text_entry_delete_text(struct text_entry *entry,
				   uint32_t index, uint32_t length);
static void text_entry_delete_selected_text(struct text_entry *entry);
static void text_entry_reset_preedit(struct text_entry *entry);
static void text_entry_commit_and_reset(struct text_entry *entry);
static void text_entry_get_cursor_rectangle(struct text_entry *entry, struct rectangle *rectangle);
static void text_entry_update(struct text_entry *entry);

static void
text_input_commit_string(void *data,
			 struct zwp_text_input_v1 *text_input,
			 uint32_t serial,
			 const char *text)
{
	struct text_entry *entry = data;

	if ((entry->serial - serial) > (entry->serial - entry->reset_serial)) {
		fprintf(stderr, "Ignore commit. Serial: %u, Current: %u, Reset: %u\n",
			serial, entry->serial, entry->reset_serial);
		return;
	}

	if (entry->pending_commit.invalid_delete) {
		fprintf(stderr, "Ignore commit. Invalid previous delete_surrounding event.\n");
		memset(&entry->pending_commit, 0, sizeof entry->pending_commit);
		return;
	}

	text_entry_reset_preedit(entry);

	if (entry->pending_commit.delete_length) {
		text_entry_delete_text(entry,
				       entry->pending_commit.delete_index,
				       entry->pending_commit.delete_length);
	} else {
		text_entry_delete_selected_text(entry);
	}

	text_entry_insert_at_cursor(entry, text,
				    entry->pending_commit.cursor,
				    entry->pending_commit.anchor);

	memset(&entry->pending_commit, 0, sizeof entry->pending_commit);

	widget_schedule_redraw(entry->widget);
}

static void
clear_pending_preedit(struct text_entry *entry)
{
	memset(&entry->pending_commit, 0, sizeof entry->pending_commit);

	pango_attr_list_unref(entry->preedit_info.attr_list);

	entry->preedit_info.cursor = 0;
	entry->preedit_info.attr_list = NULL;

	memset(&entry->preedit_info, 0, sizeof entry->preedit_info);
}

static void
text_input_preedit_string(void *data,
			  struct zwp_text_input_v1 *text_input,
			  uint32_t serial,
			  const char *text,
			  const char *commit)
{
	struct text_entry *entry = data;

	if ((entry->serial - serial) > (entry->serial - entry->reset_serial)) {
		fprintf(stderr, "Ignore preedit_string. Serial: %u, Current: %u, Reset: %u\n",
			serial, entry->serial, entry->reset_serial);
		clear_pending_preedit(entry);
		return;
	}

	if (entry->pending_commit.invalid_delete) {
		fprintf(stderr, "Ignore preedit_string. Invalid previous delete_surrounding event.\n");
		clear_pending_preedit(entry);
		return;
	}

	if (entry->pending_commit.delete_length) {
		text_entry_delete_text(entry,
				       entry->pending_commit.delete_index,
				       entry->pending_commit.delete_length);
	} else {
		text_entry_delete_selected_text(entry);
	}

	text_entry_set_preedit(entry, text, entry->preedit_info.cursor);
	entry->preedit.commit = strdup(commit);
	entry->preedit.attr_list = pango_attr_list_ref(entry->preedit_info.attr_list);

	clear_pending_preedit(entry);

	text_entry_update(entry);

	widget_schedule_redraw(entry->widget);
}

static void
text_input_delete_surrounding_text(void *data,
				   struct zwp_text_input_v1 *text_input,
				   int32_t index,
				   uint32_t length)
{
	struct text_entry *entry = data;
	uint32_t text_length;

	entry->pending_commit.delete_index = entry->cursor + index;
	entry->pending_commit.delete_length = length;
	entry->pending_commit.invalid_delete = false;

	text_length = strlen(entry->text);

	if (entry->pending_commit.delete_index > text_length ||
	    length > text_length ||
	    entry->pending_commit.delete_index + length > text_length) {
		fprintf(stderr, "delete_surrounding_text: Invalid index: %d," \
			"length %u'; cursor: %u text length: %u\n", index, length, entry->cursor, text_length);
		entry->pending_commit.invalid_delete = true;
		return;
	}
}

static void
text_input_cursor_position(void *data,
			   struct zwp_text_input_v1 *text_input,
			   int32_t index,
			   int32_t anchor)
{
	struct text_entry *entry = data;

	entry->pending_commit.cursor = index;
	entry->pending_commit.anchor = anchor;
}

static void
text_input_preedit_styling(void *data,
			   struct zwp_text_input_v1 *text_input,
			   uint32_t index,
			   uint32_t length,
			   uint32_t style)
{
	struct text_entry *entry = data;
	PangoAttribute *attr1 = NULL;
	PangoAttribute *attr2 = NULL;

	if (!entry->preedit_info.attr_list)
		entry->preedit_info.attr_list = pango_attr_list_new();

	switch (style) {
		case ZWP_TEXT_INPUT_V1_PREEDIT_STYLE_DEFAULT:
		case ZWP_TEXT_INPUT_V1_PREEDIT_STYLE_UNDERLINE:
			attr1 = pango_attr_underline_new(PANGO_UNDERLINE_SINGLE);
			break;
		case ZWP_TEXT_INPUT_V1_PREEDIT_STYLE_INCORRECT:
			attr1 = pango_attr_underline_new(PANGO_UNDERLINE_ERROR);
			attr2 = pango_attr_underline_color_new(65535, 0, 0);
			break;
		case ZWP_TEXT_INPUT_V1_PREEDIT_STYLE_SELECTION:
			attr1 = pango_attr_background_new(0.3 * 65535, 0.3 * 65535, 65535);
			attr2 = pango_attr_foreground_new(65535, 65535, 65535);
			break;
		case ZWP_TEXT_INPUT_V1_PREEDIT_STYLE_HIGHLIGHT:
		case ZWP_TEXT_INPUT_V1_PREEDIT_STYLE_ACTIVE:
			attr1 = pango_attr_underline_new(PANGO_UNDERLINE_SINGLE);
			attr2 = pango_attr_weight_new(PANGO_WEIGHT_BOLD);
			break;
		case ZWP_TEXT_INPUT_V1_PREEDIT_STYLE_INACTIVE:
			attr1 = pango_attr_underline_new(PANGO_UNDERLINE_SINGLE);
			attr2 = pango_attr_foreground_new(0.3 * 65535, 0.3 * 65535, 0.3 * 65535);
			break;
	}

	if (attr1) {
		attr1->start_index = entry->cursor + index;
		attr1->end_index = entry->cursor + index + length;
		pango_attr_list_insert(entry->preedit_info.attr_list, attr1);
	}

	if (attr2) {
		attr2->start_index = entry->cursor + index;
		attr2->end_index = entry->cursor + index + length;
		pango_attr_list_insert(entry->preedit_info.attr_list, attr2);
	}
}

static void
text_input_preedit_cursor(void *data,
			  struct zwp_text_input_v1 *text_input,
			  int32_t index)
{
	struct text_entry *entry = data;

	entry->preedit_info.cursor = index;
}

static void
text_input_modifiers_map(void *data,
			 struct zwp_text_input_v1 *text_input,
			 struct wl_array *map)
{
	struct text_entry *entry = data;

	entry->keysym.shift_mask = keysym_modifiers_get_mask(map, "Shift");
}

static void
text_input_keysym(void *data,
		  struct zwp_text_input_v1 *text_input,
		  uint32_t serial,
		  uint32_t time,
		  uint32_t key,
		  uint32_t state,
		  uint32_t modifiers)
{
	struct text_entry *entry = data;
	const char *new_char;

	if (key == XKB_KEY_Left ||
	    key == XKB_KEY_Right) {
		if (state != WL_KEYBOARD_KEY_STATE_RELEASED)
			return;

		if (key == XKB_KEY_Left)
			new_char = utf8_prev_char(entry->text, entry->text + entry->cursor);
		else
			new_char = utf8_next_char(entry->text + entry->cursor);

		if (new_char != NULL) {
			entry->cursor = new_char - entry->text;
		}

		if (!(modifiers & entry->keysym.shift_mask))
			entry->anchor = entry->cursor;
		widget_schedule_redraw(entry->widget);

		return;
	}

	if (key == XKB_KEY_Up ||
	    key == XKB_KEY_Down) {
		if (state != WL_KEYBOARD_KEY_STATE_RELEASED)
			return;

		if (key == XKB_KEY_Up)
			move_up(entry->text, &entry->cursor);
		else
			move_down(entry->text, &entry->cursor);

		if (!(modifiers & entry->keysym.shift_mask))
			entry->anchor = entry->cursor;
		widget_schedule_redraw(entry->widget);

		return;
	}

	if (key == XKB_KEY_BackSpace) {
		const char *start, *end;

		if (state != WL_KEYBOARD_KEY_STATE_RELEASED)
			return;

		text_entry_commit_and_reset(entry);

		start = utf8_prev_char(entry->text, entry->text + entry->cursor);
		if (start == NULL)
			return;

		end = utf8_next_char(start);

		text_entry_delete_text(entry,
				       start - entry->text,
				       end - start);

		return;
	}

	if (key == XKB_KEY_Tab ||
	    key == XKB_KEY_KP_Enter ||
	    key == XKB_KEY_Return) {
		char text[16];

		if (state != WL_KEYBOARD_KEY_STATE_RELEASED)
			return;

		xkb_keysym_to_utf8(key, text, sizeof(text));

		text_entry_insert_at_cursor(entry, text, 0, 0);

		return;
	}
}

static void
text_input_enter(void *data,
		 struct zwp_text_input_v1 *text_input,
		 struct wl_surface *surface)
{
	struct text_entry *entry = data;

	if (surface != window_get_wl_surface(entry->window))
		return;

	entry->active++;

	text_entry_update(entry);
	entry->reset_serial = entry->serial;

	widget_schedule_redraw(entry->widget);
}

static void
text_input_leave(void *data,
		 struct zwp_text_input_v1 *text_input)
{
	struct text_entry *entry = data;

	text_entry_commit_and_reset(entry);
	entry->active--;

	if (!entry->active) {
		zwp_text_input_v1_hide_input_panel(text_input);
		entry->panel_visible = false;
	}

	widget_schedule_redraw(entry->widget);
}

static void
text_input_input_panel_state(void *data,
			     struct zwp_text_input_v1 *text_input,
			     uint32_t state)
{
}

static void
text_input_language(void *data,
		    struct zwp_text_input_v1 *text_input,
		    uint32_t serial,
		    const char *language)
{
	fprintf(stderr, "input language is %s \n", language);
}

static void
text_input_text_direction(void *data,
			  struct zwp_text_input_v1 *text_input,
			  uint32_t serial,
			  uint32_t direction)
{
	struct text_entry *entry = data;
	PangoContext *context = pango_layout_get_context(entry->layout);
	PangoDirection pango_direction;


	switch (direction) {
		case ZWP_TEXT_INPUT_V1_TEXT_DIRECTION_LTR:
			pango_direction = PANGO_DIRECTION_LTR;
			break;
		case ZWP_TEXT_INPUT_V1_TEXT_DIRECTION_RTL:
			pango_direction = PANGO_DIRECTION_RTL;
			break;
		case ZWP_TEXT_INPUT_V1_TEXT_DIRECTION_AUTO:
		default:
			pango_direction = PANGO_DIRECTION_NEUTRAL;
	}

	pango_context_set_base_dir(context, pango_direction);
}

static const struct zwp_text_input_v1_listener text_input_listener = {
	text_input_enter,
	text_input_leave,
	text_input_modifiers_map,
	text_input_input_panel_state,
	text_input_preedit_string,
	text_input_preedit_styling,
	text_input_preedit_cursor,
	text_input_commit_string,
	text_input_cursor_position,
	text_input_delete_surrounding_text,
	text_input_keysym,
	text_input_language,
	text_input_text_direction
};

static void
data_source_target(void *data,
		   struct wl_data_source *source, const char *mime_type)
{
}

static void
data_source_send(void *data,
		 struct wl_data_source *source,
		 const char *mime_type, int32_t fd)
{
	struct editor *editor = data;

	if (write(fd, editor->selected_text, strlen(editor->selected_text) + 1) < 0)
		fprintf(stderr, "write failed: %s\n", strerror(errno));

	close(fd);
}

static void
data_source_cancelled(void *data, struct wl_data_source *source)
{
	wl_data_source_destroy(source);
}

static const struct wl_data_source_listener data_source_listener = {
	data_source_target,
	data_source_send,
	data_source_cancelled
};

static void
paste_func(void *buffer, size_t len,
	   int32_t x, int32_t y, void *data)
{
	struct editor *editor = data;
	struct text_entry *entry = editor->active_entry;
	char *pasted_text;

	if (!entry)
		return;

	pasted_text = malloc(len + 1);
	strncpy(pasted_text, buffer, len);
	pasted_text[len] = '\0';

	text_entry_insert_at_cursor(entry, pasted_text, 0, 0);

	free(pasted_text);
}

static void
editor_copy_cut(struct editor *editor, struct input *input, bool cut)
{
	struct text_entry *entry = editor->active_entry;

	if (!entry)
		return;

	if (entry->cursor != entry->anchor) {
		int start_index = MIN(entry->cursor, entry->anchor);
		int end_index = MAX(entry->cursor, entry->anchor);
		int len = end_index - start_index;

		editor->selected_text = realloc(editor->selected_text, len + 1);
		strncpy(editor->selected_text, &entry->text[start_index], len);
		editor->selected_text[len] = '\0';

		if (cut)
			text_entry_delete_text(entry, start_index, len);

		editor->selection =
			display_create_data_source(editor->display);
		if (!editor->selection)
			return;

		wl_data_source_offer(editor->selection,
				     "text/plain;charset=utf-8");
		wl_data_source_add_listener(editor->selection,
					    &data_source_listener, editor);
		input_set_selection(input, editor->selection,
				    display_get_serial(editor->display));
	}
}

static void
editor_paste(struct editor *editor, struct input *input)
{
	input_receive_selection_data(input,
				     "text/plain;charset=utf-8",
				     paste_func, editor);
}

static void
menu_func(void *data, struct input *input, int index)
{
	struct window *window = data;
	struct editor *editor = window_get_user_data(window);

	fprintf(stderr, "picked entry %d\n", index);

	switch (index) {
	case 0:
		editor_copy_cut(editor, input, true);
		break;
	case 1:
		editor_copy_cut(editor, input, false);
		break;
	case 2:
		editor_paste(editor, input);
		break;
	}
}

static void
show_menu(struct editor *editor, struct input *input, uint32_t time)
{
	int32_t x, y;
	static const char *entries[] = {
		"Cut", "Copy", "Paste"
	};

	input_get_position(input, &x, &y);
	window_show_menu(editor->display, input, time, editor->window,
			 x + 10, y + 20, menu_func,
			 entries, ARRAY_LENGTH(entries));
}

static struct text_entry*
text_entry_create(struct editor *editor, const char *text)
{
	struct text_entry *entry;

	entry = xzalloc(sizeof *entry);

	entry->widget = widget_add_widget(editor->widget, entry);
	entry->window = editor->window;
	entry->text = strdup(text);
	entry->active = 0;
	entry->panel_visible = false;
	entry->cursor = strlen(text);
	entry->anchor = entry->cursor;
	entry->text_input =
		zwp_text_input_manager_v1_create_text_input(editor->text_input_manager);
	zwp_text_input_v1_add_listener(entry->text_input,
				       &text_input_listener, entry);

	widget_set_redraw_handler(entry->widget, text_entry_redraw_handler);
	widget_set_button_handler(entry->widget, text_entry_button_handler);
	widget_set_motion_handler(entry->widget, text_entry_motion_handler);
	widget_set_touch_down_handler(entry->widget, text_entry_touch_handler);

	return entry;
}

static void
text_entry_destroy(struct text_entry *entry)
{
	widget_destroy(entry->widget);
	zwp_text_input_v1_destroy(entry->text_input);
	g_clear_object(&entry->layout);
	free(entry->text);
	free(entry->preferred_language);
	free(entry);
}

static void
redraw_handler(struct widget *widget, void *data)
{
	struct editor *editor = data;
	cairo_surface_t *surface;
	struct rectangle allocation;
	cairo_t *cr;

	surface = window_get_surface(editor->window);
	widget_get_allocation(editor->widget, &allocation);

	cr = cairo_create(surface);
	cairo_rectangle(cr, allocation.x, allocation.y, allocation.width, allocation.height);
	cairo_clip(cr);

	cairo_translate(cr, allocation.x, allocation.y);

	/* Draw background */
	cairo_push_group(cr);
	cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);
	cairo_set_source_rgba(cr, 1, 1, 1, 1);
	cairo_rectangle(cr, 0, 0, allocation.width, allocation.height);
	cairo_fill(cr);

	cairo_pop_group_to_source(cr);
	cairo_paint(cr);

	cairo_destroy(cr);
	cairo_surface_destroy(surface);
}

static void
text_entry_allocate(struct text_entry *entry, int32_t x, int32_t y,
		    int32_t width, int32_t height)
{
	widget_set_allocation(entry->widget, x, y, width, height);
}

static void
resize_handler(struct widget *widget,
	       int32_t width, int32_t height, void *data)
{
	struct editor *editor = data;
	struct rectangle allocation;

	widget_get_allocation(editor->widget, &allocation);

	text_entry_allocate(editor->entry,
			    allocation.x + 20, allocation.y + 20,
			    width - 40, height / 2 - 40);
	text_entry_allocate(editor->editor,
			    allocation.x + 20, allocation.y + height / 2 + 20,
			    width - 40, height / 2 - 40);
}

static void
text_entry_activate(struct text_entry *entry,
		    struct wl_seat *seat)
{
	struct wl_surface *surface = window_get_wl_surface(entry->window);

	if (entry->click_to_show && entry->active) {
		entry->panel_visible = !entry->panel_visible;

		if (entry->panel_visible)
			zwp_text_input_v1_show_input_panel(entry->text_input);
		else
			zwp_text_input_v1_hide_input_panel(entry->text_input);

		return;
	}

	if (!entry->click_to_show)
		zwp_text_input_v1_show_input_panel(entry->text_input);

	zwp_text_input_v1_activate(entry->text_input,
				   seat,
				   surface);
}

static void
text_entry_deactivate(struct text_entry *entry,
		      struct wl_seat *seat)
{
	zwp_text_input_v1_deactivate(entry->text_input,
				     seat);
}

static void
text_entry_update_layout(struct text_entry *entry)
{
	char *text;
	PangoAttrList *attr_list;

	assert(entry->cursor <= (strlen(entry->text) +
	       (entry->preedit.text ? strlen(entry->preedit.text) : 0)));

	if (entry->preedit.text) {
		text = xmalloc(strlen(entry->text) + strlen(entry->preedit.text) + 1);
		strncpy(text, entry->text, entry->cursor);
		strcpy(text + entry->cursor, entry->preedit.text);
		strcpy(text + entry->cursor + strlen(entry->preedit.text),
		       entry->text + entry->cursor);
	} else {
		text = strdup(entry->text);
	}

	if (entry->cursor != entry->anchor) {
		int start_index = MIN(entry->cursor, entry->anchor);
		int end_index = MAX(entry->cursor, entry->anchor);
		PangoAttribute *attr;

		attr_list = pango_attr_list_copy(entry->preedit.attr_list);

		if (!attr_list)
			attr_list = pango_attr_list_new();

		attr = pango_attr_background_new(0.3 * 65535, 0.3 * 65535, 65535);
		attr->start_index = start_index;
		attr->end_index = end_index;
		pango_attr_list_insert(attr_list, attr);

		attr = pango_attr_foreground_new(65535, 65535, 65535);
		attr->start_index = start_index;
		attr->end_index = end_index;
		pango_attr_list_insert(attr_list, attr);
	} else {
		attr_list = pango_attr_list_ref(entry->preedit.attr_list);
	}

	if (entry->preedit.text && !entry->preedit.attr_list) {
		PangoAttribute *attr;

		if (!attr_list)
			attr_list = pango_attr_list_new();

		attr = pango_attr_underline_new(PANGO_UNDERLINE_SINGLE);
		attr->start_index = entry->cursor;
		attr->end_index = entry->cursor + strlen(entry->preedit.text);
		pango_attr_list_insert(attr_list, attr);
	}

	if (entry->layout) {
		pango_layout_set_text(entry->layout, text, -1);
		pango_layout_set_attributes(entry->layout, attr_list);
	}

	free(text);
	pango_attr_list_unref(attr_list);
}

static void
text_entry_update(struct text_entry *entry)
{
	struct rectangle cursor_rectangle;

	zwp_text_input_v1_set_content_type(entry->text_input,
					   ZWP_TEXT_INPUT_V1_CONTENT_HINT_NONE,
					   entry->content_purpose);

	zwp_text_input_v1_set_surrounding_text(entry->text_input,
					       entry->text,
					       entry->cursor,
					       entry->anchor);

	if (entry->preferred_language)
		zwp_text_input_v1_set_preferred_language(entry->text_input,
							 entry->preferred_language);

	text_entry_get_cursor_rectangle(entry, &cursor_rectangle);
	zwp_text_input_v1_set_cursor_rectangle(entry->text_input,
					       cursor_rectangle.x,
					       cursor_rectangle.y,
					       cursor_rectangle.width,
					       cursor_rectangle.height);

	zwp_text_input_v1_commit_state(entry->text_input, ++entry->serial);
}

static void
text_entry_insert_at_cursor(struct text_entry *entry, const char *text,
			    int32_t cursor, int32_t anchor)
{
	char *new_text = xmalloc(strlen(entry->text) + strlen(text) + 1);

	strncpy(new_text, entry->text, entry->cursor);
	strcpy(new_text + entry->cursor, text);
	strcpy(new_text + entry->cursor + strlen(text),
	       entry->text + entry->cursor);

	free(entry->text);
	entry->text = new_text;
	if (anchor >= 0)
		entry->anchor = entry->cursor + strlen(text) + anchor;
	else
		entry->anchor = entry->cursor + 1 + anchor;

	if (cursor >= 0)
		entry->cursor += strlen(text) + cursor;
	else
		entry->cursor += 1 + cursor;

	text_entry_update_layout(entry);

	widget_schedule_redraw(entry->widget);

	text_entry_update(entry);
}

static void
text_entry_reset_preedit(struct text_entry *entry)
{
	entry->preedit.cursor = 0;

	free(entry->preedit.text);
	entry->preedit.text = NULL;

	free(entry->preedit.commit);
	entry->preedit.commit = NULL;

	pango_attr_list_unref(entry->preedit.attr_list);
	entry->preedit.attr_list = NULL;
}

static void
text_entry_commit_and_reset(struct text_entry *entry)
{
	char *commit = NULL;

	if (entry->preedit.commit)
		commit = strdup(entry->preedit.commit);

	text_entry_reset_preedit(entry);
	if (commit) {
		text_entry_insert_at_cursor(entry, commit, 0, 0);
		free(commit);
	}

	zwp_text_input_v1_reset(entry->text_input);
	text_entry_update(entry);
	entry->reset_serial = entry->serial;
}

static void
text_entry_set_preedit(struct text_entry *entry,
		       const char *preedit_text,
		       int preedit_cursor)
{
	text_entry_reset_preedit(entry);

	if (!preedit_text)
		return;

	entry->preedit.text = strdup(preedit_text);
	entry->preedit.cursor = preedit_cursor;

	text_entry_update_layout(entry);

	widget_schedule_redraw(entry->widget);
}

static uint32_t
text_entry_try_invoke_preedit_action(struct text_entry *entry,
				     int32_t x, int32_t y,
				     uint32_t button,
				     enum wl_pointer_button_state state)
{
	int index, trailing;
	uint32_t cursor;
	const char *text;

	if (!entry->preedit.text)
		return 0;

	pango_layout_xy_to_index(entry->layout,
				 x * PANGO_SCALE, y * PANGO_SCALE,
				 &index, &trailing);

	text = pango_layout_get_text(entry->layout);
	cursor = g_utf8_offset_to_pointer(text + index, trailing) - text;

	if (cursor < entry->cursor ||
	    cursor > entry->cursor + strlen(entry->preedit.text)) {
		return 0;
	}

	if (state == WL_POINTER_BUTTON_STATE_RELEASED)
		zwp_text_input_v1_invoke_action(entry->text_input,
						button,
						cursor - entry->cursor);

	return 1;
}

static bool
text_entry_has_preedit(struct text_entry *entry)
{
	return entry->preedit.text && (strlen(entry->preedit.text) > 0);
}

static void
text_entry_set_cursor_position(struct text_entry *entry,
			       int32_t x, int32_t y,
			       bool move_anchor)
{
	int index, trailing;
	const char *text;
	uint32_t cursor;

	pango_layout_xy_to_index(entry->layout,
				 x * PANGO_SCALE, y * PANGO_SCALE,
				 &index, &trailing);

	text = pango_layout_get_text(entry->layout);

	cursor = g_utf8_offset_to_pointer(text + index, trailing) - text;

	if (move_anchor)
		entry->anchor = cursor;

	if (text_entry_has_preedit(entry)) {
		text_entry_commit_and_reset(entry);

		assert(!text_entry_has_preedit(entry));
	}

	if (entry->cursor == cursor)
		return;

	entry->cursor = cursor;

	text_entry_update_layout(entry);

	widget_schedule_redraw(entry->widget);

	text_entry_update(entry);
}

static void
text_entry_delete_text(struct text_entry *entry,
		       uint32_t index, uint32_t length)
{
	uint32_t l;

	assert(index <= strlen(entry->text));
	assert(index + length <= strlen(entry->text));
	assert(index + length >= length);

	l = strlen(entry->text + index + length);
	memmove(entry->text + index,
		entry->text + index + length,
		l + 1);

	if (entry->cursor > (index + length))
		entry->cursor -= length;
	else if (entry->cursor > index)
		entry->cursor = index;

	entry->anchor = entry->cursor;

	text_entry_update_layout(entry);

	widget_schedule_redraw(entry->widget);

	text_entry_update(entry);
}

static void
text_entry_delete_selected_text(struct text_entry *entry)
{
	uint32_t start_index = entry->anchor < entry->cursor ? entry->anchor : entry->cursor;
	uint32_t end_index = entry->anchor < entry->cursor ? entry->cursor : entry->anchor;

	if (entry->anchor == entry->cursor)
		return;

	text_entry_delete_text(entry, start_index, end_index - start_index);

	entry->anchor = entry->cursor;
}

static void
text_entry_get_cursor_rectangle(struct text_entry *entry, struct rectangle *rectangle)
{
	struct rectangle allocation;
	PangoRectangle extents;
	PangoRectangle cursor_pos;

	widget_get_allocation(entry->widget, &allocation);

	if (entry->preedit.text && entry->preedit.cursor < 0) {
		rectangle->x = 0;
		rectangle->y = 0;
		rectangle->width = 0;
		rectangle->height = 0;
		return;
	}


	pango_layout_get_extents(entry->layout, &extents, NULL);
	pango_layout_get_cursor_pos(entry->layout,
				    entry->cursor + entry->preedit.cursor,
				    &cursor_pos, NULL);

	rectangle->x = allocation.x + (allocation.height / 2) + PANGO_PIXELS(cursor_pos.x);
	rectangle->y = allocation.y + 10 + PANGO_PIXELS(cursor_pos.y);
	rectangle->width = PANGO_PIXELS(cursor_pos.width);
	rectangle->height = PANGO_PIXELS(cursor_pos.height);
}

static void
text_entry_draw_cursor(struct text_entry *entry, cairo_t *cr)
{
	PangoRectangle extents;
	PangoRectangle cursor_pos;

	if (entry->preedit.text && entry->preedit.cursor < 0)
		return;

	pango_layout_get_extents(entry->layout, &extents, NULL);
	pango_layout_get_cursor_pos(entry->layout,
				    entry->cursor + entry->preedit.cursor,
				    &cursor_pos, NULL);

	cairo_set_line_width(cr, 1.0);
	cairo_move_to(cr, PANGO_PIXELS(cursor_pos.x), PANGO_PIXELS(cursor_pos.y));
	cairo_line_to(cr, PANGO_PIXELS(cursor_pos.x), PANGO_PIXELS(cursor_pos.y) + PANGO_PIXELS(cursor_pos.height));
	cairo_stroke(cr);
}

static int
text_offset_left(struct rectangle *allocation)
{
	return 10;
}

static int
text_offset_top(struct rectangle *allocation)
{
	return allocation->height / 2;
}

static void
text_entry_redraw_handler(struct widget *widget, void *data)
{
	struct text_entry *entry = data;
	cairo_surface_t *surface;
	struct rectangle allocation;
	cairo_t *cr;

	surface = window_get_surface(entry->window);
	widget_get_allocation(entry->widget, &allocation);

	cr = cairo_create(surface);
	cairo_rectangle(cr, allocation.x, allocation.y, allocation.width, allocation.height);
	cairo_clip(cr);

	cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);

	cairo_push_group(cr);
	cairo_translate(cr, allocation.x, allocation.y);

	cairo_set_source_rgba(cr, 1, 1, 1, 1);
	cairo_rectangle(cr, 0, 0, allocation.width, allocation.height);
	cairo_fill(cr);

	cairo_set_operator(cr, CAIRO_OPERATOR_OVER);

	if (entry->active) {
		cairo_rectangle(cr, 0, 0, allocation.width, allocation.height);
		cairo_set_line_width (cr, 3);
		cairo_set_source_rgba(cr, 0, 0, 1, 1.0);
		cairo_stroke(cr);
	}

	cairo_set_source_rgba(cr, 0, 0, 0, 1);

	cairo_translate(cr,
			text_offset_left(&allocation),
			text_offset_top(&allocation));

	if (!entry->layout)
		entry->layout = pango_cairo_create_layout(cr);
	else
		pango_cairo_update_layout(cr, entry->layout);

	text_entry_update_layout(entry);

	pango_cairo_show_layout(cr, entry->layout);

	text_entry_draw_cursor(entry, cr);

	cairo_pop_group_to_source(cr);
	cairo_paint(cr);

	cairo_destroy(cr);
	cairo_surface_destroy(surface);
}

static int
text_entry_motion_handler(struct widget *widget,
			  struct input *input, uint32_t time,
			  float x, float y, void *data)
{
	struct text_entry *entry = data;
	struct rectangle allocation;
	int tx, ty;

	if (!entry->button_pressed) {
		return CURSOR_IBEAM;
	}

	widget_get_allocation(entry->widget, &allocation);

	tx = x - allocation.x - text_offset_left(&allocation);
	ty = y - allocation.y - text_offset_top(&allocation);

	text_entry_set_cursor_position(entry, tx, ty, false);

	return CURSOR_IBEAM;
}

static void
text_entry_button_handler(struct widget *widget,
			  struct input *input, uint32_t time,
			  uint32_t button,
			  enum wl_pointer_button_state state, void *data)
{
	struct text_entry *entry = data;
	struct rectangle allocation;
	struct editor *editor;
	int32_t x, y;
	uint32_t result;

	widget_get_allocation(entry->widget, &allocation);
	input_get_position(input, &x, &y);

	x -= allocation.x + text_offset_left(&allocation);
	y -= allocation.y + text_offset_top(&allocation);

	editor = window_get_user_data(entry->window);

	switch (button) {
	case BTN_LEFT:
		entry->button_pressed = (state == WL_POINTER_BUTTON_STATE_PRESSED);
		if (state == WL_POINTER_BUTTON_STATE_PRESSED)
			input_grab(input, entry->widget, button);
		else
			input_ungrab(input);
		break;
	case BTN_RIGHT:
		if (state == WL_POINTER_BUTTON_STATE_PRESSED)
			show_menu(editor, input, time);
		break;
	}

	if (text_entry_has_preedit(entry)) {
		result = text_entry_try_invoke_preedit_action(entry, x, y, button, state);

		if (result)
			return;
	}

	if (state == WL_POINTER_BUTTON_STATE_PRESSED &&
	    button == BTN_LEFT) {
		struct wl_seat *seat = input_get_seat(input);

		text_entry_activate(entry, seat);
		editor->active_entry = entry;

		text_entry_set_cursor_position(entry, x, y, true);
	}
}

static void
text_entry_touch_handler(struct widget *widget, struct input *input,
			 uint32_t serial, uint32_t time, int32_t id,
			 float tx, float ty, void *data)
{
	struct text_entry *entry = data;
	struct wl_seat *seat = input_get_seat(input);
	struct rectangle allocation;
	struct editor *editor;
	int32_t x, y;

	widget_get_allocation(entry->widget, &allocation);

	x = tx - (allocation.x + text_offset_left(&allocation));
	y = ty - (allocation.y + text_offset_top(&allocation));

	editor = window_get_user_data(entry->window);
	text_entry_activate(entry, seat);
	editor->active_entry = entry;

	text_entry_set_cursor_position(entry, x, y, true);
}

static void
editor_button_handler(struct widget *widget,
		      struct input *input, uint32_t time,
		      uint32_t button,
		      enum wl_pointer_button_state state, void *data)
{
	struct editor *editor = data;

	if (button != BTN_LEFT) {
		return;
	}

	if (state == WL_POINTER_BUTTON_STATE_PRESSED) {
		struct wl_seat *seat = input_get_seat(input);

		text_entry_deactivate(editor->entry, seat);
		text_entry_deactivate(editor->editor, seat);
		editor->active_entry = NULL;
	}
}

static void
editor_touch_handler(struct widget *widget, struct input *input,
		     uint32_t serial, uint32_t time, int32_t id,
		     float tx, float ty, void *data)
{
	struct editor *editor = data;

	struct wl_seat *seat = input_get_seat(input);

	text_entry_deactivate(editor->entry, seat);
	text_entry_deactivate(editor->editor, seat);
	editor->active_entry = NULL;
}

static void
keyboard_focus_handler(struct window *window,
		       struct input *device, void *data)
{
	struct editor *editor = data;

	window_schedule_redraw(editor->window);
}

static int
handle_bound_key(struct editor *editor,
		 struct input *input, uint32_t sym, uint32_t time)
{
	switch (sym) {
	case XKB_KEY_X:
		editor_copy_cut(editor, input, true);
		return 1;
	case XKB_KEY_C:
		editor_copy_cut(editor, input, false);
		return 1;
	case XKB_KEY_V:
		editor_paste(editor, input);
		return 1;
	default:
		return 0;
	}
}

static void
key_handler(struct window *window,
	    struct input *input, uint32_t time,
	    uint32_t key, uint32_t sym, enum wl_keyboard_key_state state,
	    void *data)
{
	struct editor *editor = data;
	struct text_entry *entry;
	const char *new_char;
	char text[16];
	uint32_t modifiers;

	if (!editor->active_entry)
		return;

	entry = editor->active_entry;

	if (state != WL_KEYBOARD_KEY_STATE_PRESSED)
		return;

	modifiers = input_get_modifiers(input);
	if ((modifiers & MOD_CONTROL_MASK) &&
	    (modifiers & MOD_SHIFT_MASK) &&
	    handle_bound_key(editor, input, sym, time))
		return;

	switch (sym) {
		case XKB_KEY_BackSpace:
			text_entry_commit_and_reset(entry);

			new_char = utf8_prev_char(entry->text, entry->text + entry->cursor);
			if (new_char != NULL)
				text_entry_delete_text(entry,
						       new_char - entry->text,
						       (entry->text + entry->cursor) - new_char);
			break;
		case XKB_KEY_Delete:
			text_entry_commit_and_reset(entry);

			new_char = utf8_next_char(entry->text + entry->cursor);
			if (new_char != NULL)
				text_entry_delete_text(entry,
						       entry->cursor,
						       new_char - (entry->text + entry->cursor));
			break;
		case XKB_KEY_Left:
			text_entry_commit_and_reset(entry);

			new_char = utf8_prev_char(entry->text, entry->text + entry->cursor);
			if (new_char != NULL) {
				entry->cursor = new_char - entry->text;
				if (!(input_get_modifiers(input) & MOD_SHIFT_MASK))
					entry->anchor = entry->cursor;
				widget_schedule_redraw(entry->widget);
			}
			break;
		case XKB_KEY_Right:
			text_entry_commit_and_reset(entry);

			new_char = utf8_next_char(entry->text + entry->cursor);
			if (new_char != NULL) {
				entry->cursor = new_char - entry->text;
				if (!(input_get_modifiers(input) & MOD_SHIFT_MASK))
					entry->anchor = entry->cursor;
				widget_schedule_redraw(entry->widget);
			}
			break;
		case XKB_KEY_Up:
			text_entry_commit_and_reset(entry);

			move_up(entry->text, &entry->cursor);
			if (!(input_get_modifiers(input) & MOD_SHIFT_MASK))
				entry->anchor = entry->cursor;
			widget_schedule_redraw(entry->widget);
			break;
		case XKB_KEY_Down:
			text_entry_commit_and_reset(entry);

			move_down(entry->text, &entry->cursor);
			if (!(input_get_modifiers(input) & MOD_SHIFT_MASK))
				entry->anchor = entry->cursor;
			widget_schedule_redraw(entry->widget);
			break;
		case XKB_KEY_Escape:
			break;
		default:
			if (xkb_keysym_to_utf8(sym, text, sizeof(text)) <= 0)
				break;

 			text_entry_commit_and_reset(entry);

			text_entry_insert_at_cursor(entry, text, 0, 0);
			break;
	}

	widget_schedule_redraw(entry->widget);
}

static void
global_handler(struct display *display, uint32_t name,
	       const char *interface, uint32_t version, void *data)
{
	struct editor *editor = data;

	if (!strcmp(interface, "zwp_text_input_manager_v1")) {
		editor->text_input_manager =
			display_bind(display, name,
				     &zwp_text_input_manager_v1_interface, 1);
	}
}

/** Display help for command line options, and exit */
static bool opt_help = false;

/** Require a distinct click to show the input panel (virtual keyboard) */
static bool opt_click_to_show = false;

/** Set a specific (RFC-3066) language.  Used for the virtual keyboard, etc. */
static const char *opt_preferred_language = NULL;

/**
 * \brief command line options for editor
 */
static const struct weston_option editor_options[] = {
	{ WESTON_OPTION_BOOLEAN, "help", 'h', &opt_help },
	{ WESTON_OPTION_BOOLEAN, "click-to-show", 'C', &opt_click_to_show },
	{ WESTON_OPTION_STRING, "preferred-language", 'L', &opt_preferred_language },
};

static void
usage(const char *program_name, int exit_code)
{
	unsigned k;

	fprintf(stderr, "Usage: %s [OPTIONS] [FILENAME]\n\n", program_name);
	for (k = 0; k < ARRAY_LENGTH(editor_options); k++) {
		const struct weston_option *p = &editor_options[k];
		if (p->name) {
			fprintf(stderr, "  --%s", p->name);
			if (p->type != WESTON_OPTION_BOOLEAN)
				fprintf(stderr, "=VALUE");
			fprintf(stderr, "\n");
		}
		if (p->short_name) {
			fprintf(stderr, "  -%c", p->short_name);
			if (p->type != WESTON_OPTION_BOOLEAN)
				fprintf(stderr, "VALUE");
			fprintf(stderr, "\n");
		}
	}
	exit(exit_code);
}

/* Load the contents of a file into a UTF-8 text buffer and return it.
 *
 * Caller is responsible for freeing the buffer when done.
 * On error, returns NULL.
 */
static char *
read_file(char *filename)
{
	char *buffer = NULL;
	int buf_size, read_size;
	FILE *fin;
	int errsv;

	fin = fopen(filename, "r");
	if (fin == NULL)
		goto error;

	/* Determine required buffer size */
	if (fseek(fin, 0, SEEK_END) != 0)
		goto error;
	buf_size = ftell(fin);
	if (buf_size < 0)
		goto error;
	rewind(fin);

	/* Create buffer and read in the text */
	buffer = (char*) malloc(sizeof(char) * (buf_size + 1));
	if (buffer == NULL)
		goto error;
	read_size = fread(buffer, sizeof(char), buf_size, fin);
	fclose(fin);
	if (buf_size != read_size)
		goto error;
	buffer[buf_size] = '\0';

	return buffer;

error:
	errsv = errno;
	if (fin)
		fclose(fin);
	free(buffer);
	errno = errsv ? errsv : EINVAL;

	return NULL;
}

int
main(int argc, char *argv[])
{
	struct editor editor;
	char *text_buffer = NULL;

	parse_options(editor_options, ARRAY_LENGTH(editor_options),
		      &argc, argv);
	if (opt_help)
		usage(argv[0], EXIT_SUCCESS);

	if (argc > 1) {
		if (argv[1][0] == '-')
			usage(argv[0], EXIT_FAILURE);

		text_buffer = read_file(argv[1]);
		if (text_buffer == NULL) {
			fprintf(stderr, "could not read file '%s': %s\n",
				argv[1], strerror(errno));
			return -1;
		}
	}

	memset(&editor, 0, sizeof editor);

	editor.display = display_create(&argc, argv);
	if (editor.display == NULL) {
		fprintf(stderr, "failed to create display: %s\n",
			strerror(errno));
		free(text_buffer);
		return -1;
	}

	display_set_user_data(editor.display, &editor);
	display_set_global_handler(editor.display, global_handler);

	if (editor.text_input_manager == NULL) {
		fprintf(stderr, "No text input manager global\n");
		display_destroy(editor.display);
		free(text_buffer);
		return -1;
	}

	editor.window = window_create(editor.display);
	editor.widget = window_frame_create(editor.window, &editor);

	if (text_buffer)
		editor.entry = text_entry_create(&editor, text_buffer);
	else
		editor.entry = text_entry_create(&editor, "Entry");
	editor.entry->click_to_show = opt_click_to_show;
	if (opt_preferred_language)
		editor.entry->preferred_language = strdup(opt_preferred_language);
	editor.editor = text_entry_create(&editor, "Numeric");
	editor.editor->content_purpose = ZWP_TEXT_INPUT_V1_CONTENT_PURPOSE_NUMBER;
	editor.editor->click_to_show = opt_click_to_show;
	editor.selection = NULL;
	editor.selected_text = NULL;

	window_set_title(editor.window, "Text Editor");
	window_set_appid(editor.window, "org.freedesktop.weston.text-editor");
	window_set_key_handler(editor.window, key_handler);
	window_set_keyboard_focus_handler(editor.window,
					  keyboard_focus_handler);
	window_set_user_data(editor.window, &editor);

	widget_set_redraw_handler(editor.widget, redraw_handler);
	widget_set_resize_handler(editor.widget, resize_handler);
	widget_set_button_handler(editor.widget, editor_button_handler);
	widget_set_touch_down_handler(editor.widget, editor_touch_handler);

	window_schedule_resize(editor.window, 500, 400);

	display_run(editor.display);

	if (editor.selected_text)
		free(editor.selected_text);
	if (editor.selection)
		wl_data_source_destroy(editor.selection);
	text_entry_destroy(editor.entry);
	text_entry_destroy(editor.editor);
	widget_destroy(editor.widget);
	window_destroy(editor.window);
	display_destroy(editor.display);
	free(text_buffer);

	return 0;
}

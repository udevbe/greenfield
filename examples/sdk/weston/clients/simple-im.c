/*
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
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <sys/mman.h>

#include <linux/input.h>

#include "window.h"
#include "input-method-unstable-v1-client-protocol.h"
#include "shared/helpers.h"

enum compose_state {
	state_normal,
	state_compose
};

struct compose_seq {
	uint32_t keys[4];

	const char *text;
};

struct simple_im;

typedef void (*keyboard_input_key_handler_t)(struct simple_im *keyboard,
					     uint32_t serial,
					     uint32_t time, uint32_t key, uint32_t unicode,
					     enum wl_keyboard_key_state state);

struct simple_im {
	struct zwp_input_method_v1 *input_method;
	struct zwp_input_method_context_v1 *context;
	struct wl_display *display;
	struct wl_registry *registry;
	struct wl_keyboard *keyboard;
	enum compose_state compose_state;
	struct compose_seq compose_seq;

	struct xkb_context *xkb_context;

	uint32_t modifiers;

	struct xkb_keymap *keymap;
	struct xkb_state *state;
	xkb_mod_mask_t control_mask;
	xkb_mod_mask_t alt_mask;
	xkb_mod_mask_t shift_mask;

	keyboard_input_key_handler_t key_handler;

	uint32_t serial;
};

static const struct compose_seq compose_seqs[] = {
	{ { XKB_KEY_quotedbl, XKB_KEY_A, 0 },  "Ä" },
	{ { XKB_KEY_quotedbl, XKB_KEY_O, 0 },  "Ö" },
	{ { XKB_KEY_quotedbl, XKB_KEY_U, 0 },  "Ü" },
	{ { XKB_KEY_quotedbl, XKB_KEY_a, 0 },  "ä" },
	{ { XKB_KEY_quotedbl, XKB_KEY_o, 0 },  "ö" },
	{ { XKB_KEY_quotedbl, XKB_KEY_u, 0 },  "ü" },
	{ { XKB_KEY_apostrophe, XKB_KEY_A, 0 },  "Á" },
	{ { XKB_KEY_apostrophe, XKB_KEY_a, 0 },  "á" },
	{ { XKB_KEY_slash, XKB_KEY_O, 0 },     "Ø" },
	{ { XKB_KEY_slash, XKB_KEY_o, 0 },     "ø" },
	{ { XKB_KEY_less, XKB_KEY_3, 0 },  "♥" },
	{ { XKB_KEY_A, XKB_KEY_A, 0 },  "Å" },
	{ { XKB_KEY_A, XKB_KEY_E, 0 },  "Æ" },
	{ { XKB_KEY_O, XKB_KEY_C, 0 },  "©" },
	{ { XKB_KEY_O, XKB_KEY_R, 0 },  "®" },
	{ { XKB_KEY_s, XKB_KEY_s, 0 },  "ß" },
	{ { XKB_KEY_a, XKB_KEY_e, 0 },  "æ" },
	{ { XKB_KEY_a, XKB_KEY_a, 0 },  "å" },
};

static const uint32_t ignore_keys_on_compose[] = {
	XKB_KEY_Shift_L,
	XKB_KEY_Shift_R
};

static void
handle_surrounding_text(void *data,
			struct zwp_input_method_context_v1 *context,
			const char *text,
			uint32_t cursor,
			uint32_t anchor)
{
	fprintf(stderr, "Surrounding text updated: %s\n", text);
}

static void
handle_reset(void *data,
	     struct zwp_input_method_context_v1 *context)
{
	struct simple_im *keyboard = data;

	fprintf(stderr, "Reset pre-edit buffer\n");

	keyboard->compose_state = state_normal;
}

static void
handle_content_type(void *data,
		    struct zwp_input_method_context_v1 *context,
		    uint32_t hint,
		    uint32_t purpose)
{
}

static void
handle_invoke_action(void *data,
		     struct zwp_input_method_context_v1 *context,
		     uint32_t button,
		     uint32_t index)
{
}

static void
handle_commit_state(void *data,
		    struct zwp_input_method_context_v1 *context,
		    uint32_t serial)
{
	struct simple_im *keyboard = data;

	keyboard->serial = serial;
}

static void
handle_preferred_language(void *data,
			  struct zwp_input_method_context_v1 *context,
			  const char *language)
{
}

static const struct zwp_input_method_context_v1_listener input_method_context_listener = {
	handle_surrounding_text,
	handle_reset,
	handle_content_type,
	handle_invoke_action,
	handle_commit_state,
	handle_preferred_language
};

static void
input_method_keyboard_keymap(void *data,
			     struct wl_keyboard *wl_keyboard,
			     uint32_t format,
			     int32_t fd,
			     uint32_t size)
{
	struct simple_im *keyboard = data;
	char *map_str;

	if (format != WL_KEYBOARD_KEYMAP_FORMAT_XKB_V1) {
		close(fd);
		return;
	}

	map_str = mmap(NULL, size, PROT_READ, MAP_SHARED, fd, 0);
	if (map_str == MAP_FAILED) {
		close(fd);
		return;
	}

	keyboard->keymap =
		xkb_keymap_new_from_string(keyboard->xkb_context,
					   map_str,
					   XKB_KEYMAP_FORMAT_TEXT_V1,
					   XKB_KEYMAP_COMPILE_NO_FLAGS);

	munmap(map_str, size);
	close(fd);

	if (!keyboard->keymap) {
		fprintf(stderr, "Failed to compile keymap\n");
		return;
	}

	keyboard->state = xkb_state_new(keyboard->keymap);
	if (!keyboard->state) {
		fprintf(stderr, "Failed to create XKB state\n");
		xkb_keymap_unref(keyboard->keymap);
		return;
	}

	keyboard->control_mask =
		1 << xkb_keymap_mod_get_index(keyboard->keymap, "Control");
	keyboard->alt_mask =
		1 << xkb_keymap_mod_get_index(keyboard->keymap, "Mod1");
	keyboard->shift_mask =
		1 << xkb_keymap_mod_get_index(keyboard->keymap, "Shift");
}

static void
input_method_keyboard_key(void *data,
			  struct wl_keyboard *wl_keyboard,
			  uint32_t serial,
			  uint32_t time,
			  uint32_t key,
			  uint32_t state_w)
{
	struct simple_im *keyboard = data;
	uint32_t code;
	uint32_t num_syms;
	const xkb_keysym_t *syms;
	xkb_keysym_t sym;
	enum wl_keyboard_key_state state = state_w;

	if (!keyboard->state)
		return;

	code = key + 8;
	num_syms = xkb_state_key_get_syms(keyboard->state, code, &syms);

	sym = XKB_KEY_NoSymbol;
	if (num_syms == 1)
		sym = syms[0];

	if (keyboard->key_handler)
		(*keyboard->key_handler)(keyboard, serial, time, key, sym,
					 state);
}

static void
input_method_keyboard_modifiers(void *data,
				struct wl_keyboard *wl_keyboard,
				uint32_t serial,
				uint32_t mods_depressed,
				uint32_t mods_latched,
				uint32_t mods_locked,
				uint32_t group)
{
	struct simple_im *keyboard = data;
	struct zwp_input_method_context_v1 *context = keyboard->context;
	xkb_mod_mask_t mask;

	xkb_state_update_mask(keyboard->state, mods_depressed,
			      mods_latched, mods_locked, 0, 0, group);
	mask = xkb_state_serialize_mods(keyboard->state,
					XKB_STATE_MODS_DEPRESSED |
					XKB_STATE_MODS_LATCHED);

	keyboard->modifiers = 0;
	if (mask & keyboard->control_mask)
		keyboard->modifiers |= MOD_CONTROL_MASK;
	if (mask & keyboard->alt_mask)
		keyboard->modifiers |= MOD_ALT_MASK;
	if (mask & keyboard->shift_mask)
		keyboard->modifiers |= MOD_SHIFT_MASK;

	zwp_input_method_context_v1_modifiers(context, serial,
					      mods_depressed, mods_depressed,
					      mods_latched, group);
}

static const struct wl_keyboard_listener input_method_keyboard_listener = {
	input_method_keyboard_keymap,
	NULL, /* enter */
	NULL, /* leave */
	input_method_keyboard_key,
	input_method_keyboard_modifiers
};

static void
input_method_activate(void *data,
		      struct zwp_input_method_v1 *input_method,
		      struct zwp_input_method_context_v1 *context)
{
	struct simple_im *keyboard = data;

	if (keyboard->context)
		zwp_input_method_context_v1_destroy(keyboard->context);

	keyboard->compose_state = state_normal;

	keyboard->serial = 0;

	keyboard->context = context;
	zwp_input_method_context_v1_add_listener(context,
						 &input_method_context_listener,
						 keyboard);
	keyboard->keyboard = zwp_input_method_context_v1_grab_keyboard(context);
	wl_keyboard_add_listener(keyboard->keyboard,
				 &input_method_keyboard_listener,
				 keyboard);
}

static void
input_method_deactivate(void *data,
			struct zwp_input_method_v1 *input_method,
			struct zwp_input_method_context_v1 *context)
{
	struct simple_im *keyboard = data;

	if (!keyboard->context)
		return;

	zwp_input_method_context_v1_destroy(keyboard->context);
	keyboard->context = NULL;
}

static const struct zwp_input_method_v1_listener input_method_listener = {
	input_method_activate,
	input_method_deactivate
};

static void
registry_handle_global(void *data, struct wl_registry *registry,
		       uint32_t name, const char *interface, uint32_t version)
{
	struct simple_im *keyboard = data;

	if (!strcmp(interface, "zwp_input_method_v1")) {
		keyboard->input_method =
			wl_registry_bind(registry, name,
					 &zwp_input_method_v1_interface, 1);
		zwp_input_method_v1_add_listener(keyboard->input_method,
						 &input_method_listener, keyboard);
	}
}

static void
registry_handle_global_remove(void *data, struct wl_registry *registry,
			      uint32_t name)
{
}

static const struct wl_registry_listener registry_listener = {
	registry_handle_global,
	registry_handle_global_remove
};

static int
compare_compose_keys(const void *c1, const void *c2)
{
	const struct compose_seq *cs1 = c1;
	const struct compose_seq *cs2 = c2;
	int i;

	for (i = 0; cs1->keys[i] != 0 && cs2->keys[i] != 0; i++) {
		if (cs1->keys[i] != cs2->keys[i])
			return cs1->keys[i] - cs2->keys[i];
	}

	if (cs1->keys[i] == cs2->keys[i]
	    || cs1->keys[i] == 0)
		return 0;

	return cs1->keys[i] - cs2->keys[i];
}

static void
simple_im_key_handler(struct simple_im *keyboard,
		      uint32_t serial, uint32_t time, uint32_t key, uint32_t sym,
		      enum wl_keyboard_key_state state)
{
	struct zwp_input_method_context_v1 *context = keyboard->context;
	char text[64];

	if (sym == XKB_KEY_Multi_key &&
	    state == WL_KEYBOARD_KEY_STATE_RELEASED &&
	    keyboard->compose_state == state_normal) {
		keyboard->compose_state = state_compose;
		memset(&keyboard->compose_seq, 0, sizeof(struct compose_seq));
		return;
	}

	if (keyboard->compose_state == state_compose) {
		uint32_t i = 0;
		struct compose_seq *cs;

		if (state == WL_KEYBOARD_KEY_STATE_PRESSED)
			return;

		for (i = 0; i < ARRAY_LENGTH(ignore_keys_on_compose); i++) {
			if (sym == ignore_keys_on_compose[i]) {
				zwp_input_method_context_v1_key(context,
								keyboard->serial,
								time,
								key,
								state);
				return;
			}
		}

		for (i = 0; keyboard->compose_seq.keys[i] != 0; i++);

		keyboard->compose_seq.keys[i] = sym;

		cs = bsearch (&keyboard->compose_seq, compose_seqs,
			      ARRAY_LENGTH(compose_seqs),
			      sizeof(compose_seqs[0]), compare_compose_keys);

		if (cs) {
			if (cs->keys[i + 1] == 0) {
				zwp_input_method_context_v1_preedit_cursor(keyboard->context,
									   0);
				zwp_input_method_context_v1_preedit_string(keyboard->context,
									   keyboard->serial,
									   "", "");
				zwp_input_method_context_v1_cursor_position(keyboard->context,
									    0, 0);
				zwp_input_method_context_v1_commit_string(keyboard->context,
									  keyboard->serial,
									  cs->text);
				keyboard->compose_state = state_normal;
			} else {
				uint32_t j = 0, idx = 0;

				for (; j <= i; j++) {
					idx += xkb_keysym_to_utf8(cs->keys[j], text + idx, sizeof(text) - idx);
				}

				zwp_input_method_context_v1_preedit_cursor(keyboard->context,
									   strlen(text));
				zwp_input_method_context_v1_preedit_string(keyboard->context,
									   keyboard->serial,
									   text,
									   text);
			}
		} else {
			uint32_t j = 0, idx = 0;

			for (; j <= i; j++) {
				idx += xkb_keysym_to_utf8(keyboard->compose_seq.keys[j], text + idx, sizeof(text) - idx);
			}
			zwp_input_method_context_v1_preedit_cursor(keyboard->context,
								   0);
			zwp_input_method_context_v1_preedit_string(keyboard->context,
								   keyboard->serial,
								   "", "");
			zwp_input_method_context_v1_cursor_position(keyboard->context,
								    0, 0);
			zwp_input_method_context_v1_commit_string(keyboard->context,
								  keyboard->serial,
								  text);
			keyboard->compose_state = state_normal;
		}
		return;
	}

	if (xkb_keysym_to_utf8(sym, text, sizeof(text)) <= 0) {
		zwp_input_method_context_v1_key(context, serial, time, key, state);
		return;
	}

	if (state == WL_KEYBOARD_KEY_STATE_PRESSED)
		return;

	zwp_input_method_context_v1_cursor_position(keyboard->context,
						    0, 0);
	zwp_input_method_context_v1_commit_string(keyboard->context,
						  keyboard->serial,
						  text);
}

int
main(int argc, char *argv[])
{
	struct simple_im simple_im;
	int ret = 0;

	memset(&simple_im, 0, sizeof(simple_im));

	simple_im.display = wl_display_connect(NULL);
	if (simple_im.display == NULL) {
		fprintf(stderr, "Failed to connect to server: %s\n",
			strerror(errno));
		return -1;
	}

	simple_im.registry = wl_display_get_registry(simple_im.display);
	wl_registry_add_listener(simple_im.registry,
				 &registry_listener, &simple_im);
	wl_display_roundtrip(simple_im.display);
	if (simple_im.input_method == NULL) {
		fprintf(stderr, "No input_method global\n");
		return -1;
	}

	simple_im.xkb_context = xkb_context_new(XKB_CONTEXT_NO_FLAGS);
	if (simple_im.xkb_context == NULL) {
		fprintf(stderr, "Failed to create XKB context\n");
		return -1;
	}

	simple_im.context = NULL;
	simple_im.key_handler =  simple_im_key_handler;

	while (ret != -1)
		ret = wl_display_dispatch(simple_im.display);

	if (ret == -1) {
		fprintf(stderr, "Dispatch error: %s\n", strerror(errno));
		return -1;
	}

	return 0;
}

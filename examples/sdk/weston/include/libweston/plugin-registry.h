/*
 * Copyright (C) 2016 DENSO CORPORATION
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

#ifndef WESTON_PLUGIN_REGISTRY_H
#define WESTON_PLUGIN_REGISTRY_H

#include <stddef.h>

#ifdef  __cplusplus
extern "C" {
#endif

struct weston_compositor;

int
weston_plugin_api_register(struct weston_compositor *compositor,
			   const char *api_name,
			   const void *vtable,
			   size_t vtable_size);

const void *
weston_plugin_api_get(struct weston_compositor *compositor,
		      const char *api_name,
		      size_t vtable_size);

void
weston_plugin_api_destroy_list(struct weston_compositor *compositor);

#ifdef  __cplusplus
}
#endif

#endif /* WESTON_PLUGIN_REGISTRY_H */

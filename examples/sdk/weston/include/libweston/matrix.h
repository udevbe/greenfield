/*
 * Copyright © 2008-2011 Kristian Høgsberg
 * Copyright © 2012 Collabora, Ltd.
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

#ifndef WESTON_MATRIX_H
#define WESTON_MATRIX_H

#include <stdbool.h>

#include <wayland-server-protocol.h>

#ifdef  __cplusplus
extern "C" {
#endif

enum weston_matrix_transform_type {
	WESTON_MATRIX_TRANSFORM_TRANSLATE	= (1 << 0),
	WESTON_MATRIX_TRANSFORM_SCALE		= (1 << 1),
	WESTON_MATRIX_TRANSFORM_ROTATE		= (1 << 2),
	WESTON_MATRIX_TRANSFORM_OTHER		= (1 << 3),
};

struct weston_matrix {
	float d[16];
	unsigned int type;
};

struct weston_vector {
	float f[4];
};

void
weston_matrix_init(struct weston_matrix *matrix);
void
weston_matrix_multiply(struct weston_matrix *m, const struct weston_matrix *n);
void
weston_matrix_scale(struct weston_matrix *matrix, float x, float y, float z);
void
weston_matrix_translate(struct weston_matrix *matrix,
			float x, float y, float z);
void
weston_matrix_rotate_xy(struct weston_matrix *matrix, float cos, float sin);
void
weston_matrix_transform(const struct weston_matrix *matrix,
			struct weston_vector *v);

int
weston_matrix_invert(struct weston_matrix *inverse,
		     const struct weston_matrix *matrix);

bool
weston_matrix_needs_filtering(const struct weston_matrix *matrix);

bool
weston_matrix_to_transform(const struct weston_matrix *mat,
			   enum wl_output_transform *transform);

#ifdef  __cplusplus
}
#endif

#endif /* WESTON_MATRIX_H */

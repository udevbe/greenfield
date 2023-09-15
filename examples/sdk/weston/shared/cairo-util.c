/*
 * Copyright © 2008 Kristian Høgsberg
 * Copyright © 2012 Intel Corporation
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
#include <stdio.h>
#include <math.h>
#include <wayland-util.h>
#include <cairo.h>
#include "cairo-util.h"

#include "shared/helpers.h"
#include "image-loader.h"
#include "shared/xalloc.h"
#include <libweston/config-parser.h>

#ifdef HAVE_PANGO
#include <fontconfig/fontconfig.h>
#include <pango/pangocairo.h>
#endif

void
surface_flush_device(cairo_surface_t *surface)
{
	cairo_device_t *device;

	device = cairo_surface_get_device(surface);
	if (device)
		cairo_device_flush(device);
}

static int
blur_surface(cairo_surface_t *surface, int margin)
{
	int32_t width, height, stride, x, y, z, w;
	uint8_t *src, *dst;
	uint32_t *s, *d, a, p;
	int i, j, k, size, half;
	uint32_t kernel[71];
	double f;

	size = ARRAY_LENGTH(kernel);
	width = cairo_image_surface_get_width(surface);
	height = cairo_image_surface_get_height(surface);
	stride = cairo_image_surface_get_stride(surface);
	src = cairo_image_surface_get_data(surface);

	dst = malloc(height * stride);
	if (dst == NULL)
		return -1;

	half = size / 2;
	a = 0;
	for (i = 0; i < size; i++) {
		f = (i - half);
		kernel[i] = exp(- f * f / ARRAY_LENGTH(kernel)) * 10000;
		a += kernel[i];
	}

	for (i = 0; i < height; i++) {
		s = (uint32_t *) (src + i * stride);
		d = (uint32_t *) (dst + i * stride);
		for (j = 0; j < width; j++) {
			if (margin < j && j < width - margin) {
				d[j] = s[j];
				continue;
			}

			x = 0;
			y = 0;
			z = 0;
			w = 0;
			for (k = 0; k < size; k++) {
				if (j - half + k < 0 || j - half + k >= width)
					continue;
				p = s[j - half + k];

				x += (p >> 24) * kernel[k];
				y += ((p >> 16) & 0xff) * kernel[k];
				z += ((p >> 8) & 0xff) * kernel[k];
				w += (p & 0xff) * kernel[k];
			}
			d[j] = (x / a << 24) | (y / a << 16) | (z / a << 8) | w / a;
		}
	}

	for (i = 0; i < height; i++) {
		s = (uint32_t *) (dst + i * stride);
		d = (uint32_t *) (src + i * stride);
		for (j = 0; j < width; j++) {
			if (margin <= i && i < height - margin) {
				d[j] = s[j];
				continue;
			}

			x = 0;
			y = 0;
			z = 0;
			w = 0;
			for (k = 0; k < size; k++) {
				if (i - half + k < 0 || i - half + k >= height)
					continue;
				s = (uint32_t *) (dst + (i - half + k) * stride);
				p = s[j];

				x += (p >> 24) * kernel[k];
				y += ((p >> 16) & 0xff) * kernel[k];
				z += ((p >> 8) & 0xff) * kernel[k];
				w += (p & 0xff) * kernel[k];
			}
			d[j] = (x / a << 24) | (y / a << 16) | (z / a << 8) | w / a;
		}
	}

	free(dst);
	cairo_surface_mark_dirty(surface);

	return 0;
}

void
render_shadow(cairo_t *cr, cairo_surface_t *surface,
	      int x, int y, int width, int height, int margin, int top_margin)
{
	cairo_pattern_t *pattern;
	cairo_matrix_t matrix;
	int i, fx, fy, shadow_height, shadow_width;

	cairo_set_source_rgba(cr, 0, 0, 0, 0.45);
	cairo_set_operator(cr, CAIRO_OPERATOR_OVER);
	pattern = cairo_pattern_create_for_surface (surface);
	cairo_pattern_set_filter(pattern, CAIRO_FILTER_NEAREST);

	for (i = 0; i < 4; i++) {
		/* when fy is set, then we are working with lower corners,
		 * when fx is set, then we are working with right corners
		 *
		 *  00 ------- 01
		 *   |         |
		 *   |         |
		 *  10 ------- 11
		 */
		fx = i & 1;
		fy = i >> 1;

		cairo_matrix_init_translate(&matrix,
					    -x + fx * (128 - width),
					    -y + fy * (128 - height));
		cairo_pattern_set_matrix(pattern, &matrix);

		shadow_width = margin;
		shadow_height = fy ? margin : top_margin;

		/* if the shadows together are greater than the surface, we need
		 * to fix it - set the shadow size to the half of
		 * the size of surface. Also handle the case when the size is
		 * not divisible by 2. In that case we need one part of the
		 * shadow to be one pixel greater. !fy or !fx, respectively,
		 * will do the work.
		 */
		if (height < 2 * shadow_height)
			shadow_height = (height + !fy) / 2;

		if (width < 2 * shadow_width)
			shadow_width = (width + !fx) / 2;

		cairo_reset_clip(cr);
		cairo_rectangle(cr,
				x + fx * (width - shadow_width),
				y + fy * (height - shadow_height),
				shadow_width, shadow_height);
		cairo_clip (cr);
		cairo_mask(cr, pattern);
	}


	shadow_width = width - 2 * margin;
	shadow_height = top_margin;
	if (height < 2 * shadow_height)
		shadow_height = height / 2;

	if (shadow_width > 0 && shadow_height) {
		/* Top stretch */
		cairo_matrix_init_translate(&matrix, 60, 0);
		cairo_matrix_scale(&matrix, 8.0 / width, 1);
		cairo_matrix_translate(&matrix, -x - width / 2, -y);
		cairo_pattern_set_matrix(pattern, &matrix);
		cairo_rectangle(cr, x + margin, y, shadow_width, shadow_height);

		cairo_reset_clip(cr);
		cairo_rectangle(cr,
				x + margin, y,
				shadow_width, shadow_height);
		cairo_clip (cr);
		cairo_mask(cr, pattern);

		/* Bottom stretch */
		cairo_matrix_translate(&matrix, 0, -height + 128);
		cairo_pattern_set_matrix(pattern, &matrix);

		cairo_reset_clip(cr);
		cairo_rectangle(cr, x + margin, y + height - margin,
				shadow_width, margin);
		cairo_clip (cr);
		cairo_mask(cr, pattern);
	}

	shadow_width = margin;
	if (width < 2 * shadow_width)
		shadow_width = width / 2;

	shadow_height = height - margin - top_margin;

	/* if height is smaller than sum of margins,
	 * then the shadow is already done by the corners */
	if (shadow_height > 0 && shadow_width) {
		/* Left stretch */
		cairo_matrix_init_translate(&matrix, 0, 60);
		cairo_matrix_scale(&matrix, 1, 8.0 / height);
		cairo_matrix_translate(&matrix, -x, -y - height / 2);
		cairo_pattern_set_matrix(pattern, &matrix);
		cairo_reset_clip(cr);
		cairo_rectangle(cr, x, y + top_margin,
				shadow_width, shadow_height);
		cairo_clip (cr);
		cairo_mask(cr, pattern);

		/* Right stretch */
		cairo_matrix_translate(&matrix, -width + 128, 0);
		cairo_pattern_set_matrix(pattern, &matrix);
		cairo_rectangle(cr, x + width - shadow_width, y + top_margin,
				shadow_width, shadow_height);
		cairo_reset_clip(cr);
		cairo_clip (cr);
		cairo_mask(cr, pattern);
	}

	cairo_pattern_destroy(pattern);
	cairo_reset_clip(cr);
}

void
tile_source(cairo_t *cr, cairo_surface_t *surface,
	    int x, int y, int width, int height, int margin, int top_margin)
{
	cairo_pattern_t *pattern;
	cairo_matrix_t matrix;
	int i, fx, fy, vmargin;

	cairo_set_operator(cr, CAIRO_OPERATOR_OVER);
	pattern = cairo_pattern_create_for_surface (surface);
	cairo_pattern_set_filter(pattern, CAIRO_FILTER_NEAREST);
	cairo_set_source(cr, pattern);

	for (i = 0; i < 4; i++) {
		fx = i & 1;
		fy = i >> 1;

		cairo_matrix_init_translate(&matrix,
					    -x + fx * (128 - width),
					    -y + fy * (128 - height));
		cairo_pattern_set_matrix(pattern, &matrix);

		if (fy)
			vmargin = margin;
		else
			vmargin = top_margin;

		cairo_rectangle(cr,
				x + fx * (width - margin),
				y + fy * (height - vmargin),
				margin, vmargin);
		cairo_fill(cr);
	}

	/* Top stretch */
	cairo_matrix_init_translate(&matrix, 60, 0);
	cairo_matrix_scale(&matrix, 8.0 / (width - 2 * margin), 1);
	cairo_matrix_translate(&matrix, -x - width / 2, -y);
	cairo_pattern_set_matrix(pattern, &matrix);
	cairo_rectangle(cr, x + margin, y, width - 2 * margin, top_margin);
	cairo_fill(cr);

	/* Bottom stretch */
	cairo_matrix_translate(&matrix, 0, -height + 128);
	cairo_pattern_set_matrix(pattern, &matrix);
	cairo_rectangle(cr, x + margin, y + height - margin,
			width - 2 * margin, margin);
	cairo_fill(cr);

	/* Left stretch */
	cairo_matrix_init_translate(&matrix, 0, 60);
	cairo_matrix_scale(&matrix, 1, 8.0 / (height - margin - top_margin));
	cairo_matrix_translate(&matrix, -x, -y - height / 2);
	cairo_pattern_set_matrix(pattern, &matrix);
	cairo_rectangle(cr, x, y + top_margin,
			margin, height - margin - top_margin);
	cairo_fill(cr);

	/* Right stretch */
	cairo_matrix_translate(&matrix, -width + 128, 0);
	cairo_pattern_set_matrix(pattern, &matrix);
	cairo_rectangle(cr, x + width - margin, y + top_margin,
			margin, height - margin - top_margin);
	cairo_fill(cr);

	cairo_pattern_destroy(pattern);
	cairo_set_source_rgb(cr, 0.0, 0.0, 0.0);
}

void
rounded_rect(cairo_t *cr, int x0, int y0, int x1, int y1, int radius)
{
	cairo_move_to(cr, x0, y0 + radius);
	cairo_arc(cr, x0 + radius, y0 + radius, radius, M_PI, 3 * M_PI / 2);
	cairo_line_to(cr, x1 - radius, y0);
	cairo_arc(cr, x1 - radius, y0 + radius, radius, 3 * M_PI / 2, 2 * M_PI);
	cairo_line_to(cr, x1, y1 - radius);
	cairo_arc(cr, x1 - radius, y1 - radius, radius, 0, M_PI / 2);
	cairo_line_to(cr, x0 + radius, y1);
	cairo_arc(cr, x0 + radius, y1 - radius, radius, M_PI / 2, M_PI);
	cairo_close_path(cr);
}

static void
loaded_cairo_surface_destructor(void *data)
{
	pixman_image_t *image = data;

	pixman_image_unref(image);
}

static const cairo_user_data_key_t weston_cairo_util_load_cairo_surface_key;

cairo_surface_t *
load_cairo_surface(const char *filename)
{
	cairo_surface_t *surface;
	cairo_status_t ret;
	pixman_image_t *image;
	int width, height, stride;
	void *data;

	image = load_image(filename);
	if (image == NULL) {
		return NULL;
	}

	data = pixman_image_get_data(image);
	width = pixman_image_get_width(image);
	height = pixman_image_get_height(image);
	stride = pixman_image_get_stride(image);

	surface = cairo_image_surface_create_for_data(data, CAIRO_FORMAT_ARGB32,
						      width, height, stride);
	ret = cairo_surface_status(surface);
	if (ret != CAIRO_STATUS_SUCCESS)
		goto fail;

	ret = cairo_surface_set_user_data(surface,
					  &weston_cairo_util_load_cairo_surface_key,
					  image,
					  loaded_cairo_surface_destructor);
	if (ret != CAIRO_STATUS_SUCCESS)
		goto fail;

	return surface;

fail:
	cairo_surface_destroy(surface);
	pixman_image_unref(image);
	return NULL;
}

void
theme_set_background_source(struct theme *t, cairo_t *cr, uint32_t flags)
{
	cairo_pattern_t *pattern;

	if (flags & THEME_FRAME_ACTIVE) {
		pattern = cairo_pattern_create_linear(16, 16, 16, 112);
		cairo_pattern_add_color_stop_rgb(pattern, 0.0, 1.0, 1.0, 1.0);
		cairo_pattern_add_color_stop_rgb(pattern, 0.2, 0.8, 0.8, 0.8);
		cairo_set_source(cr, pattern);
		cairo_pattern_destroy(pattern);
	} else {
		cairo_set_source_rgba(cr, 0.75, 0.75, 0.75, 1);
	}
}

struct theme *
theme_create(void)
{
	struct theme *t;
	cairo_t *cr;

	t = xzalloc(sizeof *t);

	t->margin = 32;
	t->width = 6;
	t->titlebar_height = 27;
	t->frame_radius = 3;
	t->shadow = cairo_image_surface_create (CAIRO_FORMAT_ARGB32, 128, 128);
	cr = cairo_create(t->shadow);
	cairo_set_operator(cr, CAIRO_OPERATOR_OVER);
	cairo_set_source_rgba(cr, 0, 0, 0, 1);
	rounded_rect(cr, 32, 32, 96, 96, t->frame_radius);
	cairo_fill(cr);
	if (cairo_status (cr) != CAIRO_STATUS_SUCCESS)
		goto err_shadow;
	cairo_destroy(cr);
	if (blur_surface(t->shadow, 64) == -1)
		goto err_shadow;

	t->active_frame =
		cairo_image_surface_create (CAIRO_FORMAT_ARGB32, 128, 128);
	cr = cairo_create(t->active_frame);
	cairo_set_operator(cr, CAIRO_OPERATOR_OVER);

	theme_set_background_source(t, cr, THEME_FRAME_ACTIVE);
	rounded_rect(cr, 0, 0, 128, 128, t->frame_radius);
	cairo_fill(cr);

	if (cairo_status(cr) != CAIRO_STATUS_SUCCESS)
		goto err_active_frame;

	cairo_destroy(cr);

	t->inactive_frame =
		cairo_image_surface_create (CAIRO_FORMAT_ARGB32, 128, 128);
	cr = cairo_create(t->inactive_frame);
	cairo_set_operator(cr, CAIRO_OPERATOR_OVER);
	theme_set_background_source(t, cr, 0);
	rounded_rect(cr, 0, 0, 128, 128, t->frame_radius);
	cairo_fill(cr);

	if (cairo_status (cr) != CAIRO_STATUS_SUCCESS)
		goto err_inactive_frame;

	cairo_destroy(cr);

	return t;

 err_inactive_frame:
	cairo_surface_destroy(t->inactive_frame);
 err_active_frame:
	cairo_surface_destroy(t->active_frame);
 err_shadow:
	cairo_surface_destroy(t->shadow);
	free(t);
	return NULL;
}

void
theme_destroy(struct theme *t)
{
#ifdef HAVE_PANGO
	if (t->pango_context)
		g_object_unref(t->pango_context);
#endif
	cairo_surface_destroy(t->active_frame);
	cairo_surface_destroy(t->inactive_frame);
	cairo_surface_destroy(t->shadow);
	free(t);
}

#ifdef HAVE_PANGO
static PangoLayout *
create_layout(struct theme *t, cairo_t *cr, const char *title)
{
	PangoLayout *layout;
	PangoFontDescription *desc;

	if (!t->pango_context) {
		PangoFontMap *fontmap;

		fontmap = pango_cairo_font_map_new();
		t->pango_context = pango_font_map_create_context(fontmap);
		g_object_unref(fontmap);
	}

	pango_cairo_update_context(cr, t->pango_context);
	layout = pango_layout_new(t->pango_context);
	if (title) {
		pango_layout_set_text(layout, title, -1);
		desc = pango_font_description_from_string("sans-serif Bold 10");
		pango_layout_set_font_description(layout, desc);
		pango_font_description_free(desc);
	}

	pango_layout_set_ellipsize(layout, PANGO_ELLIPSIZE_END);
	pango_layout_set_alignment(layout, PANGO_ALIGN_LEFT);
	pango_layout_set_auto_dir (layout, FALSE);
	pango_layout_set_single_paragraph_mode (layout, TRUE);
	pango_layout_set_width (layout, -1);

	return layout;
}
#endif

#ifdef HAVE_PANGO
#define SHOW_TEXT(cr) \
	pango_cairo_show_layout(cr, title_layout)
#else
#define SHOW_TEXT(cr) \
	cairo_show_text(cr, title)
#endif

void
theme_render_frame(struct theme *t,
		   cairo_t *cr, int width, int height,
		   const char *title, cairo_rectangle_int_t *title_rect,
		   struct wl_list *buttons, uint32_t flags)
{
	cairo_surface_t *source;
	int x, y, margin, top_margin;
	int text_width, text_height;

	cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);
	cairo_set_source_rgba(cr, 0, 0, 0, 0);
	cairo_paint(cr);

	if (flags & THEME_FRAME_MAXIMIZED)
		margin = 0;
	else {
		render_shadow(cr, t->shadow,
			      2, 2, width + 8, height + 8,
			      64, 64);
		margin = t->margin;
	}

	if (flags & THEME_FRAME_ACTIVE)
		source = t->active_frame;
	else
		source = t->inactive_frame;

	if (title || !wl_list_empty(buttons))
		top_margin = t->titlebar_height;
	else
		top_margin = t->width;

	tile_source(cr, source,
		    margin, margin,
		    width - margin * 2, height - margin * 2,
		    t->width, top_margin);

	if (title || !wl_list_empty(buttons)) {

		cairo_rectangle (cr, title_rect->x, title_rect->y,
				 title_rect->width, title_rect->height);
		cairo_clip(cr);
		cairo_set_operator(cr, CAIRO_OPERATOR_OVER);

#ifdef HAVE_PANGO
		PangoLayout *title_layout;
		PangoRectangle logical;

		title_layout = create_layout(t, cr, title);

		pango_layout_get_pixel_extents (title_layout, NULL, &logical);
		text_width = MIN(title_rect->width, logical.width);
		text_height = logical.height;
		if (text_width < logical.width)
		  pango_layout_set_width (title_layout, text_width * PANGO_SCALE);

#else
		cairo_text_extents_t extents;
		cairo_font_extents_t font_extents;

		cairo_select_font_face(cr, "sans-serif",
				       CAIRO_FONT_SLANT_NORMAL,
				       CAIRO_FONT_WEIGHT_BOLD);
		cairo_set_font_size(cr, 14);
		cairo_text_extents(cr, title, &extents);
		cairo_font_extents (cr, &font_extents);
		text_width = extents.width;
		text_height = font_extents.descent - font_extents.ascent;
#endif

		x = (width - text_width) / 2;
		y = margin + (t->titlebar_height - text_height) / 2;
		if (x < title_rect->x)
			x = title_rect->x;
		else if (x + text_width > (title_rect->x + title_rect->width))
			x = (title_rect->x + title_rect->width) - text_width;

		if (flags & THEME_FRAME_ACTIVE) {
			cairo_move_to(cr, x + 1, y  + 1);
			cairo_set_source_rgb(cr, 1, 1, 1);
			SHOW_TEXT(cr);
			cairo_move_to(cr, x, y);
			cairo_set_source_rgb(cr, 0, 0, 0);
			SHOW_TEXT(cr);
		} else {
			cairo_move_to(cr, x, y);
			cairo_set_source_rgb(cr, 0.4, 0.4, 0.4);
			SHOW_TEXT(cr);
		}

#ifdef HAVE_PANGO
		g_object_unref(title_layout);
#endif
	}
}

enum theme_location
theme_get_location(struct theme *t, int x, int y,
				int width, int height, int flags)
{
	int vlocation, hlocation, location;
	int margin, top_margin, grip_size;

	if (flags & THEME_FRAME_MAXIMIZED) {
		margin = 0;
		grip_size = 0;
	} else {
		margin = t->margin;
		grip_size = 8;
	}

	if (flags & THEME_FRAME_NO_TITLE)
		top_margin = t->width;
	else
		top_margin = t->titlebar_height;

	if (x < margin)
		hlocation = THEME_LOCATION_EXTERIOR;
	else if (x < margin + grip_size)
		hlocation = THEME_LOCATION_RESIZING_LEFT;
	else if (x < width - margin - grip_size)
		hlocation = THEME_LOCATION_INTERIOR;
	else if (x < width - margin)
		hlocation = THEME_LOCATION_RESIZING_RIGHT;
	else
		hlocation = THEME_LOCATION_EXTERIOR;

	if (y < margin)
		vlocation = THEME_LOCATION_EXTERIOR;
	else if (y < margin + grip_size)
		vlocation = THEME_LOCATION_RESIZING_TOP;
	else if (y < height - margin - grip_size)
		vlocation = THEME_LOCATION_INTERIOR;
	else if (y < height - margin)
		vlocation = THEME_LOCATION_RESIZING_BOTTOM;
	else
		vlocation = THEME_LOCATION_EXTERIOR;

	location = vlocation | hlocation;
	if (location & THEME_LOCATION_EXTERIOR)
		location = THEME_LOCATION_EXTERIOR;
	if (location == THEME_LOCATION_INTERIOR &&
	    y < margin + top_margin)
		location = THEME_LOCATION_TITLEBAR;
	else if (location == THEME_LOCATION_INTERIOR)
		location = THEME_LOCATION_CLIENT_AREA;

	return location;
}

/** Cleanup static Cairo/Pango data
 *
 * Using Cairo, Pango, PangoCairo, and fontconfig, ends up leaving a trail of
 * thread-cached data behind us. Clean up what we can.
 */
void
cleanup_after_cairo(void)
{
	/* some clients, particular weston-editor, still creates indirectly a
	 * new font map; this makes sure we untie that up and avoid an assert
	 * from cairo */
//	pango_cairo_font_map_set_default(NULL);
	cairo_debug_reset_static_data();
#ifdef HAVE_PANGO
	FcFini();
#endif
}

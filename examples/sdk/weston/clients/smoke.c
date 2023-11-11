/*
 * Copyright © 2010 Kristian Høgsberg
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
#include <time.h>
#include <math.h>
#include <errno.h>
#include <cairo.h>

#include <wayland-client.h>
#include "window.h"

struct smoke {
	struct display *display;
	struct window *window;
	struct widget *widget;
	int width, height;
	int current;
	struct { float *d, *u, *v; } b[2];
};

static void diffuse(struct smoke *smoke, uint32_t time,
		    float *source, float *dest)
{
	float *s, *d;
	int x, y, k, stride;
	float t, a = 0.0002;

	stride = smoke->width;

	for (k = 0; k < 5; k++) {
		for (y = 1; y < smoke->height - 1; y++) {
			s = source + y * stride;
			d = dest + y * stride;
			for (x = 1; x < smoke->width - 1; x++) {
				t = d[x - 1] + d[x + 1] +
					d[x - stride] + d[x + stride];
				d[x] = (s[x] + a * t) / (1 + 4 * a) * 0.995;
			}
		}
	}
}

static void advect(struct smoke *smoke, uint32_t time,
		   float *uu, float *vv, float *source, float *dest)
{
	float *s, *d;
	float *u, *v;
	int x, y, stride;
	int i, j;
	float px, py, fx, fy;

	stride = smoke->width;

	for (y = 1; y < smoke->height - 1; y++) {
		d = dest + y * stride;
		u = uu + y * stride;
		v = vv + y * stride;

		for (x = 1; x < smoke->width - 1; x++) {
			px = x - u[x];
			py = y - v[x];
			if (px < 0.5)
				px = 0.5;
			if (py < 0.5)
				py = 0.5;
			if (px > smoke->width - 1.5)
				px = smoke->width - 1.5;
			if (py > smoke->height - 1.5)
				py = smoke->height - 1.5;
			i = (int) px;
			j = (int) py;
			fx = px - i;
			fy = py - j;
			s = source + j * stride + i;
			d[x] = (s[0] * (1 - fx) + s[1] * fx) * (1 - fy) +
				(s[stride] * (1 - fx) + s[stride + 1] * fx) * fy;
		}
	}
}

static void project(struct smoke *smoke, uint32_t time,
		    float *u, float *v, float *p, float *div)
{
	int x, y, k, l, s;
	float h;

	h = 1.0 / smoke->width;
	s = smoke->width;
	memset(p, 0, smoke->height * smoke->width);
	for (y = 1; y < smoke->height - 1; y++) {
		l = y * s;
		for (x = 1; x < smoke->width - 1; x++) {
			div[l + x] = -0.5 * h * (u[l + x + 1] - u[l + x - 1] +
						 v[l + x + s] - v[l + x - s]);
			p[l + x] = 0;
		}
	}

	for (k = 0; k < 5; k++) {
		for (y = 1; y < smoke->height - 1; y++) {
			l = y * s;
			for (x = 1; x < smoke->width - 1; x++) {
				p[l + x] = (div[l + x] +
					    p[l + x - 1] +
					    p[l + x + 1] +
					    p[l + x - s] +
					    p[l + x + s]) / 4;
			}
		}
	}

	for (y = 1; y < smoke->height - 1; y++) {
		l = y * s;
		for (x = 1; x < smoke->width - 1; x++) {
			u[l + x] -= 0.5 * (p[l + x + 1] - p[l + x - 1]) / h;
			v[l + x] -= 0.5 * (p[l + x + s] - p[l + x - s]) / h;
		}
	}
}

static void render(struct smoke *smoke, cairo_surface_t *surface)
{
	unsigned char *dest;
	int x, y, width, height, stride;
	float *s;
	uint32_t *d, c, a;

	dest = cairo_image_surface_get_data(surface);
	width = cairo_image_surface_get_width(surface);
	height = cairo_image_surface_get_height(surface);
	stride = cairo_image_surface_get_stride(surface);

	for (y = 1; y < height - 1; y++) {
		s = smoke->b[smoke->current].d + y * smoke->height;
		d = (uint32_t *) (dest + y * stride);
		for (x = 1; x < width - 1; x++) {
			c = (int) (s[x] * 800);
			if (c > 255)
				c = 255;
			a = c;
			if (a < 0x33)
				a = 0x33;
			d[x] = (a << 24) | (c << 16) | (c << 8) | c;
		}
	}
}

static void
redraw_handler(struct widget *widget, void *data)
{
	struct smoke *smoke = data;
	uint32_t time = widget_get_last_time(smoke->widget);
	cairo_surface_t *surface;

	diffuse(smoke, time / 30, smoke->b[0].u, smoke->b[1].u);
	diffuse(smoke, time / 30, smoke->b[0].v, smoke->b[1].v);
	project(smoke, time / 30,
		smoke->b[1].u, smoke->b[1].v,
		smoke->b[0].u, smoke->b[0].v);
	advect(smoke, time / 30,
	       smoke->b[1].u, smoke->b[1].v,
	       smoke->b[1].u, smoke->b[0].u);
	advect(smoke, time / 30,
	       smoke->b[1].u, smoke->b[1].v,
	       smoke->b[1].v, smoke->b[0].v);
	project(smoke, time / 30,
		smoke->b[0].u, smoke->b[0].v,
		smoke->b[1].u, smoke->b[1].v);

	diffuse(smoke, time / 30, smoke->b[0].d, smoke->b[1].d);
	advect(smoke, time / 30,
	       smoke->b[0].u, smoke->b[0].v,
	       smoke->b[1].d, smoke->b[0].d);

	surface = window_get_surface(smoke->window);

	render(smoke, surface);

	cairo_surface_destroy(surface);

	widget_schedule_redraw(smoke->widget);
}

static void
smoke_motion_handler(struct smoke *smoke, float x, float y)
{
	int i, i0, i1, j, j0, j1, k, d = 5;

	if (x - d < 1)
		i0 = 1;
	else
		i0 = x - d;
	if (i0 + 2 * d > smoke->width - 1)
		i1 = smoke->width - 1;
	else
		i1 = i0 + 2 * d;

	if (y - d < 1)
		j0 = 1;
	else
		j0 = y - d;
	if (j0 + 2 * d > smoke->height - 1)
		j1 = smoke->height - 1;
	else
		j1 = j0 + 2 * d;

	for (i = i0; i < i1; i++)
		for (j = j0; j < j1; j++) {
			k = j * smoke->width + i;
			smoke->b[0].u[k] += 256 - (random() & 512);
			smoke->b[0].v[k] += 256 - (random() & 512);
			smoke->b[0].d[k] += 1;
		}
}

static int
mouse_motion_handler(struct widget *widget, struct input *input,
		     uint32_t time, float x, float y, void *data)
{
	smoke_motion_handler(data, x, y);

	return CURSOR_HAND1;
}

static void
touch_motion_handler(struct widget *widget, struct input *input,
		     uint32_t time, int32_t id, float x, float y, void *data)
{
	smoke_motion_handler(data, x, y);
}

static void
resize_handler(struct widget *widget,
	       int32_t width, int32_t height, void *data)
{
	struct smoke *smoke = data;

	/* Don't resize me */
	widget_set_size(smoke->widget, smoke->width, smoke->height);
}

int main(int argc, char *argv[])
{
	struct timespec ts;
	struct smoke smoke;
	struct display *d;
	int size;

	d = display_create(&argc, argv);
	if (d == NULL) {
		fprintf(stderr, "failed to create display: %s\n",
			strerror(errno));
		return -1;
	}

	smoke.width = 200;
	smoke.height = 200;
	smoke.display = d;
	smoke.window = window_create(d);
	smoke.widget = window_add_widget(smoke.window, &smoke);
	window_set_title(smoke.window, "smoke");
	window_set_appid(smoke.window, "org.freedesktop.weston.smoke");

	window_set_buffer_type(smoke.window, WINDOW_BUFFER_TYPE_SHM);
	clock_gettime(CLOCK_MONOTONIC, &ts);
	srandom(ts.tv_nsec);

	smoke.current = 0;
	size = smoke.height * smoke.width;
	smoke.b[0].d = calloc(size, sizeof(float));
	smoke.b[0].u = calloc(size, sizeof(float));
	smoke.b[0].v = calloc(size, sizeof(float));
	smoke.b[1].d = calloc(size, sizeof(float));
	smoke.b[1].u = calloc(size, sizeof(float));
	smoke.b[1].v = calloc(size, sizeof(float));

	widget_set_motion_handler(smoke.widget, mouse_motion_handler);
	widget_set_touch_motion_handler(smoke.widget, touch_motion_handler);
	widget_set_resize_handler(smoke.widget, resize_handler);
	widget_set_redraw_handler(smoke.widget, redraw_handler);

	window_set_user_data(smoke.window, &smoke);

	widget_schedule_resize(smoke.widget, smoke.width, smoke.height);

	display_run(d);

	widget_destroy(smoke.widget);
	window_destroy(smoke.window);
	display_destroy(d);

	return 0;
}

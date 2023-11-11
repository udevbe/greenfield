/*
 * Copyright © 2008-2012 Kristian Høgsberg
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

#include <errno.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <png.h>
#include <pixman.h>

#include "shared/helpers.h"
#include "image-loader.h"

#ifdef HAVE_JPEG
#include <jpeglib.h>
#endif

#ifdef HAVE_WEBP
#include <webp/decode.h>
#endif

static int
stride_for_width(int width)
{
	return width * 4;
}

static void
pixman_image_destroy_func(pixman_image_t *image, void *data)
{
	free(data);
}

#ifdef HAVE_JPEG

static void
swizzle_row(JSAMPLE *row, JDIMENSION width)
{
	JSAMPLE *s;
	uint32_t *d;

	s = row + (width - 1) * 3;
	d = (uint32_t *) (row + (width - 1) * 4);
	while (s >= row) {
		*d = 0xff000000 | (s[0] << 16) | (s[1] << 8) | (s[2] << 0);
		s -= 3;
		d--;
	}
}

static void
error_exit(j_common_ptr cinfo)
{
	longjmp(cinfo->client_data, 1);
}

static pixman_image_t *
load_jpeg(FILE *fp)
{
	struct jpeg_decompress_struct cinfo;
	struct jpeg_error_mgr jerr;
	pixman_image_t *pixman_image = NULL;
	unsigned int i;
	int stride, first;
	JSAMPLE *data, *rows[4];
	jmp_buf env;

	cinfo.err = jpeg_std_error(&jerr);
	jerr.error_exit = error_exit;
	cinfo.client_data = env;
	if (setjmp(env))
		return NULL;

	jpeg_create_decompress(&cinfo);

	jpeg_stdio_src(&cinfo, fp);

	jpeg_read_header(&cinfo, TRUE);

	cinfo.out_color_space = JCS_RGB;
	jpeg_start_decompress(&cinfo);

	stride = cinfo.output_width * 4;
	data = malloc(stride * cinfo.output_height);
	if (data == NULL) {
		fprintf(stderr, "couldn't allocate image data\n");
		return NULL;
	}

	while (cinfo.output_scanline < cinfo.output_height) {
		first = cinfo.output_scanline;
		for (i = 0; i < ARRAY_LENGTH(rows); i++)
			rows[i] = data + (first + i) * stride;

		jpeg_read_scanlines(&cinfo, rows, ARRAY_LENGTH(rows));
		for (i = 0; first + i < cinfo.output_scanline; i++)
			swizzle_row(rows[i], cinfo.output_width);
	}

	jpeg_finish_decompress(&cinfo);

	jpeg_destroy_decompress(&cinfo);

	pixman_image = pixman_image_create_bits(PIXMAN_a8r8g8b8,
					cinfo.output_width,
					cinfo.output_height,
					(uint32_t *) data, stride);

	pixman_image_set_destroy_function(pixman_image,
				pixman_image_destroy_func, data);

	return pixman_image;
}

#else

static pixman_image_t *
load_jpeg(FILE *fp)
{
	fprintf(stderr, "JPEG support disabled at compile-time\n");
	return NULL;
}

#endif

static inline int
multiply_alpha(int alpha, int color)
{
    int temp = (alpha * color) + 0x80;

    return ((temp + (temp >> 8)) >> 8);
}

static void
premultiply_data(png_structp   png,
		 png_row_infop row_info,
		 png_bytep     data)
{
    unsigned int i;
    png_bytep p;

    for (i = 0, p = data; i < row_info->rowbytes; i += 4, p += 4) {
	uint32_t alpha = p[3];
	uint32_t w;

	if (alpha == 0) {
		w = 0;
	} else {
		uint32_t red   = p[0];
		uint32_t green = p[1];
		uint32_t blue  = p[2];

		if (alpha != 0xff) {
			red   = multiply_alpha(alpha, red);
			green = multiply_alpha(alpha, green);
			blue  = multiply_alpha(alpha, blue);
		}
		w = (alpha << 24) | (red << 16) | (green << 8) | (blue << 0);
	}

	* (uint32_t *) p = w;
    }
}

static void
read_func(png_structp png, png_bytep data, png_size_t size)
{
	FILE *fp = png_get_io_ptr(png);

	if (fread(data, 1, size, fp) != size)
		png_error(png, NULL);
}

static void
png_error_callback(png_structp png, png_const_charp error_msg)
{
    longjmp (png_jmpbuf (png), 1);
}

static pixman_image_t *
load_png(FILE *fp)
{
	png_struct *png;
	png_info *info;
	png_byte *volatile data = NULL;
	png_byte **volatile row_pointers = NULL;
	png_uint_32 width, height;
	int depth, color_type, interlace, stride;
	unsigned int i;
	pixman_image_t *pixman_image = NULL;

	png = png_create_read_struct(PNG_LIBPNG_VER_STRING, NULL,
				     png_error_callback, NULL);
	if (!png)
		return NULL;

	info = png_create_info_struct(png);
	if (!info) {
		png_destroy_read_struct(&png, &info, NULL);
		return NULL;
	}

	if (setjmp(png_jmpbuf(png))) {
		if (data)
			free(data);
		if (row_pointers)
			free(row_pointers);
		png_destroy_read_struct(&png, &info, NULL);
		return NULL;
	}

	png_set_read_fn(png, fp, read_func);
	png_read_info(png, info);
	png_get_IHDR(png, info,
		     &width, &height, &depth,
		     &color_type, &interlace, NULL, NULL);

	if (color_type == PNG_COLOR_TYPE_PALETTE)
		png_set_palette_to_rgb(png);

	if (color_type == PNG_COLOR_TYPE_GRAY)
		png_set_expand_gray_1_2_4_to_8(png);

	if (png_get_valid(png, info, PNG_INFO_tRNS))
		png_set_tRNS_to_alpha(png);

	if (depth == 16)
		png_set_strip_16(png);

	if (depth < 8)
		png_set_packing(png);

	if (color_type == PNG_COLOR_TYPE_GRAY ||
	    color_type == PNG_COLOR_TYPE_GRAY_ALPHA)
		png_set_gray_to_rgb(png);

	if (interlace != PNG_INTERLACE_NONE)
		png_set_interlace_handling(png);

	png_set_filler(png, 0xff, PNG_FILLER_AFTER);
	png_set_read_user_transform_fn(png, premultiply_data);
	png_read_update_info(png, info);
	png_get_IHDR(png, info,
		     &width, &height, &depth,
		     &color_type, &interlace, NULL, NULL);


	stride = stride_for_width(width);
	data = malloc(stride * height);
	if (!data) {
		png_destroy_read_struct(&png, &info, NULL);
		return NULL;
	}

	row_pointers = malloc(height * sizeof row_pointers[0]);
	if (row_pointers == NULL) {
		free(data);
		png_destroy_read_struct(&png, &info, NULL);
		return NULL;
	}

	for (i = 0; i < height; i++)
		row_pointers[i] = &data[i * stride];

	png_read_image(png, row_pointers);
	png_read_end(png, info);

	free(row_pointers);
	png_destroy_read_struct(&png, &info, NULL);

	pixman_image = pixman_image_create_bits(PIXMAN_a8r8g8b8,
				width, height, (uint32_t *) data, stride);

	pixman_image_set_destroy_function(pixman_image,
				pixman_image_destroy_func, data);

	return pixman_image;
}

#ifdef HAVE_WEBP

static pixman_image_t *
load_webp(FILE *fp)
{
	WebPDecoderConfig config;
	uint8_t buffer[16 * 1024];
	int len;
	VP8StatusCode status;
	WebPIDecoder *idec;

	if (!WebPInitDecoderConfig(&config)) {
		fprintf(stderr, "Library version mismatch!\n");
		return NULL;
	}

	/* webp decoding api doesn't seem to specify a min size that's
	   usable for GetFeatures, but 256 works... */
	len = fread(buffer, 1, 256, fp);
	status = WebPGetFeatures(buffer, len, &config.input);
	if (status != VP8_STATUS_OK) {
		fprintf(stderr, "failed to parse webp header\n");
		WebPFreeDecBuffer(&config.output);
		return NULL;
	}

	config.output.colorspace = MODE_BGRA;
	config.output.u.RGBA.stride = stride_for_width(config.input.width);
	config.output.u.RGBA.size =
		config.output.u.RGBA.stride * config.input.height;
	config.output.u.RGBA.rgba =
		malloc(config.output.u.RGBA.stride * config.input.height);
	config.output.is_external_memory = 1;
	if (!config.output.u.RGBA.rgba) {
		WebPFreeDecBuffer(&config.output);
		return NULL;
	}

	rewind(fp);
	idec = WebPINewDecoder(&config.output);
	if (!idec) {
		WebPFreeDecBuffer(&config.output);
		return NULL;
	}

	while (!feof(fp)) {
		len = fread(buffer, 1, sizeof buffer, fp);
		status = WebPIAppend(idec, buffer, len);
		if (status != VP8_STATUS_OK) {
			fprintf(stderr, "webp decode status %d\n", status);
			WebPIDelete(idec);
			WebPFreeDecBuffer(&config.output);
			return NULL;
		}
	}

	WebPIDelete(idec);
	WebPFreeDecBuffer(&config.output);

	return pixman_image_create_bits(PIXMAN_a8r8g8b8,
					config.input.width,
					config.input.height,
					(uint32_t *) config.output.u.RGBA.rgba,
					config.output.u.RGBA.stride);
}

#else

static pixman_image_t *
load_webp(FILE *fp)
{
	fprintf(stderr, "WebP support disabled at compile-time\n");
	return NULL;
}

#endif


struct image_loader {
	unsigned char header[4];
	int header_size;
	pixman_image_t *(*load)(FILE *fp);
};

static const struct image_loader loaders[] = {
	{ { 0x89, 'P', 'N', 'G' }, 4, load_png },
	{ { 0xff, 0xd8 }, 2, load_jpeg },
	{ { 'R', 'I', 'F', 'F' }, 4, load_webp }
};

pixman_image_t *
load_image(const char *filename)
{
	pixman_image_t *image = NULL;
	unsigned char header[4];
	FILE *fp;
	unsigned int i;

	if (!filename || !*filename)
		return NULL;

	fp = fopen(filename, "rb");
	if (!fp) {
		fprintf(stderr, "%s: %s\n", filename, strerror(errno));
		return NULL;
	}

	if (fread(header, sizeof header, 1, fp) != 1) {
		fclose(fp);
		fprintf(stderr, "%s: unable to read file header\n", filename);
		return NULL;
	}

	rewind(fp);
	for (i = 0; i < ARRAY_LENGTH(loaders); i++) {
		if (memcmp(header, loaders[i].header,
			   loaders[i].header_size) == 0) {
			image = loaders[i].load(fp);
			break;
		}
	}

	fclose(fp);

	if (i == ARRAY_LENGTH(loaders)) {
		fprintf(stderr, "%s: unrecognized file header "
			"0x%02x 0x%02x 0x%02x 0x%02x\n",
			filename, header[0], header[1], header[2], header[3]);
	} else if (!image) {
		/* load probably printed something, but just in case */
		fprintf(stderr, "%s: error reading image\n", filename);
	}

	return image;
}

//
// Created by erik on 11/16/21.
//

#include <westfield-extra.h>
#include <glib.h>
#include <gst/gst.h>
#include <gst/app/gstappsrc.h>
#include <gst/app/gstappsink.h>
#include <assert.h>
#include "encoder.h"

#define FPS 60

static const char fragment_shader[] =
		"#version 120\n"
		"#ifdef GL_ES\n"
		"    precision mediump float;\n"
		"#endif\n"
		"varying vec2 v_texcoord;\n"
		"uniform sampler2D tex;\n"
		"uniform float time;\n"
		"uniform float width;\n"
		"uniform float height;\n"
		"void main () {\n"
		"        vec4 pix = texture2D(tex, v_texcoord);\n"
		"        gl_FragColor = vec4(pix.a,pix.a,pix.a,0);\n"
		"}";

static const char vertex_shader[] =
		"#version 120\n"
		"#ifdef GL_ES\n"
		"    precision mediump float;\n"
		"#endif\n"
		"attribute vec4 a_position;\n"
		"attribute vec2 a_texcoord;\n"
		"varying vec2 v_texcoord;\n"
		"void main() {\n"
		"        gl_Position = a_position;\n"
		"        v_texcoord = a_texcoord;\n"
		"}";

enum encoding_type {
	h264,
	png
};

struct encoding_result {
	uint32_t buffer_id;
	uint32_t serial;
	enum encoding_type encoding_type;
	uint32_t width;
	uint32_t height;
	struct {
		GstMapInfo info;
		GstBuffer *buffer;
	} sample;
	struct {
		GstMapInfo info;
		GstBuffer *buffer;
	} alpha_sample;
	GMutex mutex;
};

struct encoder_itf {
	int (*supports_buffer)(struct encoder *encoder, struct wl_resource *buffer_resource);

	int (*create)(struct encoder *encoder);

	int
	(*encode)(struct encoder *encoder, struct wl_resource *buffer_resource, struct encoding_result *encoding_result);

	void (*destroy)(struct encoder *encoder);

	int(*request_key_unit)(struct encoder *encoder);

	int separate_alpha;
};

struct encoder {
	struct encoder_itf itf;
	void *impl;
	char preferred_encoder[16]; // "x264" or "nvh264"

	frame_callback_func frame_callback;
	GQueue *encoding_results;
	void *user_data;
};

struct gst_encoder {
	// gstreamer
	GstAppSrc *app_src;
	GstElement *videobox;
	GstAppSink *app_sink_alpha;
	GstAppSink *app_sink;
	GstElement *pipeline;
	int playing;
};

void
encoding_result_free(struct encoding_result *encoding_result) {
	g_mutex_clear(&encoding_result->mutex);
	if (encoding_result->sample.buffer) {
		gst_buffer_unmap(encoding_result->sample.buffer, &encoding_result->sample.info);
		gst_buffer_unref(encoding_result->sample.buffer);
	}
	if (encoding_result->alpha_sample.buffer) {
		gst_buffer_unmap(encoding_result->alpha_sample.buffer, &encoding_result->alpha_sample.info);
		gst_buffer_unref(encoding_result->alpha_sample.buffer);
	}
	free(encoding_result);
}

struct encoded_frame *
encoding_result_to_encoded_frame(struct encoding_result *encoding_result, int separate_alpha) {
	gsize opaque_length, alpha_length, offset, encoded_frame_size;
	struct encoded_frame *encoded_frame;
	uint32_t opcode = 3;

	opaque_length = encoding_result->sample.info.size;
	alpha_length = separate_alpha ? encoding_result->alpha_sample.info.size : 0;

	offset = 0;
	encoded_frame_size =
			sizeof(uint32_t) + // opcode: uin32LE
			sizeof(encoding_result->buffer_id) + // bufferId: uin32LE
			sizeof(encoding_result->serial) + // serial: uin32LE
			sizeof(encoding_result->encoding_type) + // encodingType: uint32LE
			sizeof(encoding_result->width) + // width: uint32LE
			sizeof(encoding_result->height) + // height: uint32LE
			sizeof(uint32_t) + // fragment opaque length (uin32LE)
			opaque_length +
			sizeof(uint32_t) + // fragment alpha length (uin32LE)
			alpha_length;
	void *frame_blob = malloc(encoded_frame_size);

	memcpy(frame_blob + offset, &opcode, sizeof(opcode));
	offset += sizeof(opcode);

	memcpy(frame_blob + offset, &encoding_result->buffer_id, sizeof(encoding_result->buffer_id));
	offset += sizeof(encoding_result->buffer_id);

	memcpy(frame_blob + offset, &encoding_result->serial, sizeof(encoding_result->serial));
	offset += sizeof(encoding_result->serial);

	memcpy(frame_blob + offset, &encoding_result->encoding_type, sizeof(encoding_result->encoding_type));
	offset += sizeof(encoding_result->encoding_type);

	memcpy(frame_blob + offset, &encoding_result->width, sizeof(encoding_result->width));
	offset += sizeof(encoding_result->width);

	memcpy(frame_blob + offset, &encoding_result->height, sizeof(encoding_result->height));
	offset += sizeof(encoding_result->height);

	memcpy(frame_blob + offset, &encoding_result->sample.info.size, sizeof(uint32_t));
	offset += sizeof(uint32_t);

	memcpy(frame_blob + offset, encoding_result->sample.info.data, opaque_length);
	offset += opaque_length;

	memcpy(frame_blob + offset, &alpha_length, sizeof(uint32_t));
	offset += sizeof(uint32_t);

	if (alpha_length > 0) {
		memcpy(frame_blob + offset, encoding_result->alpha_sample.info.data, alpha_length);
	}

	encoded_frame = malloc(sizeof(struct encoded_frame));
	encoded_frame->encoded_data = frame_blob;
	encoded_frame->size = encoded_frame_size;

	return encoded_frame;
}

static GstFlowReturn
gst_new_sample(GstAppSink *appsink, gpointer user_data) {
	struct encoder *encoder = user_data;
	GstSample *sample = gst_app_sink_pull_sample(appsink);
	struct encoding_result *encoding_result;
	struct encoded_frame *encoded_frame;

	if (!sample) {
		return GST_FLOW_ERROR;
	}

	if (encoder->itf.separate_alpha) {
		encoding_result = g_queue_peek_tail(encoder->encoding_results);
		g_mutex_lock(&encoding_result->mutex);

		encoding_result->sample.buffer = gst_buffer_ref(gst_sample_get_buffer(sample));
		gst_buffer_map(encoding_result->sample.buffer, &encoding_result->sample.info, GST_MAP_READ);
		gst_sample_unref(sample);

		if (encoding_result->alpha_sample.buffer) {
			g_mutex_unlock(&encoding_result->mutex);

			g_queue_pop_tail(encoder->encoding_results);
			encoded_frame = encoding_result_to_encoded_frame(encoding_result, encoder->itf.separate_alpha);
			encoding_result_free(encoding_result);
			encoder->frame_callback(encoder->user_data, encoded_frame);
		} else {
			g_mutex_unlock(&encoding_result->mutex);
		}
	} else {
		encoding_result = g_queue_pop_tail(encoder->encoding_results);

		encoding_result->sample.buffer = gst_buffer_ref(gst_sample_get_buffer(sample));
		gst_buffer_map(encoding_result->sample.buffer, &encoding_result->sample.info, GST_MAP_READ);
		gst_sample_unref(sample);

		encoded_frame = encoding_result_to_encoded_frame(encoding_result, encoder->itf.separate_alpha);
		encoding_result_free(encoding_result);
		encoder->frame_callback(encoder->user_data, encoded_frame);
	}

	return GST_FLOW_OK;
}

static GstAppSinkCallbacks sample_callback = {
		.eos = NULL,
		.new_sample = gst_new_sample,
		.new_preroll = NULL
};

static GstFlowReturn
gst_new_alpha_sample(GstAppSink *appsink, gpointer user_data) {
	struct encoder *encoder = user_data;
	GstSample *sample = gst_app_sink_pull_sample(appsink);
	struct encoding_result *encoding_result;
	struct encoded_frame *encoded_frame;

	if (!sample) {
		return GST_FLOW_ERROR;
	}

	encoding_result = g_queue_peek_tail(encoder->encoding_results);
	g_mutex_lock(&encoding_result->mutex);

	encoding_result->alpha_sample.buffer = gst_buffer_ref(gst_sample_get_buffer(sample));
	gst_buffer_map(encoding_result->alpha_sample.buffer, &encoding_result->alpha_sample.info, GST_MAP_READ);
	gst_sample_unref(sample);

	if (encoding_result->sample.buffer) {
		g_mutex_unlock(&encoding_result->mutex);

		g_queue_pop_tail(encoder->encoding_results);
		encoded_frame = encoding_result_to_encoded_frame(encoding_result, encoder->itf.separate_alpha);
		encoding_result_free(encoding_result);
		encoder->frame_callback(encoder->user_data, encoded_frame);
	} else {
		g_mutex_unlock(&encoding_result->mutex);
	}

	return GST_FLOW_OK;
}

static GstAppSinkCallbacks alpha_sample_callback = {
		.eos = NULL,
		.new_sample = gst_new_alpha_sample,
		.new_preroll = NULL
};

static void
handle_gst_buffer_destroyed(gpointer data) {
	wl_shm_pool_unref((struct wl_shm_pool *) data);
}

static GstBuffer *
wl_shm_buffer_to_gst_buffer(struct wl_shm_buffer *shm_buffer, uint32_t *width, uint32_t *height, char *gst_format) {
	void *buffer_data;
	struct wl_shm_pool *shm_pool;
	enum wl_shm_format buffer_format;
	uint32_t buffer_width, buffer_height, buffer_stride;
	gsize buffer_size;

	buffer_format = wl_shm_buffer_get_format(shm_buffer);

	if (buffer_format == WL_SHM_FORMAT_ARGB8888) {
		strcpy(gst_format, "BGRA");
	} else if (buffer_format == WL_SHM_FORMAT_XRGB8888) {
		strcpy(gst_format, "BGRx");
	} else {
		return NULL;
	}

	shm_pool = wl_shm_buffer_ref_pool(shm_buffer);

	buffer_data = wl_shm_buffer_get_data(shm_buffer);
	buffer_stride = wl_shm_buffer_get_stride(shm_buffer);
	buffer_width = wl_shm_buffer_get_width(shm_buffer);
	buffer_height = wl_shm_buffer_get_height(shm_buffer);
	buffer_size = buffer_stride * buffer_height;

	*width = buffer_width;
	*height = buffer_height;

	return gst_buffer_new_wrapped_full(0, (gpointer) buffer_data, buffer_size, 0, buffer_size, shm_pool,
									   handle_gst_buffer_destroyed);
}

static void
h264_gst_encoder_ensure_size(struct gst_encoder *gst_encoder, const char *format, const u_int32_t width,
							 const u_int32_t height) {
	const GstCaps *current_src_caps = gst_app_src_get_caps(gst_encoder->app_src);
	const GstCaps *new_src_caps = gst_caps_new_simple("video/x-raw",
													  "framerate", GST_TYPE_FRACTION, FPS, 1,
													  "format", G_TYPE_STRING, format,
													  "width", G_TYPE_INT, width,
													  "height", G_TYPE_INT, height,
													  NULL);
	if (current_src_caps && gst_caps_is_equal(current_src_caps, new_src_caps)) {
		gst_caps_unref((GstCaps *) new_src_caps);
		gst_caps_unref((GstCaps *) current_src_caps);
		return;
	} else if (current_src_caps) {
		gst_caps_unref((GstCaps *) current_src_caps);
	}

	gst_app_src_set_caps(gst_encoder->app_src, new_src_caps);
	gst_caps_unref((GstCaps *) new_src_caps);

	g_object_set(gst_encoder->videobox, "bottom", 0 - (height % 2), "right", 0 - (width % 2), NULL);
}

static void
gst_encoder_destroy(struct encoder *encoder) {
	struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
	gst_element_set_state(gst_encoder->pipeline, GST_STATE_NULL);

	gst_object_unref(gst_encoder->app_src);
	gst_object_unref(gst_encoder->videobox);
	gst_object_unref(gst_encoder->app_sink);
	if (gst_encoder->app_sink_alpha) {
		gst_object_unref(gst_encoder->app_sink_alpha);
	}

	// gstreamer pipeline
	gst_object_unref(gst_encoder->pipeline);

	free(gst_encoder);
}

static int
gst_request_key_unit(struct encoder *encoder) {
	struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
	gst_element_send_event (gst_encoder->pipeline, gst_event_new_custom(GST_EVENT_CUSTOM_DOWNSTREAM,
														   gst_structure_new("GstForceKeyUnit", "all-headers",
																			 G_TYPE_BOOLEAN, TRUE, NULL)));
}

static int
gst_encoder_encode(struct encoder *encoder, struct wl_resource *buffer_resource,
				   void (*gst_encoder_ensure_size)(struct gst_encoder *, const char *format, const u_int32_t width,
												   const u_int32_t height), struct encoding_result *encoding_result) {
	struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
	uint32_t buffer_width, buffer_height;
	GstFlowReturn ret;
	struct wl_shm_buffer *shm_buffer;
	GstBuffer *buffer;
	char gst_format[16];

	shm_buffer = wl_shm_buffer_get((struct wl_resource *) buffer_resource);
	if (shm_buffer == NULL) {
		return -1;
	}

	buffer = wl_shm_buffer_to_gst_buffer(shm_buffer, &buffer_width, &buffer_height, gst_format);
	if (buffer == NULL) {
		return -1;
	}

	encoding_result->width = buffer_width;
	encoding_result->height = buffer_height;

	gst_encoder_ensure_size(gst_encoder, gst_format, buffer_width, buffer_height);

	if (gst_encoder->playing == 0) {
		gst_element_set_state(gst_encoder->pipeline, GST_STATE_PLAYING);
		if (gst_element_get_state(gst_encoder->pipeline, NULL, NULL, 0) == GST_STATE_CHANGE_FAILURE) {
			return -1;
		}
		gst_encoder->playing = 1;
	}

	g_queue_push_head(encoder->encoding_results, encoding_result);
	ret = gst_app_src_push_buffer(gst_encoder->app_src, buffer);

	if (ret != GST_FLOW_OK) {
		/* We got some error, stop sending data */
		return -1;
	}

	return 0;
}

static int
h264_gst_encoder_encode(struct encoder *encoder, struct wl_resource *buffer_resource,
						struct encoding_result *encoding_result) {
	encoding_result->encoding_type = h264;
	return gst_encoder_encode(encoder, buffer_resource, h264_gst_encoder_ensure_size, encoding_result);
}

static int
nvh264_gst_alpha_encoder_create(struct encoder *encoder) {
	struct gst_encoder *gst_encoder = g_new0(struct gst_encoder, 1);

	gst_init(NULL, NULL);
	gst_encoder->pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
			"videobox name=videobox border-alpha=0.0 ! "
			"tee name=t ! queue ! "
			"glupload ! "
			"glcolorconvert ! "
			"glshader name=glshader ! "
			"glcolorconvert ! "
			"nvh264enc gop-size=500 qp-min=29 qp-max=40 zerolatency=true preset=5 rc-mode=4 ! "
			"video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=alphasink "
			"t. ! queue ! "
			"nvh264enc gop-size=500 qp-min=29 qp-max=40 zerolatency=true preset=5 rc-mode=4 ! "
			"video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
	if (gst_encoder->pipeline == NULL) {
		return -1;
	}

	GstElement *gl_shader = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "glshader");
	g_object_set(gl_shader, "fragment", fragment_shader, NULL);
	g_object_set(gl_shader, "vertex", vertex_shader, NULL);

	gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
	gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
	gst_encoder->app_sink_alpha = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "alphasink"));
	gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

	gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);
	gst_app_sink_set_callbacks(gst_encoder->app_sink_alpha, &alpha_sample_callback, (gpointer) encoder, NULL);

	encoder->impl = gst_encoder;

	return 0;
}

static int
nvh264_gst_encoder_create(struct encoder *encoder) {
	struct gst_encoder *gst_encoder = g_new0(struct gst_encoder, 1);

	gst_init(NULL, NULL);
	gst_encoder->pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
			"videobox name=videobox border-alpha=0.0 ! "
			"nvh264enc gop-size=500 qp-min=29 qp-max=40 zerolatency=true preset=5 rc-mode=4 ! "
			"video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
	if (gst_encoder->pipeline == NULL) {
		return -1;
	}

	gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
	gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
	gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

	gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);

	encoder->impl = gst_encoder;

	return 0;
}

static int
h264_gst_encoder_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource, int alpha,
								 char *preferred_encoder) {
	// different encoder selected so not for us
	if (strcmp(encoder->preferred_encoder, preferred_encoder) != 0) {
		return 0;
	}

	struct wl_shm_buffer *shm_buffer = wl_shm_buffer_get(buffer_resource);
	// not an shm buffer
	if (shm_buffer == NULL) {
		return 0;
	}

	int32_t width = wl_shm_buffer_get_width(shm_buffer);
	int32_t height = wl_shm_buffer_get_height(shm_buffer);
	uint32_t shm_format = wl_shm_buffer_get_format(shm_buffer);

	// Too small needs the png encoder so refuse those
	if (width * height <= 256 * 256) {
		return 0;
	}

	if (alpha && shm_format == WL_SHM_FORMAT_ARGB8888) {
		return 1;
	}
	if (!alpha && shm_format == WL_SHM_FORMAT_XRGB8888) {
		return 1;
	}
	return 0;
}

static int
nvh264_gst_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
	return h264_gst_encoder_supports_buffer(encoder, buffer_resource, 0, "nvh264");
}

static int
nvh264_gst_alpha_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
	return h264_gst_encoder_supports_buffer(encoder, buffer_resource, 1, "nvh264");
}


struct encoder_itf nv264_gst_alpha_itf = {
		.supports_buffer = nvh264_gst_alpha_supports_buffer,
		.create = nvh264_gst_alpha_encoder_create,
		.encode = h264_gst_encoder_encode,
		.destroy = gst_encoder_destroy,
		.request_key_unit = gst_request_key_unit,
		.separate_alpha = 1,
};

struct encoder_itf nv264_gst_itf = {
		.supports_buffer = nvh264_gst_supports_buffer,
		.create = nvh264_gst_encoder_create,
		.encode = h264_gst_encoder_encode,
		.destroy = gst_encoder_destroy,
		.request_key_unit = gst_request_key_unit,
		.separate_alpha = 0,
};

static int
x264_gst_alpha_encoder_create(struct encoder *encoder) {
	struct gst_encoder *gst_encoder = g_new0(struct gst_encoder, 1);

	gst_init(NULL, NULL);
	gst_encoder->pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
			"videobox name=videobox border-alpha=0 ! "
			"tee name=t ! queue ! "
			"glupload ! "
			"glcolorconvert ! "
			"glshader name=glshader ! "
			"glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"gldownload ! "
			"x264enc rc-lookahead=0 sliced-threads=true qp-max=20 byte-stream=true pass=pass1 tune=zerolatency speed-preset=superfast noise-reduction=0 psy-tune=grain ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=alphasink "
			"t. ! queue ! "
			"glupload ! "
			"glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"gldownload ! "
			"x264enc rc-lookahead=0 sliced-threads=true qp-max=20 byte-stream=true pass=pass1 tune=zerolatency speed-preset=superfast noise-reduction=0 psy-tune=grain ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
	if (gst_encoder->pipeline == NULL) {
		return -1;
	}

	GstElement *gl_shader = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "glshader");
	g_object_set(gl_shader, "fragment", fragment_shader, NULL);
	g_object_set(gl_shader, "vertex", vertex_shader, NULL);

	gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
	gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
	gst_encoder->app_sink_alpha = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "alphasink"));
	gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

	gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);
	gst_app_sink_set_callbacks(gst_encoder->app_sink_alpha, &alpha_sample_callback, (gpointer) encoder, NULL);

	encoder->impl = (struct encoder *) gst_encoder;

	return 0;
}

static int
x264_gst_encoder_create(struct encoder *encoder) {
	struct gst_encoder *gst_encoder = g_new0(struct gst_encoder, 1);

	gst_init(NULL, NULL);
	gst_encoder->pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
			"videobox name=videobox border-alpha=0 ! "
			"glupload ! "
			"glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"gldownload !"
			"x264enc qp-max=20 byte-stream=true pass=pass1 tune=zerolatency speed-preset=medium ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
	if (gst_encoder->pipeline == NULL) {
		return -1;
	}

	gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
	gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
	gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

	gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);

	encoder->impl = gst_encoder;

	return 0;
}

static int
x264_gst_alpha_encoder_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
	return h264_gst_encoder_supports_buffer(encoder, buffer_resource, 1, "x264");
}

static int
x264_gst_encoder_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
	return h264_gst_encoder_supports_buffer(encoder, buffer_resource, 0, "x264");
}

struct encoder_itf x264_gst_alpha_itf = {
		.supports_buffer = x264_gst_alpha_encoder_supports_buffer,
		.create = x264_gst_alpha_encoder_create,
		.encode = h264_gst_encoder_encode,
		.destroy = gst_encoder_destroy,
		.request_key_unit = gst_request_key_unit,
		.separate_alpha = 1,
};

struct encoder_itf x264_gst_itf = {
		.supports_buffer = x264_gst_encoder_supports_buffer,
		.create = x264_gst_encoder_create,
		.encode = h264_gst_encoder_encode,
		.destroy = gst_encoder_destroy,
		.request_key_unit = gst_request_key_unit,
		.separate_alpha = 0,
};

static int
png_gst_encoder_create(struct encoder *encoder) {
	struct gst_encoder *gst_encoder = g_new0(struct gst_encoder, 1);

	gst_init(NULL, NULL);
	gst_encoder->pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
			"videobox name=videobox border-alpha=0.0 ! "
			"videoconvert ! videoscale ! "
			"pngenc ! "
			"appsink name=sink",
			NULL);

	if (gst_encoder->pipeline == NULL) {
		return -1;
	}

	gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
	gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
	gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

	gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);

	encoder->impl = gst_encoder;

	return 0;
}

static void
png_gst_encoder_ensure_size(struct gst_encoder *gst_encoder, const char *format, const u_int32_t width,
							const u_int32_t height) {
	const GstCaps *current_src_caps = gst_app_src_get_caps(gst_encoder->app_src);
	const GstCaps *new_src_caps = gst_caps_new_simple("video/x-raw",
													  "framerate", GST_TYPE_FRACTION, FPS, 1,
													  "format", G_TYPE_STRING, format,
													  "width", G_TYPE_INT, width,
													  "height", G_TYPE_INT, height,
													  NULL);
	if (current_src_caps && gst_caps_is_equal(current_src_caps, new_src_caps)) {
		gst_caps_unref((GstCaps *) new_src_caps);
		gst_caps_unref((GstCaps *) current_src_caps);
		return;
	} else if (current_src_caps) {
		gst_caps_unref((GstCaps *) current_src_caps);
	}

	gst_app_src_set_caps(gst_encoder->app_src, new_src_caps);
	gst_caps_unref((GstCaps *) new_src_caps);

	g_object_set(gst_encoder->videobox, "bottom", height < 16 ? height - 16 : 0, "right", width < 16 ? width - 16 : 0,
				 NULL);
}

static int
png_gst_encoder_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
	struct wl_shm_buffer *shm_buffer = wl_shm_buffer_get(buffer_resource);
	if (shm_buffer == NULL) {
		return 0;
	}

	int32_t width = wl_shm_buffer_get_width(shm_buffer);
	int32_t height = wl_shm_buffer_get_height(shm_buffer);
	uint32_t shm_format = wl_shm_buffer_get_format(shm_buffer);

	return (width * height) <= (256 * 256) &&
		   (shm_format == WL_SHM_FORMAT_ARGB8888 || shm_format == WL_SHM_FORMAT_XRGB8888);
}

static int
png_gst_encoder_encode(struct encoder *encoder, struct wl_resource *buffer_resource,
					   struct encoding_result *encoding_result) {
	encoding_result->encoding_type = png;
	return gst_encoder_encode(encoder, buffer_resource, png_gst_encoder_ensure_size, encoding_result);
}

struct encoder_itf png_gst_itf = {
		.supports_buffer = png_gst_encoder_supports_buffer,
		.create = png_gst_encoder_create,
		.encode = png_gst_encoder_encode,
		.destroy = gst_encoder_destroy,
		.request_key_unit = gst_request_key_unit,
		.separate_alpha = 0,
};

static int
vaapi264_gst_alpha_encoder_create(struct encoder *encoder) {
	struct gst_encoder *gst_encoder = g_new0(struct gst_encoder, 1);

	gst_init(NULL, NULL);
	gst_encoder->pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
			"videobox name=videobox border-alpha=0 ! "
			"tee name=t ! queue ! "
			"glupload ! "
			"glcolorconvert ! "
			"glshader name=glshader ! "
			"glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"gldownload ! "
			"vaapih264enc aud=1 ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=alphasink "
			"t. ! queue ! "
			"glupload ! "
			"glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"gldownload ! "
			"vaapih264enc aud=1 ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
	if (gst_encoder->pipeline == NULL) {
		return -1;
	}

	GstElement *gl_shader = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "glshader");
	g_object_set(gl_shader, "fragment", fragment_shader, NULL);
	g_object_set(gl_shader, "vertex", vertex_shader, NULL);

	gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
	gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
	gst_encoder->app_sink_alpha = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "alphasink"));
	gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

	gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);
	gst_app_sink_set_callbacks(gst_encoder->app_sink_alpha, &alpha_sample_callback, (gpointer) encoder, NULL);

	encoder->impl = (struct encoder *) gst_encoder;

	return 0;
}

static int
vaapi264_gst_encoder_create(struct encoder *encoder) {
	struct gst_encoder *gst_encoder = g_new0(struct gst_encoder, 1);

	gst_init(NULL, NULL);
	gst_encoder->pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
			"videobox name=videobox border-alpha=0 ! "
			"vaapipostproc ! "
			"vaapih264enc aud=true ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
	if (gst_encoder->pipeline == NULL) {
		return -1;
	}

	gst_encoder->app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "src"));
	gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "videobox");
	gst_encoder->app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_encoder->pipeline), "sink"));

	gst_app_sink_set_callbacks(gst_encoder->app_sink, &sample_callback, (gpointer) encoder, NULL);

	encoder->impl = gst_encoder;

	return 0;
}

static int
vaapi264_gst_alpha_encoder_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
	return h264_gst_encoder_supports_buffer(encoder, buffer_resource, 1, "vaapih264");
}

static int
vaapi264_gst_encoder_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
	return h264_gst_encoder_supports_buffer(encoder, buffer_resource, 0, "vaapih264");
}

static int
vaapih264_gst_encoder_encode(struct encoder *encoder, struct wl_resource *buffer_resource,
							 struct encoding_result *encoding_result) {
	encoding_result->encoding_type = h264;
	return gst_encoder_encode(encoder, buffer_resource, h264_gst_encoder_ensure_size, encoding_result);
}

const struct encoder_itf vaapi264_gst_alpha_itf = {
		.supports_buffer = vaapi264_gst_alpha_encoder_supports_buffer,
		.create = vaapi264_gst_alpha_encoder_create,
		.encode = vaapih264_gst_encoder_encode,
		.destroy = gst_encoder_destroy,
		.request_key_unit = gst_request_key_unit,
		.separate_alpha = 1,
};

const struct encoder_itf vaapi264_gst_itf = {
		.supports_buffer = vaapi264_gst_encoder_supports_buffer,
		.create = vaapi264_gst_encoder_create,
		.encode = vaapih264_gst_encoder_encode,
		.destroy = gst_encoder_destroy,
		.request_key_unit = gst_request_key_unit,
		.separate_alpha = 0,
};

const struct encoder_itf *all_encoder_itfs[] = {
		&x264_gst_alpha_itf,
		&nv264_gst_alpha_itf,
		&vaapi264_gst_alpha_itf,
		&x264_gst_itf,
		&nv264_gst_itf,
		&vaapi264_gst_itf,
		&png_gst_itf
};

int
do_gst_encoder_create(char preferred_encoder[16], frame_callback_func frame_ready_callback, void *user_data,
					  struct encoder **encoder_pp) {
	struct encoder *encoder = g_new0(struct encoder, 1);

	strncpy(encoder->preferred_encoder, preferred_encoder, sizeof(encoder->preferred_encoder));
	encoder->preferred_encoder[sizeof(encoder->preferred_encoder) - 1] = '\0';
	encoder->frame_callback = frame_ready_callback;
	encoder->user_data = user_data;
	encoder->encoding_results = g_queue_new();

	*encoder_pp = encoder;
}

int
do_gst_encoder_encode(struct encoder **encoder_pp, struct wl_resource *buffer_resource, uint32_t serial) {
	struct encoder *encoder = *encoder_pp;
	struct encoding_result *encoding_result;

	if (encoder->impl != NULL) {
		if (!encoder->itf.supports_buffer(encoder, buffer_resource)) {
			encoder->itf.destroy(encoder);
			encoder->impl = NULL;
		}
	}

	if (encoder->impl == NULL) {
		for (int i = 0; i < sizeof(all_encoder_itfs); i++) {
			if (all_encoder_itfs[i]->supports_buffer(encoder, buffer_resource)) {
				encoder->itf = *all_encoder_itfs[i];
				if (encoder->itf.create(encoder) == -1) {
					return -1;
				}
				assert(encoder->impl != NULL);
				break;
			}
		}
	}

	encoding_result = g_new0(struct encoding_result, 1);
	g_mutex_init(&encoding_result->mutex);
	encoding_result->serial = serial;
	encoding_result->buffer_id = wl_resource_get_id(buffer_resource);
	return encoder->itf.encode(encoder, buffer_resource, encoding_result);
}

void
do_gst_encoder_free(struct encoder **encoder_pp) {
	struct encoder *encoder = *encoder_pp;
	encoder->itf.destroy(encoder);
	g_queue_free_full(encoder->encoding_results, (GDestroyNotify) encoding_result_free);
	free(encoder);
}

void
do_gst_encoded_frame_finalize(struct encoded_frame *encoded_frame) {
	free(encoded_frame->encoded_data);
	free(encoded_frame);
}

void
do_gst_request_key_unit(struct encoder **encoder_pp) {
	struct encoder *encoder = *encoder_pp;
	encoder->itf.request_key_unit(encoder);
}

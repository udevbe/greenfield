#include "westfield.h"
#include <glib.h>
#include <gst/gst.h>
#include <gst/allocators/gstdmabuf.h>
#include <gst/gl/gstglcontext.h>
#include <gst/gl/gstglwindow.h>
#include <gst/gl/egl/gstgldisplay_egl.h>
#include <gst/gl/egl/gsteglimage.h>
#include <gst/gl/egl/gstgldisplay_egl_device.h>
#include <gst/app/gstappsrc.h>
#include <gst/app/gstappsink.h>
#include <assert.h>
#include <EGL/egl.h>
#include "encoder.h"
#include "westfield-linux-dmabuf-v1.h"

#define FPS 60

static const char opaque_fragment_shader[] =
        "#version 120\n"
        "#ifdef GL_ES\n"
        "    precision mediump float;\n"
        "#endif\n"
        "varying vec2 v_texcoord;\n"
        "uniform sampler2D tex;\n"
        "void main () {\n"
        "        gl_FragColor = texture2D(tex, v_texcoord);\n"
        "}";

static const char alpha_fragment_shader[] =
		"#version 120\n"
		"#ifdef GL_ES\n"
		"    precision mediump float;\n"
		"#endif\n"
		"varying vec2 v_texcoord;\n"
		"uniform sampler2D tex;\n"
		"void main () {\n"
		"        vec4 pix = texture2D(tex, v_texcoord);\n"
		"        gl_FragColor = vec4(pix.a, pix.a, pix.a, 0.);\n"
		"}";

static const char vertex_shader[] =
		"#version 120\n"
		"#ifdef GL_ES\n"
		"    precision mediump float;\n"
		"#endif\n"
		"attribute vec4 a_position;\n"
		"attribute vec2 a_texcoord;\n"
		"varying vec2 v_texcoord;\n"
        "uniform float scale_x;\n"
        "uniform float scale_y;\n"
		"void main() {\n"
		"        gl_Position = vec4((a_position.x*scale_x)-(1.-scale_x)*2., (a_position.y*scale_y)-(1.-scale_y)*2., 1., 1.);\n"
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

// TODO rename to gst_encoder
struct encoder {
	struct encoder_itf itf;
	void *impl;
	char preferred_encoder[16]; // "x264" or "nvh264"

	frame_callback_func frame_callback;
	GQueue *encoding_results;
	void *user_data;
    struct westfield_drm *drm_context;

    GstContext *gst_context_gl_display;
    GstContext *gst_context_gl_context;
};

// TODO rename to gst_encoder_pipeline
struct gst_encoder {
	// gstreamer
    GstAllocator *dma_buf_allocator;
	GstAppSrc *app_src;
	GstAppSink *app_sink_alpha;
	GstAppSink *app_sink;
	GstElement *pipeline;
	int playing;
};

typedef void (*gst_encoder_ensure_size_func_t)(struct gst_encoder *, const GstCaps *new_src_caps, const u_int32_t width,
                                               const u_int32_t height);

static void
ensure_gst_gl(struct encoder *encoder, GstElement *pipeline) {
    if(!encoder->gst_context_gl_display){
        GstGLDisplay *gst_gl_display;

        EGLDeviceEXT egl_device = westfield_drm_get_egl_device(encoder->drm_context);
        EGLDisplay egl_display = westfield_drm_get_egl_display(encoder->drm_context);
        if(egl_device){
            gst_gl_display = GST_GL_DISPLAY(gst_gl_display_egl_device_new_with_egl_device(egl_device));
        } else {
            gst_gl_display = GST_GL_DISPLAY(gst_gl_display_egl_new_with_egl_display (egl_display));
        }
        GstContext *gst_context_gl_display = gst_context_new (GST_GL_DISPLAY_CONTEXT_TYPE, TRUE);
        gst_context_set_gl_display (gst_context_gl_display, gst_gl_display);
        encoder->gst_context_gl_display = gst_context_gl_display;

        if(!encoder->gst_context_gl_context) {
            gboolean ret;
            EGLContext egl_context = westfield_drm_get_egl_context(encoder->drm_context);
            eglMakeCurrent(egl_display, EGL_NO_SURFACE, EGL_NO_SURFACE, egl_context);

            if(egl_context == NULL) {
                GST_ERROR_OBJECT (gst_gl_display, "Failed to find EGL context.");
                return;
            }

            GstGLContext *gst_gl_context = gst_gl_context_new_wrapped (gst_gl_display,
                                                                       (guintptr) egl_context,
                                                                       GST_GL_PLATFORM_EGL,
                                                                       GST_GL_API_OPENGL);
            ret = gst_gl_context_activate(gst_gl_context, true);
            if(!ret) {
                GST_ERROR_OBJECT (gst_gl_context, "Failed to activate the wrapped EGL Context.");
                return;
            }

            GError *error = NULL;
            ret = gst_gl_context_fill_info(gst_gl_context, &error);
            if (!ret) {
                GST_ERROR_OBJECT (gst_gl_context, "Failed to create gpu process context: %s",
                                  error->message);
                g_error_free (error);
                // TODO unref context?
                return;
            }

            GstContext *gst_context_gl_context = gst_context_new ("gst.gl.app_context", TRUE);
            gst_structure_set (gst_context_writable_structure (gst_context_gl_context), "context", GST_TYPE_GL_CONTEXT, gst_gl_context, NULL);
            encoder->gst_context_gl_context = gst_context_gl_context;
        }
    }

    gst_element_set_context (pipeline, encoder->gst_context_gl_context);
    gst_element_set_context (pipeline, encoder->gst_context_gl_display);
}

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

struct h264_gst_encoder {
    struct gst_encoder base;
    GstElement *opaque_glshader;
    GstElement *opaque_shader_capsfilter;
    GstElement *alpha_glshader;
    GstElement *alpha_shader_capsfilter;
};

static void
h264_gst_encoder_ensure_size(struct gst_encoder *gst_encoder, const GstCaps *new_src_caps, const u_int32_t width,
							 const u_int32_t height) {
    struct h264_gst_encoder *h264_gst_encoder = (struct h264_gst_encoder *)gst_encoder;
	const GstCaps *current_src_caps = gst_app_src_get_caps(h264_gst_encoder->base.app_src);

    GstStructure *uniforms;
    GstCaps *shader_src_caps;
    gchar *capsstr;

	if (current_src_caps && gst_caps_is_equal(current_src_caps, new_src_caps)) {
		gst_caps_unref((GstCaps *) new_src_caps);
		gst_caps_unref((GstCaps *) current_src_caps);
		return;
	} else if (current_src_caps) {
		gst_caps_unref((GstCaps *) current_src_caps);
	}

	gst_app_src_set_caps(h264_gst_encoder->base.app_src, new_src_caps);
	gst_caps_unref((GstCaps *) new_src_caps);

    u_int32_t padded_width = width + (width % 2);
    u_int32_t padded_height = height + (height % 2);
    gfloat scale_x = (gfloat)width / (gfloat)padded_width;
    gfloat scale_y = (gfloat)height / (gfloat)padded_height;

    uniforms = gst_structure_new("uniforms",
                      "scale_x", G_TYPE_FLOAT, scale_x,
                      "scale_y", G_TYPE_FLOAT, scale_y,
                      NULL);

    capsstr = g_strdup_printf ("video/x-raw(memory:GLMemory),width=%d,height=%d",
                               padded_width, padded_height);
    shader_src_caps = gst_caps_from_string (capsstr);
    g_free (capsstr);

    g_object_set(h264_gst_encoder->opaque_glshader, "uniforms", uniforms, NULL);
    g_object_set(h264_gst_encoder->opaque_shader_capsfilter, "caps", shader_src_caps, NULL);

    if(h264_gst_encoder->alpha_glshader) {
        g_object_set(h264_gst_encoder->alpha_glshader, "uniforms", uniforms, NULL);
        g_object_set(h264_gst_encoder->alpha_shader_capsfilter, "caps", shader_src_caps, NULL);
    }
    gst_structure_free(uniforms);
    gst_caps_unref(shader_src_caps);
}

static void
gst_encoder_destroy(struct encoder *encoder) {
	struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
	gst_element_set_state(gst_encoder->pipeline, GST_STATE_NULL);

	gst_object_unref(gst_encoder->app_src);
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
gst_encoder_encode_shm(struct encoder *encoder,
                        struct wl_shm_buffer *shm_buffer,
                        gst_encoder_ensure_size_func_t gst_encoder_ensure_size,
                        struct encoding_result *encoding_result) {
    struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;

    GstBuffer *buffer;
    uint32_t buffer_width, buffer_height;
    GstFlowReturn ret;
    char gst_format[16];
    const GstCaps *new_src_caps;

    buffer = wl_shm_buffer_to_gst_buffer(shm_buffer, &buffer_width, &buffer_height, gst_format);
    if (buffer == NULL) {
        return -1;
    }

    encoding_result->width = buffer_width;
    encoding_result->height = buffer_height;

    new_src_caps = gst_caps_new_simple("video/x-raw",
                          "framerate", GST_TYPE_FRACTION, FPS, 1,
                          "format", G_TYPE_STRING, gst_format,
                          "width", G_TYPE_INT, buffer_width,
                          "height", G_TYPE_INT, buffer_height,
                          NULL);

    gst_encoder_ensure_size(gst_encoder, new_src_caps, buffer_width, buffer_height);

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
gst_encoder_encode_linux_dmabuf_v1(struct encoder *encoder, struct wl_resource *buffer,
                                   gst_encoder_ensure_size_func_t gst_encoder_ensure_size,
                                   struct encoding_result *encoding_result) {
    struct gst_encoder *gst_encoder = (struct gst_encoder *) encoder->impl;
    struct westfield_dmabuf_v1_buffer *westfield_dmabuf_v1_buffer = westfield_dmabuf_v1_buffer_from_buffer_resource(buffer);
    int buffer_width = westfield_dmabuf_v1_buffer->base.width;
    int buffer_height = westfield_dmabuf_v1_buffer->base.height;
    GstFlowReturn ret;
    GstCaps *new_src_caps;

    encoding_result->width = buffer_width;
    encoding_result->height = buffer_height;

    GstVideoFormat gst_video_format = gst_video_format_from_fourcc(westfield_dmabuf_v1_buffer->attributes.format);
    if(gst_video_format == GST_VIDEO_FORMAT_UNKNOWN) {
        // TODO error out
        return -1;
    }

    new_src_caps = gst_caps_new_simple("video/x-raw",
                                       "format", G_TYPE_STRING,
                                       gst_video_format_to_string(gst_video_format),
                                       "width", G_TYPE_INT, buffer_width,
                                       "height", G_TYPE_INT, buffer_height,
                                       "framerate", GST_TYPE_FRACTION,
                                       FPS, 1000,
                                       NULL);

    gst_encoder_ensure_size(gst_encoder, new_src_caps, buffer_width, buffer_height);

    if (gst_encoder->playing == 0) {
        gst_element_set_state(gst_encoder->pipeline, GST_STATE_PLAYING);
        if (gst_element_get_state(gst_encoder->pipeline, NULL, NULL, 0) == GST_STATE_CHANGE_FAILURE) {
            return -1;
        }
        gst_encoder->playing = 1;
    }

    GstBuffer *buf = gst_buffer_new();

    gsize offsets[westfield_dmabuf_v1_buffer->attributes.n_planes];
    gint strides[westfield_dmabuf_v1_buffer->attributes.n_planes];

    for (int i = 0; i < westfield_dmabuf_v1_buffer->attributes.n_planes; ++i) {
        offsets[i] = westfield_dmabuf_v1_buffer->attributes.offset[i];
        strides[i] = (gint)westfield_dmabuf_v1_buffer->attributes.stride[i];
        GstMemory *mem = gst_dmabuf_allocator_alloc(gst_encoder->dma_buf_allocator,
                                                 westfield_dmabuf_v1_buffer->attributes.fd[i],
                                                 westfield_dmabuf_v1_buffer->attributes.stride[i]*westfield_dmabuf_v1_buffer->attributes.height);
        gst_buffer_append_memory(buf, mem);
    }

    gst_buffer_add_video_meta_full(buf,
                                   GST_VIDEO_FRAME_FLAG_NONE,
                                   gst_video_format,
                                   buffer_width,
                                   buffer_height,
                                   westfield_dmabuf_v1_buffer->attributes.n_planes,
                                   offsets,
                                   strides);

    g_queue_push_head(encoder->encoding_results, encoding_result);
    ret = gst_app_src_push_buffer(gst_encoder->app_src, buf);

    if (ret != GST_FLOW_OK) {
        /* We got some error, stop sending data */
        return -1;
    }
    // TODO memory management/lifecycle of buffer?

    return 0;
}

static int
gst_encoder_encode(struct encoder *encoder, struct wl_resource *buffer_resource,
                   gst_encoder_ensure_size_func_t ensure_size, struct encoding_result *encoding_result) {
    struct wl_shm_buffer *shm_buffer;


    if(westfield_dmabuf_v1_resource_is_buffer(buffer_resource)) {
        return gst_encoder_encode_linux_dmabuf_v1(encoder, buffer_resource, ensure_size, encoding_result);
    }

	shm_buffer = wl_shm_buffer_get((struct wl_resource *) buffer_resource);
	if (shm_buffer) {
        return gst_encoder_encode_shm(encoder, shm_buffer, ensure_size, encoding_result);
	}
}

static int
h264_gst_encoder_encode(struct encoder *encoder, struct wl_resource *buffer_resource,
						struct encoding_result *encoding_result) {
	encoding_result->encoding_type = h264;
	return gst_encoder_encode(encoder, buffer_resource, h264_gst_encoder_ensure_size, encoding_result);
}

static GstBusSyncReply
sync_bus_call (__attribute__((unused)) GstBus *bus, GstMessage *msg, gpointer data) {
    struct encoder *encoder = data;

    switch (GST_MESSAGE_TYPE (msg)) {
        case GST_MESSAGE_NEED_CONTEXT:
        {
            const gchar *context_type;

            gst_message_parse_context_type (msg, &context_type);
            if (g_strcmp0 (context_type, GST_GL_DISPLAY_CONTEXT_TYPE) == 0 && encoder->drm_context) {
                gst_element_set_context (GST_ELEMENT (msg->src), encoder->gst_context_gl_display);
            }

            if (g_strcmp0 (context_type, "gst.gl.app_context") == 0) {
                gst_element_set_context (GST_ELEMENT (msg->src), encoder->gst_context_gl_context);
            }
            break;
        }
        default:
            break;
    }

    return GST_BUS_DROP;
}

static void
setup_pipeline_bus_listeners(struct encoder *encoder, GstElement *pipeline){
    GstBus *bus = gst_element_get_bus(pipeline);
    gst_bus_set_sync_handler(bus, sync_bus_call, encoder, NULL);
}

static int
nvh264_gst_alpha_encoder_create(struct encoder *encoder) {
    struct h264_gst_encoder *h264_gst_encoder = g_new0(struct h264_gst_encoder, 1);
    h264_gst_encoder->base.dma_buf_allocator = gst_dmabuf_allocator_new();

    h264_gst_encoder->base.pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
			"tee name=t ! queue ! "
			"glupload ! "
			"glcolorconvert ! "
			"glshader name=alpha ! "
            "capsfilter name=alpha_shader_capsfilter ! "
            "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"nvh264enc qp-max=20 zerolatency=true preset=5 rc-mode=4 ! "
			"video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=alphasink "
			"t. ! queue ! "
            "glupload ! "
            "glcolorconvert ! "
            "glshader name=opaque ! "
            "capsfilter name=opaque_shader_capsfilter ! "
            "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"nvh264enc qp-max=20 zerolatency=true preset=5 rc-mode=4 ! "
			"video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
	if (h264_gst_encoder->base.pipeline == NULL) {
		return -1;
	}
    setup_pipeline_bus_listeners(encoder, h264_gst_encoder->base.pipeline);

	GstElement *alpha_glshader = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "alpha");
	g_object_set(alpha_glshader, "fragment", alpha_fragment_shader, NULL);
	g_object_set(alpha_glshader, "vertex", vertex_shader, NULL);
    h264_gst_encoder->alpha_glshader = alpha_glshader;
    h264_gst_encoder->alpha_shader_capsfilter = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "alpha_shader_capsfilter");

    GstElement *opaque_glshader = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque");
	g_object_set(opaque_glshader, "fragment", opaque_fragment_shader, NULL);
	g_object_set(opaque_glshader, "vertex", vertex_shader, NULL);
    h264_gst_encoder->opaque_glshader = opaque_glshader;
    h264_gst_encoder->opaque_shader_capsfilter = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque_shader_capsfilter");

    h264_gst_encoder->base.app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "src"));
    h264_gst_encoder->base.app_sink_alpha = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "alphasink"));
    h264_gst_encoder->base.app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "sink"));

	gst_app_sink_set_callbacks(h264_gst_encoder->base.app_sink, &sample_callback, (gpointer) encoder, NULL);
	gst_app_sink_set_callbacks(h264_gst_encoder->base.app_sink_alpha, &alpha_sample_callback, (gpointer) encoder, NULL);

	encoder->impl = h264_gst_encoder;
    ensure_gst_gl(encoder, h264_gst_encoder->base.pipeline);

	return 0;
}

static int
nvh264_gst_encoder_create(struct encoder *encoder) {
    struct h264_gst_encoder *h264_gst_encoder = g_new0(struct h264_gst_encoder, 1);
    h264_gst_encoder->base.dma_buf_allocator = gst_dmabuf_allocator_new();

	h264_gst_encoder->base.pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
            "glupload ! "
            "glcolorconvert ! "
            "glshader name=opaque ! "
            "capsfilter name=opaque_shader_capsfilter ! "
            "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"nvh264enc gop-size=500 qp-max=20 zerolatency=true preset=5 rc-mode=4 ! "
			"video/x-h264,profile=baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
	if (h264_gst_encoder->base.pipeline == NULL) {
		return -1;
	}
    setup_pipeline_bus_listeners(encoder, h264_gst_encoder->base.pipeline);

    GstElement *opaque_glshader = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque");
    g_object_set(opaque_glshader, "fragment", opaque_fragment_shader, NULL);
    g_object_set(opaque_glshader, "vertex", vertex_shader, NULL);
    h264_gst_encoder->opaque_glshader = opaque_glshader;
    h264_gst_encoder->opaque_shader_capsfilter = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque_shader_capsfilter");

    h264_gst_encoder->base.app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "src"));
    h264_gst_encoder->base.app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "sink"));

	gst_app_sink_set_callbacks(h264_gst_encoder->base.app_sink, &sample_callback, (gpointer) encoder, NULL);

	encoder->impl = h264_gst_encoder;
    ensure_gst_gl(encoder, h264_gst_encoder->base.pipeline);

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
    // TODO check for dma buffer
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
    struct h264_gst_encoder *h264_gst_encoder = g_new0(struct h264_gst_encoder, 1);
    h264_gst_encoder->base.dma_buf_allocator = gst_dmabuf_allocator_new();

    h264_gst_encoder->base.pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
			"tee name=t ! queue ! "
			"glupload ! "
			"glcolorconvert ! "
            "glshader name=alpha ! "
            "capsfilter name=alpha_shader_capsfilter ! "
			"glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"gldownload ! queue ! "
			"x264enc rc-lookahead=0 sliced-threads=true qp-max=20 byte-stream=true pass=pass1 tune=zerolatency speed-preset=superfast noise-reduction=0 psy-tune=grain ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=alphasink "
			"t. ! queue ! "
			"glupload ! "
            "glcolorconvert ! "
            "glshader name=opaque ! "
            "capsfilter name=opaque_shader_capsfilter ! "
			"glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"gldownload ! queue ! "
			"x264enc rc-lookahead=0 sliced-threads=true qp-max=20 byte-stream=true pass=pass1 tune=zerolatency speed-preset=superfast noise-reduction=0 psy-tune=grain ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
	if (h264_gst_encoder->base.pipeline == NULL) {
		return -1;
	}
    setup_pipeline_bus_listeners(encoder, h264_gst_encoder->base.pipeline);

    GstElement *alpha_glshader = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "alpha");
    g_object_set(alpha_glshader, "fragment", alpha_fragment_shader, NULL);
    g_object_set(alpha_glshader, "vertex", vertex_shader, NULL);
    h264_gst_encoder->alpha_glshader = alpha_glshader;
    h264_gst_encoder->alpha_shader_capsfilter = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "alpha_shader_capsfilter");

    GstElement *opaque_glshader = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque");
    g_object_set(opaque_glshader, "fragment", opaque_fragment_shader, NULL);
    g_object_set(opaque_glshader, "vertex", vertex_shader, NULL);
    h264_gst_encoder->opaque_glshader = opaque_glshader;
    h264_gst_encoder->opaque_shader_capsfilter = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque_shader_capsfilter");

    h264_gst_encoder->base.app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "src"));
    h264_gst_encoder->base.app_sink_alpha = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "alphasink"));
    h264_gst_encoder->base.app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "sink"));

	gst_app_sink_set_callbacks(h264_gst_encoder->base.app_sink, &sample_callback, (gpointer) encoder, NULL);
	gst_app_sink_set_callbacks(h264_gst_encoder->base.app_sink_alpha, &alpha_sample_callback, (gpointer) encoder, NULL);

	encoder->impl = h264_gst_encoder;
    ensure_gst_gl(encoder, h264_gst_encoder->base.pipeline);

	return 0;
}

static int
x264_gst_encoder_create(struct encoder *encoder) {
    struct h264_gst_encoder *h264_gst_encoder = g_new0(struct h264_gst_encoder, 1);
    h264_gst_encoder->base.dma_buf_allocator = gst_dmabuf_allocator_new();

    h264_gst_encoder->base.pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
			"glupload ! "
            "glcolorconvert ! "
            "glshader name=opaque ! "
            "capsfilter name=opaque_shader_capsfilter ! "
            "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"gldownload ! queue ! "
			"x264enc qp-max=20 byte-stream=true pass=pass1 tune=zerolatency speed-preset=medium ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
	if (h264_gst_encoder->base.pipeline == NULL) {
		return -1;
	}
    setup_pipeline_bus_listeners(encoder, h264_gst_encoder->base.pipeline);

    GstElement *opaque_glshader = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque");
    g_object_set(opaque_glshader, "fragment", opaque_fragment_shader, NULL);
    g_object_set(opaque_glshader, "vertex", vertex_shader, NULL);
    h264_gst_encoder->opaque_glshader = opaque_glshader;
    h264_gst_encoder->opaque_shader_capsfilter = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque_shader_capsfilter");

    h264_gst_encoder->base.app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "src"));
    h264_gst_encoder->base.app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "sink"));

	gst_app_sink_set_callbacks(h264_gst_encoder->base.app_sink, &sample_callback, (gpointer) encoder, NULL);

	encoder->impl = h264_gst_encoder;
    ensure_gst_gl(encoder, h264_gst_encoder->base.pipeline);

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

struct png_gst_encoder {
    struct gst_encoder base;
    GstElement *videobox;
};

static int
png_gst_encoder_create(struct encoder *encoder) {
	struct png_gst_encoder *png_gst_encoder = g_new0(struct png_gst_encoder, 1);
    png_gst_encoder->base.dma_buf_allocator = gst_dmabuf_allocator_new();

    // TODO add a gldownload element so we can deal with glmemory buffers
    png_gst_encoder->base.pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
            "gldownload ! "
			"videobox name=videobox border-alpha=0.0 ! "
			"videoconvert ! videoscale ! "
			"pngenc ! "
			"appsink name=sink",
			NULL);

	if (png_gst_encoder->base.pipeline == NULL) {
		return -1;
	}
    setup_pipeline_bus_listeners(encoder, png_gst_encoder->base.pipeline);

    png_gst_encoder->base.app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(png_gst_encoder->base.pipeline), "src"));
    png_gst_encoder->videobox = gst_bin_get_by_name(GST_BIN(png_gst_encoder->base.pipeline), "videobox");
    png_gst_encoder->base.app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(png_gst_encoder->base.pipeline), "sink"));

	gst_app_sink_set_callbacks(png_gst_encoder->base.app_sink, &sample_callback, (gpointer) encoder, NULL);

	encoder->impl = png_gst_encoder;
    ensure_gst_gl(encoder, png_gst_encoder->base.pipeline);

	return 0;
}

static void
png_gst_encoder_ensure_size(struct gst_encoder *gst_encoder, const GstCaps *new_src_caps, const u_int32_t width,
							const u_int32_t height) {
    struct png_gst_encoder *png_gst_encoder = (struct png_gst_encoder *)gst_encoder;
	const GstCaps *current_src_caps = gst_app_src_get_caps(png_gst_encoder->base.app_src);

	if (current_src_caps && gst_caps_is_equal(current_src_caps, new_src_caps)) {
		gst_caps_unref((GstCaps *) new_src_caps);
		gst_caps_unref((GstCaps *) current_src_caps);
		return;
	} else if (current_src_caps) {
		gst_caps_unref((GstCaps *) current_src_caps);
	}

	gst_app_src_set_caps(png_gst_encoder->base.app_src, new_src_caps);
	gst_caps_unref((GstCaps *) new_src_caps);

	g_object_set(png_gst_encoder->videobox, "bottom", height < 16 ? height - 16 : 0, "right", width < 16 ? width - 16 : 0,
				 NULL);
}

static int
png_gst_encoder_supports_buffer(struct encoder *encoder, struct wl_resource *buffer_resource) {
	struct wl_shm_buffer *shm_buffer = wl_shm_buffer_get(buffer_resource);
    // TODO check for eglimage (drm/dma) buffer
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
    struct h264_gst_encoder *h264_gst_encoder = g_new0(struct h264_gst_encoder, 1);
    h264_gst_encoder->base.dma_buf_allocator = gst_dmabuf_allocator_new();

    h264_gst_encoder->base.pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
			"tee name=t ! queue ! "
			"glupload ! "
			"glcolorconvert ! "
            "glshader name=alpha ! "
            "capsfilter name=alpha_shader_capsfilter ! "
            "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"gldownload ! queue ! "
			"vaapih264enc aud=1 ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=alphasink "
			"t. ! queue ! "
			"glupload ! "
            "glshader name=opaque ! "
            "capsfilter name=opaque_shader_capsfilter ! "
            "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
			"gldownload ! queue ! "
			"vaapih264enc aud=1 ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
    if (h264_gst_encoder->base.pipeline == NULL) {
        return -1;
    }
    setup_pipeline_bus_listeners(encoder, h264_gst_encoder->base.pipeline);

    GstElement *alpha_glshader = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "alpha");
    g_object_set(alpha_glshader, "fragment", alpha_fragment_shader, NULL);
    g_object_set(alpha_glshader, "vertex", vertex_shader, NULL);
    h264_gst_encoder->alpha_glshader = alpha_glshader;
    h264_gst_encoder->alpha_shader_capsfilter = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "alpha_shader_capsfilter");


    GstElement *opaque_glshader = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque");
    g_object_set(opaque_glshader, "fragment", opaque_fragment_shader, NULL);
    g_object_set(opaque_glshader, "vertex", vertex_shader, NULL);
    h264_gst_encoder->opaque_glshader = opaque_glshader;
    h264_gst_encoder->opaque_shader_capsfilter = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque_shader_capsfilter");

    h264_gst_encoder->base.app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "src"));
    h264_gst_encoder->base.app_sink_alpha = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "alphasink"));
    h264_gst_encoder->base.app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "sink"));

	gst_app_sink_set_callbacks(h264_gst_encoder->base.app_sink, &sample_callback, (gpointer) encoder, NULL);
	gst_app_sink_set_callbacks(h264_gst_encoder->base.app_sink_alpha, &alpha_sample_callback, (gpointer) encoder, NULL);

	encoder->impl = h264_gst_encoder;
    ensure_gst_gl(encoder, h264_gst_encoder->base.pipeline);

	return 0;
}

static int
vaapi264_gst_encoder_create(struct encoder *encoder) {
    struct h264_gst_encoder *h264_gst_encoder = g_new0(struct h264_gst_encoder, 1);
    h264_gst_encoder->base.dma_buf_allocator = gst_dmabuf_allocator_new();

    h264_gst_encoder->base.pipeline = gst_parse_launch(
			"appsrc name=src format=3 stream-type=0 ! "
            "glupload ! "
            "glshader name=opaque ! "
            "capsfilter name=opaque_shader_capsfilter ! "
            "glcolorconvert ! video/x-raw(memory:GLMemory),format=NV12 ! "
            "gldownload ! queue ! "
			"vaapih264enc aud=true ! "
			"video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au ! "
			"appsink name=sink",
			NULL);
    if (h264_gst_encoder->base.pipeline == NULL) {
        return -1;
    }
    setup_pipeline_bus_listeners(encoder, h264_gst_encoder->base.pipeline);

    GstElement *opaque_glshader = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque");
    g_object_set(opaque_glshader, "fragment", opaque_fragment_shader, NULL);
    g_object_set(opaque_glshader, "vertex", vertex_shader, NULL);
    h264_gst_encoder->opaque_glshader = opaque_glshader;
    h264_gst_encoder->opaque_shader_capsfilter = gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "opaque_shader_capsfilter");

    h264_gst_encoder->base.app_src = GST_APP_SRC(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "src"));
    h264_gst_encoder->base.app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(h264_gst_encoder->base.pipeline), "sink"));

    gst_app_sink_set_callbacks(h264_gst_encoder->base.app_sink, &sample_callback, (gpointer) encoder, NULL);

	encoder->impl = h264_gst_encoder;
    ensure_gst_gl(encoder, h264_gst_encoder->base.pipeline);

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
do_gst_init() {
    gst_init(NULL,NULL);
}

int
do_gst_encoder_create(char preferred_encoder[16], frame_callback_func frame_ready_callback, void *user_data,
					  struct encoder **encoder_pp, struct westfield_drm *drm_context) {
	struct encoder *encoder = g_new0(struct encoder, 1);

	strncpy(encoder->preferred_encoder, preferred_encoder, sizeof(encoder->preferred_encoder));
	encoder->preferred_encoder[sizeof(encoder->preferred_encoder) - 1] = '\0';
	encoder->frame_callback = frame_ready_callback;
	encoder->user_data = user_data;
	encoder->encoding_results = g_queue_new();
    encoder->drm_context = drm_context;

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

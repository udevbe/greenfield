#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "encoder.h"
#include "shm.h"
#include "x264_gst_encoder.h"
#include "png_gst_encoder.h"
#include "nv264_gst_encoder.h"

#define DECLARE_NAPI_METHOD(name, func)                          \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

#define GET_AND_THROW_LAST_ERROR(env)                                    \
    const napi_extended_error_info *error_info;                          \
    napi_get_last_error_info((env), &error_info);                        \
    bool is_pending;                                                     \
    napi_is_exception_pending((env), &is_pending);                       \
    /* If an exception is already pending, don't rethrow it */           \
    if (!is_pending) {                                                   \
      const char* error_message = error_info->error_message != NULL ?    \
        error_info->error_message :                                      \
        "empty error message";                                           \
      napi_throw_error((env), NULL, error_message);                      \
    }

#define NAPI_CALL(env, the_call) {                                       \
    if ((the_call) != napi_ok) {                                         \
        GET_AND_THROW_LAST_ERROR((env));                                 \
    }                                                                    \
}

struct mapped_gst_buffer {
    GstMapInfo info;
    GstBuffer *buffer;
};

static void encoder_finalize_cb(napi_env env,
                                void *finalize_data,
                                void *finalize_hint) {
    struct encoder *encoder = finalize_data;
    encoder->destroy(encoder);

    NAPI_CALL(env, napi_unref_threadsafe_function(env, encoder->callback_data.js_cb_ref))
    NAPI_CALL(env, napi_unref_threadsafe_function(env, encoder->callback_data.js_cb_ref_alpha))
    napi_release_threadsafe_function(encoder->callback_data.js_cb_ref, napi_tsfn_release);
    napi_release_threadsafe_function(encoder->callback_data.js_cb_ref_alpha, napi_tsfn_release);
}

static void
encoder_opaque_sample_ready_callback(struct encoder *encoder, GstSample *sample) {
    napi_call_threadsafe_function(encoder->callback_data.js_cb_ref, (void *) sample, napi_tsfn_blocking);
}

static void
encoder_alpha_sample_ready_callback(struct encoder *encoder, GstSample *sample) {
    napi_call_threadsafe_function(encoder->callback_data.js_cb_ref_alpha, (void *) sample, napi_tsfn_blocking);
}

static void
finalize_gst_mapped_buffer(napi_env env,
                           void *finalize_data,
                           void *finalize_hint) {
    struct mapped_gst_buffer *mapped_gst_buffer = finalize_hint;
    gst_buffer_unmap(mapped_gst_buffer->buffer, &mapped_gst_buffer->info);
    gst_buffer_unref(mapped_gst_buffer->buffer);
    free(mapped_gst_buffer);
}

static void
gst_sample_to_node_buffer_cb(napi_env env, napi_value js_callback, void *context, void *data) {
    if (env == NULL) {
        gst_sample_unref(data);
        return;
    }
    napi_value separate_alpha_value, buffer_value, global, cb_result;
    struct encoder *encoder = context;
    GstSample *sample = data;
    struct mapped_gst_buffer *mapped_gst_buffer = calloc(1, sizeof(struct mapped_gst_buffer));
    GstBuffer *buffer = gst_buffer_ref(gst_sample_get_buffer(sample));
    gst_sample_unref(sample);

    mapped_gst_buffer->buffer = buffer;
    gst_buffer_map(buffer, &mapped_gst_buffer->info, GST_MAP_READ);

    NAPI_CALL(env, napi_create_external_buffer(env, mapped_gst_buffer->info.size, mapped_gst_buffer->info.data,
                                               finalize_gst_mapped_buffer, mapped_gst_buffer, &buffer_value))
    NAPI_CALL(env, napi_get_boolean(env, encoder->separate_alpha ? TRUE : FALSE, &separate_alpha_value))

    napi_value args[] = {buffer_value, separate_alpha_value};
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_call_function(env, global, js_callback, sizeof(args) / sizeof(args[0]), args, &cb_result))
}

static void
gst_alpha_sample_to_node_buffer_cb(napi_env env, napi_value js_callback, void *context, void *data) {
    if (env == NULL) {
        gst_sample_unref(data);
        return;
    }
    napi_value buffer_value, global, cb_result;
    GstSample *sample = data;
    struct mapped_gst_buffer *mapped_gst_buffer = calloc(1, sizeof(struct mapped_gst_buffer));
    GstBuffer *buffer = gst_buffer_ref(gst_sample_get_buffer(sample));
    gst_sample_unref(sample);

    mapped_gst_buffer->buffer = buffer;
    gst_buffer_map(buffer, &mapped_gst_buffer->info, GST_MAP_READ);

    NAPI_CALL(env, napi_create_external_buffer(env, mapped_gst_buffer->info.size, mapped_gst_buffer->info.data,
                                               finalize_gst_mapped_buffer, mapped_gst_buffer, &buffer_value))

    napi_value args[] = {buffer_value};
    NAPI_CALL(env, napi_get_global(env, &global))
    NAPI_CALL(env, napi_call_function(env, global, js_callback, sizeof(args) / sizeof(args[0]), args, &cb_result))
}

/**
 *
 * @param shm_buffer in
 * @param encoder_type in "x264" or "nvh264"
 * @param encoder out
 * @return 1 on error, 0 on success
 */
static int
createShmEncoder(struct wl_shm_buffer *shm_buffer, char *encoder_type, struct encoder **encoder) {
    const int32_t width = wl_shm_buffer_get_width(shm_buffer);
    const int32_t height = wl_shm_buffer_get_height(shm_buffer);
    const uint32_t shm_format = wl_shm_buffer_get_format(
            shm_buffer); // WL_SHM_FORMAT_ARGB8888 = 0 or WL_SHM_FORMAT_XRGB8888 = 1
    char *gst_format = NULL;

    wayland_shm_to_gst_format(shm_format, &gst_format);
    if (gst_format == NULL) {
        // unsupported shm gst_format.
        return 1;
    }

    if (width * height <= 256 * 256) {
        *encoder = png_gst_encoder_create(gst_format, width, height);
        return 0;
    }

    if (strcmp(encoder_type, "x264") == 0 && shm_format == WL_SHM_FORMAT_ARGB8888) {
        *encoder = x264_gst_alpha_encoder_create(gst_format, width, height);
    } else if (strcmp(encoder_type, "x264") == 0 && shm_format == WL_SHM_FORMAT_XRGB8888) {
        *encoder = x264_gst_encoder_create(gst_format, width, height);
    } else if (strcmp(encoder_type, "nvh264") == 0 && shm_format == WL_SHM_FORMAT_XRGB8888) {
        *encoder = nv264_gst_encoder_create(gst_format, width, height);
    } else if (strcmp(encoder_type, "nvh264") == 0 && shm_format == WL_SHM_FORMAT_ARGB8888) {
        *encoder = nv264_gst_alpha_encoder_create(gst_format, width, height);
    } else {
        return 1;
    }

    return 0;
}


/**
 *  expected nodejs arguments in order:
 *  - string encoder_type - argv[0] // 'x264' | 'nvh264'
 *  - object wl_client - argv[1]
 *  - number buffer_id - argv[2]
 *  - function opaque_callback - argv[3]
 *  - function alpha_callback - argv[4]
 * return:
 *  - object encoderContext
 * @param env
 * @param info
 * @return
 */
napi_value
createEncoder(napi_env env, napi_callback_info info) {
    size_t argc = 4;
    napi_value encoder_value, null_value, cb_name, cb_alpha_name, argv[argc];
    napi_threadsafe_function js_cb_ref, js_cb_ref_alpha;

    size_t encoder_type_length;
    struct encoder *encoder;
    struct wl_resource *buffer_resource;
    struct wl_shm_buffer *shm_buffer;

    struct wl_client *client;
    uint32_t buffer_id;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[0], NULL, 0L, &encoder_type_length))
    char encoder_type[encoder_type_length + 1];
    NAPI_CALL(env, napi_get_value_string_latin1(env, argv[0], encoder_type, sizeof(encoder_type), NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[1], (void **) &client))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[2], &buffer_id))

    buffer_resource = wl_client_get_object(client, buffer_id);
    shm_buffer = wl_shm_buffer_get(buffer_resource);
    if (shm_buffer == NULL) {
        napi_throw_error((env), NULL, "Found a unsupported non shm-buffer. Bailing out.");
        NAPI_CALL(env, napi_get_undefined(env, &encoder_value))
        return encoder_value;
    }

    if (createShmEncoder(shm_buffer, encoder_type, &encoder)) {
        const char msg[] = "No encoder found with type %s";
        char *error_msg = calloc(sizeof(msg) + encoder_type_length, sizeof(char));
        sprintf(error_msg, msg, encoder_type);
        napi_throw_error((env), NULL, error_msg);

        NAPI_CALL(env, napi_get_undefined(env, &encoder_value))
        return encoder_value;
    }

    encoder->callback_data.opaque_sample_ready_callback = encoder_opaque_sample_ready_callback;
    encoder->callback_data.alpha_sample_ready_callback = encoder_alpha_sample_ready_callback;
    NAPI_CALL(env, napi_create_external(env, (void *) encoder, encoder_finalize_cb, NULL, &encoder_value))

    napi_create_string_utf8(env, "opaque_callback", NAPI_AUTO_LENGTH, &cb_name);
    NAPI_CALL(env, napi_create_threadsafe_function(
            env,
            argv[3],
            NULL,
            cb_name,
            0,
            2,
            NULL,
            NULL,
            encoder,
            gst_sample_to_node_buffer_cb,
            &js_cb_ref))
    encoder->callback_data.js_cb_ref = js_cb_ref;

    napi_create_string_utf8(env, "alpha_callback", NAPI_AUTO_LENGTH, &cb_alpha_name);
    NAPI_CALL(env, napi_create_threadsafe_function(
            env, // env
            argv[4], // func
            NULL, // async_resource
            cb_alpha_name, // async_resource_name
            0, // max_queue_size
            2, // initial_thread_count
            NULL, // thread_finalize_data
            NULL, // thread_finalize_cb
            encoder, // context
            gst_alpha_sample_to_node_buffer_cb, // call_js_cb
            &js_cb_ref_alpha)) // result
    encoder->callback_data.js_cb_ref_alpha = js_cb_ref_alpha;

    return encoder_value;
}

// expected arguments in order:
// - encoder - argv[0]
// - object wl_client - argv[1]
// - object buffer_id - argv[2]
// return:
// - void
napi_value
encodeBuffer(napi_env env, napi_callback_info info) {
    size_t argc = 3;
    napi_value argv[argc], return_value;

    struct encoder *encoder;
    struct wl_client *client;
    uint32_t buffer_id;
    struct wl_resource *buffer_resource;

    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, NULL, NULL))
    NAPI_CALL(env, napi_get_value_external(env, argv[0], (void **) &encoder))
    NAPI_CALL(env, napi_get_value_external(env, argv[1], (void **) &client))
    NAPI_CALL(env, napi_get_value_uint32(env, argv[2], &buffer_id))

    buffer_resource = wl_client_get_object(client, buffer_id);

    encoder->encode(encoder, buffer_resource);

    NAPI_CALL(env, napi_get_undefined(env, &return_value))
    return return_value;
}


napi_value
init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
            DECLARE_NAPI_METHOD("createEncoder", createEncoder),
            DECLARE_NAPI_METHOD("encodeBuffer", encodeBuffer),
    };

    NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(napi_property_descriptor), desc))
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

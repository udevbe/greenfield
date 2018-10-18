#include <node_api.h>
#include <assert.h>
#include <stdio.h>

#include <pixman.h>

#define DECLARE_NAPI_METHOD(name, func)                          \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

napi_value
clip(napi_env env, napi_callback_info info) {
    napi_status status;

    uint32_t source_width, source_height, clip_x, clip_y, clip_width, clip_height;
    void *clip_buffer, *source_buffer;
    size_t source_buffer_length, source_buffer_stride, clip_buffer_length, clip_buffer_stride;
    napi_value clip_buffer_value;

    pixman_image_t *source_image, *clip_image;


    // get args: source_buffer, source_width, source_height, clip_x, clip_y, clip_width, clip_height
    size_t argc = 7;
    napi_value argv[argc];
    status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    assert(status == napi_ok);

    status = napi_get_value_uint32(env, argv[1], &source_width);
    assert(status == napi_ok);
    status = napi_get_value_uint32(env, argv[2], &source_height);
    assert(status == napi_ok);
    status = napi_get_buffer_info(env, argv[0], &source_buffer, &source_buffer_length);
    assert(status == napi_ok);
    status = napi_get_value_uint32(env, argv[3], &clip_x);
    assert(status == napi_ok);
    status = napi_get_value_uint32(env, argv[4], &clip_y);
    assert(status == napi_ok);
    status = napi_get_value_uint32(env, argv[5], &clip_width);
    assert(status == napi_ok);
    status = napi_get_value_uint32(env, argv[6], &clip_height);
    assert(status == napi_ok);

    source_buffer_stride = source_width * sizeof(uint32_t); // assume pixel size is an int
    source_image = pixman_image_create_bits_no_clear(PIXMAN_a8r8g8b8,
                                                     source_width, source_height,
                                                     source_buffer,
                                                     (int) source_buffer_stride);

    clip_buffer_stride = clip_width * sizeof(uint32_t);
    clip_buffer_length = clip_buffer_stride * clip_height;
    status = napi_create_buffer(env, clip_buffer_length, &clip_buffer, &clip_buffer_value);
    assert(status == napi_ok);
    clip_image = pixman_image_create_bits(PIXMAN_a8r8g8b8,
                                          clip_width, clip_height,
                                          clip_buffer,
                                          (int) clip_buffer_stride);

    pixman_image_composite32(PIXMAN_OP_SRC,
                             source_image, /* src */
                             NULL, /* mask */
                             clip_image, /* dest */
                             clip_x, clip_y, /* src_x, src_y */
                             0, 0, /* mask_x, mask_y */
                             0, 0, /* dst_x, dst_y */
                             clip_width, clip_height);  /* dst_width, dst_height */

    return clip_buffer_value;
}


napi_value
init(napi_env env, napi_value exports) {
    napi_property_descriptor desc = DECLARE_NAPI_METHOD("clip", clip);
    napi_status status;
    status = napi_define_properties(env, exports, 1, &desc);
    assert(status == napi_ok);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
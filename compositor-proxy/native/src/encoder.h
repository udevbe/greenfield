//
// Created by erik on 9/15/19.
//

#ifndef APP_ENDPOINT_ENCODING_ENCODER_H
#define APP_ENDPOINT_ENCODING_ENCODER_H

#include <westfield-extra.h>
#include <node_api.h>

// encoder data interface, we don't know its contents
struct encoder;

struct encoded_frame {
	void *encoded_data;
	uint32_t size;
};

typedef void (*frame_callback_func)(void *user_data, struct encoded_frame *encoded_frame);

struct encoder;

int
encoder_create(char preferred_encoder[16], frame_callback_func frame_ready_callback, void *user_data, struct encoder **encoder_pp);

int
encoder_encode(struct encoder **encoder_pp, struct wl_resource *buffer_resource, uint32_t serial);

int
encoder_request_key_unit(struct encoder **encoder_pp);

int
encoder_free(struct encoder **encoder_pp);

int
encoded_frame_finalize(struct encoded_frame *encoded_frame);

#endif //APP_ENDPOINT_ENCODING_ENCODER_H

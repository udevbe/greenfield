#include <glib.h>
#include <unistd.h>
#include <sys/eventfd.h>
#include <stdio.h>
#include "encoder.h"

extern int
do_gst_encoder_create(char preferred_encoder[16], frame_callback_func frame_ready_callback, void *user_data,
					  struct encoder **encoder_pp);

extern int
do_gst_encoder_encode(struct encoder **encoder_pp, struct wl_resource *buffer_resource, uint32_t serial);

extern void
do_gst_encoder_free(struct encoder **encoder_pp);

extern void
do_gst_encoded_frame_finalize(struct encoded_frame *encoded_frame);

extern void
do_gst_request_key_unit(struct encoder **encoder_pp);

struct gf_gst_main_loop {
	GMainLoop *main;
	struct SyncSource *src;
};
static struct gf_gst_main_loop *main_loop;

enum gf_message_type {
	encoder_create_type,
	encoder_encode_type,
	encoder_free_type,
	encoded_frame_finalize_type,
	encoder_request_key_unit_type
};

struct gf_message {
	enum gf_message_type type;
	union {
		struct {
			char preferred_encoder[16];
			frame_callback_func frame_ready_callback;
			void *user_data;
			struct encoder **encoder_pp;
		} encoder_create;
		struct {
			struct encoder **encoder_pp;
			struct wl_resource *buffer_resource;
			uint32_t serial;
		} encoder_encode;
		struct {
			struct encoder **encoder_pp;
		} encoder_free;
		struct {
			struct encoded_frame *encoded_frame;
		} encoded_frame_finalize;
		struct {
			struct encoder **encoder_pp;
		} encoder_request_key_unit;
	} body;
};

typedef void (*SyncWorkerCb)(struct gf_message *message, gpointer udata);

static void
message_free(gpointer item) {
	free(item);
}

struct SyncSource {
	GSource parent;

	gint fd;
	gpointer fd_tag;

	GAsyncQueue *work_queue;
};

static gboolean
syso_prepare(GSource *_source, gint *timeout) {
	struct SyncSource *source = (struct SyncSource *) _source;
	return (g_source_query_unix_fd(_source, source->fd_tag) > 0);
}

static gboolean
syso_check(GSource *_source) {
	struct SyncSource *source = (struct SyncSource *) _source;
	return (g_source_query_unix_fd(_source, source->fd_tag) > 0);
}

static gboolean
syso_dispatch(GSource *_source, GSourceFunc callback, gpointer user_data) {
	struct SyncSource *source = (struct SyncSource *) _source;

	guint64 n_events;
	if (read(source->fd, &n_events, sizeof(n_events)) != sizeof(n_events)) {
		g_warning("EventFD read failed");
		return FALSE;
	}

	SyncWorkerCb cb = (SyncWorkerCb) callback;

	while (n_events-- > 0) {
		struct gf_message *message = g_async_queue_try_pop(source->work_queue);
		if (message) {
			if (cb) {
				(*cb)(message, user_data);
			}
			free(message);
		}
	}

	return TRUE;
}

static void
syso_finalize(GSource *_source) {
	struct SyncSource *source = (struct SyncSource *) _source;

	close(source->fd);
	g_async_queue_unref(source->work_queue);
}

static GSourceFuncs syncsource_funcs = {
		syso_prepare,
		syso_check,
		syso_dispatch,
		syso_finalize
};

static GSource *
sync_source_create() {
	GSource *ret = g_source_new(&syncsource_funcs, sizeof(struct SyncSource));

	struct SyncSource *source = (struct SyncSource *) ret;

	source->fd = eventfd(0, 0);
	source->work_queue = g_async_queue_new_full(message_free);

	source->fd_tag = g_source_add_unix_fd(ret, source->fd, G_IO_IN);

	return ret;
}

static gboolean
main_loop_handle_message(struct gf_message *message) {
	switch (message->type) {
		case encoder_create_type:
			do_gst_encoder_create(message->body.encoder_create.preferred_encoder,
								  message->body.encoder_create.frame_ready_callback,
								  message->body.encoder_create.user_data,
								  message->body.encoder_create.encoder_pp
			);
			break;
		case encoder_encode_type:
			do_gst_encoder_encode(message->body.encoder_encode.encoder_pp,
								  message->body.encoder_encode.buffer_resource,
								  message->body.encoder_encode.serial
			);
			break;
		case encoder_free_type:
			do_gst_encoder_free(message->body.encoder_free.encoder_pp);
			break;
		case encoded_frame_finalize_type:
			do_gst_encoded_frame_finalize(message->body.encoded_frame_finalize.encoded_frame);
			break;
		case encoder_request_key_unit_type:
			do_gst_request_key_unit(message->body.encoder_request_key_unit.encoder_pp);
			break;
	}
	return G_SOURCE_CONTINUE;
}

static void *
gf_gst_main_loop_ini(gpointer data) {
	GMainLoop *main = g_main_loop_new(NULL, FALSE);

	GSource *worker = sync_source_create();
	g_source_attach(worker, NULL);
	g_source_unref(worker);
	g_source_set_callback(worker, G_SOURCE_FUNC(main_loop_handle_message), NULL, NULL);

	main_loop = malloc(sizeof(struct gf_gst_main_loop));
	main_loop->main = main;
	main_loop->src = (struct SyncSource *) worker;

	g_main_loop_run(main);

	g_main_loop_unref(main);
	g_source_destroy(worker);

	return NULL;
}

__attribute__((constructor))
static
void init_gst_main_loop() {
	g_thread_new("gf_gst_main_loop", gf_gst_main_loop_ini, NULL);
}

static int
send_message(struct gf_message *message) {
	g_async_queue_push(main_loop->src->work_queue, message);
	guint64 event = 1;
	if (write(main_loop->src->fd, &event, sizeof(event)) == -1) {
		return -1;
	}
	return 0;
}

int
encoder_create(char preferred_encoder[16], frame_callback_func frame_ready_callback, void *user_data,
			   struct encoder **encoder_pp) {
	struct gf_message *message = malloc(sizeof(struct gf_message));

	message->type = encoder_create_type;
	sprintf(message->body.encoder_create.preferred_encoder, "%s", preferred_encoder);
	message->body.encoder_create.frame_ready_callback = frame_ready_callback;
	message->body.encoder_create.user_data = user_data;
	message->body.encoder_create.encoder_pp = encoder_pp;

	return send_message(message);
}

int
encoder_encode(struct encoder **encoder_pp, struct wl_resource *buffer_resource, uint32_t serial) {
	struct gf_message *message = malloc(sizeof(struct gf_message));

	message->type = encoder_encode_type;
	message->body.encoder_encode.encoder_pp = encoder_pp;
	message->body.encoder_encode.buffer_resource = buffer_resource;
	message->body.encoder_encode.serial = serial;

	return send_message(message);
}

int
encoder_free(struct encoder **encoder_pp) {
	struct gf_message *message = malloc(sizeof(struct gf_message));

	message->type = encoder_free_type;
	message->body.encoder_free.encoder_pp = encoder_pp;

	return send_message(message);
}

int
encoded_frame_finalize(struct encoded_frame *encoded_frame) {
	struct gf_message *message = malloc(sizeof(struct gf_message));

	message->type = encoded_frame_finalize_type;
	message->body.encoded_frame_finalize.encoded_frame = encoded_frame;

	return send_message(message);
}

int
encoder_request_key_unit(struct encoder **encoder_pp) {
	struct gf_message *message = malloc(sizeof(struct gf_message));

	message->type = encoder_request_key_unit_type;
	message->body.encoder_request_key_unit.encoder_pp = encoder_pp;

	return send_message(message);
}

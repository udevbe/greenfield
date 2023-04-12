#include <gst/gstelement.h>
#include <gst/app/gstappsink.h>
#include <glib.h>
#include <gst/gst.h>
#include "encoder.h"

#include <stdbool.h>
#include <unistd.h>

enum audio_encoding_type
{
    aac,
};

struct sample_callback_data
{
    const struct audio_encoder *encoder;
};

struct audio_encoding_result
{
    struct __attribute__((__packed__))
    {
        enum audio_encoding_type audio_encoding_type;
        // TODO extra metadata required for decoding can go here
    } props;
    struct
    {
        GstMapInfo info;
        GstBuffer *buffer;
    } sample;
};

struct audio_encoder
{
    struct gst_audio_encoder *impl;
    audio_callback_func audio_callback;
    void* user_data;
    bool terminated;
    pid_t pid;
};

struct gst_audio_encoder_pipeline
{
    struct gst_audio_encoder *gst_audio_encoder;
    GstElement *pipeline;
    gulong app_src_pad_probe;
    bool playing;
    bool eos;
};

struct gst_audio_encoder
{
    struct audio_encoder *audio_encoder;
//    const char *pipeline_definition;
    struct gst_audio_encoder_pipeline *pipeline;
};

GList *audio_encoders;

static GstBusSyncReply
sync_bus_call(__attribute__((unused)) GstBus *bus, GstMessage *msg, gpointer data)
{
    struct gst_audio_encoder_pipeline *gst_encoder_pipeline = data;

    switch (GST_MESSAGE_TYPE(msg))
    {
    case GST_MESSAGE_EOS:
    {
        return GST_BUS_PASS;
    }
    default:
        break;
    }

    gst_message_unref(msg);
    return GST_BUS_DROP;
}

static gboolean
async_bus_call(GstBus *bus, GstMessage *msg, gpointer data)
{
    struct gst_audio_encoder_pipeline *gst_encoder_pipeline = data;

    switch (GST_MESSAGE_TYPE(msg))
    {
    case GST_MESSAGE_EOS:
    {
        gst_encoder_pipeline->eos = true;
        return 0;
        // gst_audio_encoder_destroy_if_eos(gst_encoder_pipeline->gst_audio_encoder);
    }
    default:
        break;
    }

    return TRUE;
}

struct encoded_audio *
audio_encoding_result_to_encoded_chunk(struct audio_encoding_result *encoding_result)
{
    gsize  chunk_length, offset, encoded_audio_blob_size;
    struct encoded_audio *encoded_chunk;

    chunk_length = gst_buffer_get_size(encoding_result->sample.buffer);

    offset = 0;
    encoded_audio_blob_size =
        sizeof(encoding_result->props) +
        sizeof(uint32_t) +
        chunk_length;
    void *audio_blob = calloc(1, encoded_audio_blob_size);

    memcpy(audio_blob + offset, &encoding_result->props, sizeof(encoding_result->props));
    offset += sizeof(encoding_result->props);

    memcpy(audio_blob + offset, &encoding_result->sample.info.size, sizeof(uint32_t));
    offset += sizeof(uint32_t);

    memcpy(audio_blob + offset, encoding_result->sample.info.data, chunk_length);
   
    encoded_chunk = calloc(1, sizeof(struct encoded_audio));
    encoded_chunk->encoded_data = audio_blob;
    encoded_chunk->size = encoded_audio_blob_size;

    return encoded_chunk;
}

static GstFlowReturn
gst_new_encoded_audio_sample(GstAppSink *appsink, gpointer user_data)
{
    const struct sample_callback_data *callback_data = user_data;
    struct audio_encoding_result *encoding_result = g_new0(struct audio_encoding_result, 1);
    struct encoded_audio *encoded_chunk;
    GstBuffer *buffer;
    // uint32_t buffer_content_serial = 0;
    g_printerr("new_encoded_audio_sample");

    GstSample *sample = gst_app_sink_pull_sample(appsink);
    // link = g_queue_find (callback_data->encoder->audio_encoding_results, gconstpointer data
    if (sample == NULL)
    {
        // end of stream
        return GST_FLOW_OK;
    }
    buffer = gst_sample_get_buffer(sample);
    gst_buffer_ref(buffer);
    gst_sample_unref(sample);

    encoding_result->sample.buffer = buffer;
    gst_buffer_map(encoding_result->sample.buffer, &encoding_result->sample.info, GST_MAP_READ);

    encoded_chunk = audio_encoding_result_to_encoded_chunk(encoding_result);

    if (encoding_result->sample.buffer)
    {
        gst_buffer_unmap(encoding_result->sample.buffer, &encoding_result->sample.info);
        gst_buffer_unref(encoding_result->sample.buffer);
    }
    free(encoding_result);
    callback_data->encoder->audio_callback(callback_data->encoder->user_data, encoded_chunk);

    return GST_FLOW_OK;
}

static GstAppSinkCallbacks encoded_audio_sample_callback = {
    .eos = NULL,
    .new_sample = gst_new_encoded_audio_sample,
    .new_preroll = NULL};
// The gstreamer pipeline that will encode the audio. The pipeline will connect directly to the audio node of the application and will generate encoded audio samples in the appsink element.
// Have a look at the frame encoder how to read encoded data from the appsink and pass it back to the nodejs layer. Tip: The frame encoder has to 'merge' data of 2 pipelines into a single buffer, this is not required here
// so the implementation will be simpler.

// TODO set the pipewire node id on the pipewiresrc element
// TODO more/less/other gstreamer elements?
static const char *audio_pipeline = "pipewiresrc name=pw_src ! "
                                    "rawaudioparse format=pcm pcm-format=f32le sample-rate=48000 num-channels=2 ! "
                                    "audioresample ! "
                                    "audioconvert ! "
                                    "voaacenc ! "
                                    "appsink name=sink ";

static inline void
gst_audio_encoder_pipeline_setup_bus_listeners(struct gst_audio_encoder_pipeline *gst_audio_encoder_pipeline)
{
    GstBus *bus = gst_pipeline_get_bus(GST_PIPELINE(gst_audio_encoder_pipeline->pipeline));
    gst_bus_set_sync_handler(bus, sync_bus_call, gst_audio_encoder_pipeline, NULL);
    gst_bus_add_watch(bus, async_bus_call, gst_audio_encoder_pipeline);
    gst_object_unref(bus);
}


static inline struct gst_audio_encoder_pipeline *
gst_audio_encoder_pipeline_create(struct gst_audio_encoder *gst_encoder, const char *pipeline_definition, uint32_t PW_node_id)
{
    struct gst_audio_encoder_pipeline *gst_audio_encoder_pipeline = g_new0(struct gst_audio_encoder_pipeline, 1);
    struct sample_callback_data *callback_data;
    GstAppSink *app_sink;
    GstElement *app_src;
    GError *parse_error = NULL;

    gst_audio_encoder_pipeline->pipeline = gst_parse_launch_full(
        pipeline_definition,
        NULL,
        GST_PARSE_FLAG_FATAL_ERRORS,
        &parse_error);

    if (gst_audio_encoder_pipeline->pipeline == NULL)
    {
        g_free(gst_audio_encoder_pipeline);
        g_error("BUG? Failed to create encoding pipeline from it's definition: %s", parse_error->message);
    }

    app_sink = GST_APP_SINK(gst_bin_get_by_name(GST_BIN(gst_audio_encoder_pipeline->pipeline), "sink"));
    // gst_app_sink_set_wait_on_eos(app_sink, true);
    callback_data = g_new0(struct sample_callback_data, 1);
    callback_data->encoder = gst_encoder->audio_encoder;
    gst_app_sink_set_callbacks(app_sink, &encoded_audio_sample_callback, (gpointer)callback_data,
                               NULL);
    gst_object_unref(app_sink);

    gst_audio_encoder_pipeline_setup_bus_listeners(gst_audio_encoder_pipeline);

    app_src = GST_ELEMENT(gst_bin_get_by_name(GST_BIN(gst_audio_encoder_pipeline->pipeline), "pw_src"));
    char *node = g_strdup_printf("%i", PW_node_id);
    g_object_set(app_src, "path", node, NULL);

// FIXME make audio-node.c listen for state where we can actually connect to the node and set the pipeline to playing state instead of sleep(1).
    sleep(1);

    gst_element_set_state(gst_audio_encoder_pipeline->pipeline, GST_STATE_PLAYING);
    if (gst_element_get_state(gst_audio_encoder_pipeline->pipeline, NULL, NULL, 0) == GST_STATE_CHANGE_FAILURE)
    {
        g_error("BUG? Could not set pipeline to playing state.");
    }
    gst_audio_encoder_pipeline->playing = true;

    gst_object_unref(app_src);
 
    return gst_audio_encoder_pipeline;
}

static inline void
gst_audio_encoder_create(struct audio_encoder *encoder, const char *pipeline_definition, uint32_t PW_node_id)
{
    struct gst_audio_encoder *gst_audio_encoder = g_new0(struct gst_audio_encoder, 1);
    gst_audio_encoder->audio_encoder = encoder;

    gst_audio_encoder->pipeline = (struct gst_audio_encoder_pipeline *)gst_audio_encoder_pipeline_create(gst_audio_encoder, pipeline_definition, PW_node_id);
    if (gst_audio_encoder->pipeline == NULL)
    {
        g_error("BUG? Failed to create audio pipeline.");
    }
    gst_audio_encoder->pipeline->gst_audio_encoder = gst_audio_encoder;

    encoder->impl = gst_audio_encoder;
}

gint
audio_encoder_by_pid(gconstpointer a, gconstpointer b) {
    struct audio_encoder *audio_encoder = a;
    if(a == NULL) {
        return 1;
    }
    pid_t target_pid = (pid_t) b;
    return audio_encoder->pid != target_pid;
}

void
do_gst_audio_encoder_set_pipewire_node_id_by_pid(uint32_t PW_node_id, pid_t pid)
{
    GList *found = g_list_find_custom(audio_encoders, (gconstpointer) pid, audio_encoder_by_pid);
    if(found) {
        struct audio_encoder *audio_encoder = found->data;
        if(audio_encoder->impl == NULL) {
            g_info("creating audio pipeline for pid %i", pid);
            gst_audio_encoder_create(audio_encoder, audio_pipeline, PW_node_id);
        }
    } else {
        g_info("no audio encoder exists for pid %i, ignoring", pid);
    }
}

void
do_gst_audio_encoder_create(audio_callback_func audio_ready_callback, pid_t pid, void *user_data,
                                 struct audio_encoder **audio_encoder_pp) {
    struct audio_encoder *audio_encoder = g_new0(struct audio_encoder, 1);
    audio_encoder->audio_callback = audio_ready_callback;
    audio_encoder->pid = pid;
    audio_encoder->user_data = user_data;

    *audio_encoder_pp = audio_encoder;
    audio_encoders = g_list_prepend(audio_encoders, audio_encoder);
}


void do_gst_audio_encoder_free(struct audio_encoder **audio_encoder_pp)
{
    struct audio_encoder *encoder = *audio_encoder_pp;
    if (encoder->terminated)
    {
        g_error("BUG. Can not free encoder. Encoder is already terminated.");
    }

    encoder->terminated = true;
    if (encoder->impl != NULL)
    {
        // gst_frame_encoder_eos(encoder->impl);
    }
    else
    {
        // g_queue_free(encoder->frame_encoding_results);
        // encoder->frame_encoding_results = NULL;
        // free(encoder);
    }
}

void do_gst_encoded_audio_finalize(struct encoded_audio *encoded_audio)
{
    free(encoded_audio->encoded_data);
    free(encoded_audio);
}

void do_gst_audio_encoder_init() {
    audio_encoders = g_list_alloc();
}
#include <gst/gstelement.h>
#include <gst/app/gstappsink.h>
#include <gst/app/gstappsrc.h>
#include <glib.h>
#include <gst/gst.h>
#include "audio-node.h"


// #include <gst/pipewire/gstpipewiresrc.h>
// #include <gst/pipewire/pipewiresrc.h>
// #include <gst/app/pipewiresrc.h>
#include <assert.h>
#include "encoder.h"



#include <gst/gl/gstglfuncs.h>
#include <gst/gl/gstglcontext.h>
#include <gst/gl/gstglwindow.h>
#include <gst/gl/gstglbasememory.h>
#include <gst/gl/egl/gstgldisplay_egl.h>
#include <gst/gl/egl/gstgldisplay_egl_device.h>
#include <gst/app/gstappsrc.h>
#include <gst/app/gstappsink.h>
#include <graphene-1.0/graphene-gobject.h>

#include <stdbool.h>
#include <EGL/egl.h>
#include <libdrm/drm_fourcc.h>
#include <unistd.h>
#include <GL/gl.h>
#include <gst/gl/gstglmemory.h>
#include <gst/gl/gstglutils.h>
#include <gst/gl/gstglsyncmeta.h>
#include <gst/gl/egl/gstglmemoryegl.h>
#include "encoder.h"
#include "wlr_drm.h"
#include "wlr_linux_dmabuf_v1.h"
// extern int node_id;
// const GstMetaInfo *gfBufferContentSerialMetaInfo = NULL;

// The structs below are copied and adapted from the video frame encoder implementation.
// They can be adapted, changed, deleted... as required by the implementation.

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
     GMutex mutex;
};

struct audio_encoder
{
    struct gst_audio_encoder *impl;
    audio_callback_func audio_callback;
    void *user_data;
    GQueue *audio_encoding_results;
    bool terminated;
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
    const char *pipeline_definition;
    struct gst_audio_encoder_pipeline *pipeline;
};


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
    // alpha_length = separate_alpha ? gst_buffer_get_size(encoding_result->alpha_sample.buffer) : 0;

    offset = 0;
    encoded_audio_blob_size =
        sizeof(encoding_result->props) +
        sizeof(uint32_t) +
        chunk_length;
    void *audio_blob = malloc(encoded_audio_blob_size);

    memcpy(audio_blob + offset, &encoding_result->props, sizeof(encoding_result->props));
    offset += sizeof(encoding_result->props);

    memcpy(audio_blob + offset, &encoding_result->sample.info.size, sizeof(uint32_t));
    offset += sizeof(uint32_t);

    memcpy(audio_blob + offset, encoding_result->sample.info.data, chunk_length);
    offset += chunk_length;


   
    encoded_chunk = malloc(sizeof(struct encoded_audio));
    encoded_chunk->encoded_data = audio_blob;
    encoded_chunk->size = encoded_audio_blob_size;

    return encoded_chunk;
}

void audio_encoding_result_free(struct audio_encoding_result *encoding_result)
{
    // g_mutex_clear(&encoding_result->mutex);
    if (encoding_result->sample.buffer)
    {
        gst_buffer_unmap(encoding_result->sample.buffer, &encoding_result->sample.info);
        gst_buffer_unref(encoding_result->sample.buffer);
    }
   
    // free(encoding_result);
}
static GstFlowReturn
gst_new_encoded_audio_sample(GstAppSink *appsink, gpointer user_data)
{
     printf("ZAVOLALI MA TAK SOM TU!");
    const struct sample_callback_data *callback_data = user_data;
    struct audio_encoding_result *encoding_result = NULL;
    GList *link;
    struct encoded_audio *encoded_chunk;
    GstBuffer *buffer;
    // uint32_t buffer_content_serial = 0;

    GstSample *sample = gst_app_sink_pull_sample(appsink);
    // link = g_queue_find (callback_data->encoder->audio_encoding_results, gconstpointer data
    if (sample == NULL)
    {
        // end of stream
        printf("E O F \n");
        return GST_FLOW_OK;
    }
    buffer = gst_sample_get_buffer(sample);
    gst_buffer_ref(buffer);
    gst_sample_unref(sample);
    encoding_result = callback_data->encoder->audio_encoding_results;

        //     gst_element_set_state(gst_frame_encoder_pipeline->pipeline, GST_STATE_PLAYING);
        // if (gst_element_get_state(gst_frame_encoder_pipeline->pipeline, NULL, NULL, 0) == GST_STATE_CHANGE_FAILURE)
        // {
        //     g_error("BUG? Could not set pipeline to playing state.");
        // }
        // gst_frame_encoder_pipeline->playing = true;
  if (encoding_result == NULL)
    {
        // end of stream
        printf("PROBLEM \n");
        return GST_FLOW_OK;
    }
    encoding_result->sample.buffer = buffer;
    gst_buffer_map(encoding_result->sample.buffer, &encoding_result->sample.info, GST_MAP_READ);
    // GstCustomMeta *meta = gst_buffer_get_custom_meta(buffer, GF_BUFFER_CONTENT_SERIAL_META);
    // GstStructure *s = gst_custom_meta_get_structure(meta);
    // gst_structure_get_uint(s, "buffer_content_serial", &buffer_content_serial);

    // make sure we have the right encoding result
    // link = g_queue_find_custom(callback_data->encoder->frame_encoding_results, &buffer_content_serial,
    //                            has_buffer_content_serial);
    // if (link)
    // {
    //     encoding_result = link->data;
    // }
    encoded_chunk = audio_encoding_result_to_encoded_chunk(encoding_result);
  
    // encoding_result->sample.buffer = buffer;
    // gst_buffer_map(encoding_result->sample.buffer, &encoding_result->sample.info, GST_MAP_READ);
    audio_encoding_result_free(encoding_result);
    callback_data->encoder->audio_callback(callback_data->encoder->user_data, encoded_chunk);
    // gst_buffer_unref(buffer);

    // free(encoding_result);
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

static GstPadProbeReturn
gst_audio_encoder_pipeline_app_src_have_data(GstPad *pad, GstPadProbeInfo *info, gpointer user_data)
{
    printf("Data for encoding\n");
    // gst_element_set_state(gst_audio_encoder_pipeline->pipeline, GST_STATE_PLAYING);

    struct gst_audio_encoder_pipeline *gst_audio_encoder_pipeline = user_data;
    GstBuffer *buffer = gst_pad_probe_info_get_buffer(info);
     
    // GstAudioMeta *audio_meta = gst_buffer_get_audio_meta(buffer);
    // printf("CO TERAZ");

    
    return GST_PAD_PROBE_OK;
}


static inline struct gst_audio_encoder_pipeline *
gst_audio_encoder_pipeline_create(struct gst_audio_encoder *gst_encoder, int PW_node_id)
{


    struct gst_audio_encoder_pipeline *gst_audio_encoder_pipeline = g_new0(struct gst_audio_encoder_pipeline, 1);
    struct sample_callback_data *callback_data;
    GstAppSink *app_sink;
    // for GstAppSrc: GLib-GObject-WARNING **: 19:35:39.265: invalid cast from 'GstPipeWireSrc' to 'GstAppSrc'
    GstElement *app_src;
    GstPad *pad;
    GError *parse_error = NULL;

    gst_audio_encoder_pipeline->pipeline = gst_parse_launch_full(
        gst_encoder->pipeline_definition,
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
    // toto by malo prejst
    
    app_src = GST_ELEMENT(gst_bin_get_by_name(GST_BIN(gst_audio_encoder_pipeline->pipeline), "pw_src"));

    // if (PW_node_id){
    char *node = g_strdup_printf("%d",pip_node_id);
     
    g_object_set(app_src, "path", node, NULL);

    printf("PATH SET \n"); 
    pad = gst_element_get_static_pad(GST_ELEMENT(app_src), "src");
    // pad = gst_element_get_request_pad(GST_ELEMENT(app_src), "pw_src");

    gst_audio_encoder_pipeline->app_src_pad_probe = gst_pad_add_probe(pad, GST_PAD_PROBE_TYPE_BUFFER,
       (GstPadProbeCallback)gst_audio_encoder_pipeline_app_src_have_data,
       gst_audio_encoder_pipeline, NULL);

        // gst_frame_encoder_pipeline->playing = true;
    if (gst_audio_encoder_pipeline->app_src_pad_probe)
    {
        gst_element_set_state(gst_audio_encoder_pipeline->pipeline, GST_STATE_PLAYING);
        gst_audio_encoder_pipeline->playing = true;

    }

    gst_object_unref(pad);
    gst_object_unref(app_src);
 
    return gst_audio_encoder_pipeline;
}

static inline void
gst_audio_encoder_create(struct audio_encoder *encoder, const char *audio_pipeline)
{

    struct gst_audio_encoder *gst_audio_encoder = g_new0(struct gst_audio_encoder, 1);
    gst_audio_encoder->audio_encoder = encoder;
    gst_audio_encoder->pipeline_definition = audio_pipeline;

    gst_audio_encoder->pipeline = (struct gst_audio_encoder_pipeline *)gst_audio_encoder_pipeline_create(gst_audio_encoder, NULL);
    if (gst_audio_encoder->pipeline == NULL)
    {
        g_error("BUG? Failed to create audio pipeline.");
    }
    gst_audio_encoder->pipeline->gst_audio_encoder = gst_audio_encoder;

    encoder->impl = gst_audio_encoder;

}

//finally not actually recreating, just creating when pipewire calls message with id
void do_gst_audio_encoder_recreate_pipeline(int PW_node_id, char*PID, struct audio_encoder **audio_encoder_pp )
{
    printf("CREATING PIPELINE\n");

    struct audio_encoder *encoder = g_new0(struct audio_encoder, 1);
    encoder = *audio_encoder_pp;
    gst_audio_encoder_create(encoder, audio_pipeline);

  
}

void do_gst_audio_encoder_encode(struct audio_encoder **audio_encoder_pp)
{

    struct audio_encoder *encoder = *audio_encoder_pp;
    if (encoder->terminated)
    {
        g_error("BUG. Can not encode. Encoder is terminated.");
    }

    struct audio_encoding_result *encoding_result;
    if (encoder->impl == NULL)
    {
        gst_audio_encoder_create(encoder, audio_pipeline);
        assert(encoder->impl != NULL && "Found matching encoder and have implementation.");
            
    }
    encoding_result = g_new0(struct audio_encoding_result, 1);
    printf("ENCODING STARTED");
 
}

void do_gst_audio_encoder_create(audio_callback_func audio_ready_callback, void *user_data,
                                 struct audio_encoder **audio_encoder_pp)
{
    // pid_t *client_pid = user_data;
    printf("ENCODER CREATED");

    struct audio_encoder *audio_encoder = g_new0(struct audio_encoder, 1);
    audio_encoder->audio_callback = audio_ready_callback;
    audio_encoder->user_data = user_data;
    audio_encoder->audio_encoding_results = g_queue_new();
    *audio_encoder_pp = audio_encoder;

    // TODO
    // gst_audio_encoder_create(audio_encoder, audio_pipeline);
}


void do_gst_audio_encoder_free(struct audio_encoder **audio_encoder_pp)
{
    struct audio_encoder *encoder = *audio_encoder_pp;
    printf("Audio %p", encoder->impl);
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
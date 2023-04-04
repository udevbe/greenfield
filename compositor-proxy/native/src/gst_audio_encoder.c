#include <gst/gstelement.h>
#include <gst/app/gstappsink.h>
#include <gst/app/gstappsrc.h>
#include <glib.h>
#include <gst/gst.h>
#include "audio-node.h"
// #include <gst/pipewire/gstpipewiresrc.h>
// #include <gst/pipewire/pipewiresrc.h>
// #include <gst/app/pipewiresrc.h>

#include "encoder.h"
#include "audio-node.h"
// extern int node_id;

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
    // gulong app_src_pad_probe;
    bool playing;
    bool eos;
};

struct gst_audio_encoder
{
    struct audio_encoder *audio_encoder;
    const char *pipeline_definition;
    struct gst_audio_encoder_pipeline *pipeline;
};

static GstFlowReturn
gst_new_encoded_audio_sample(GstAppSink *appsink, gpointer user_data)
{
    const struct sample_callback_data *callback_data = user_data;
    struct audio_encoding_result *encoding_result = NULL;
    GList *link;
    struct encoded_audio *encoded_chunk;
    GstBuffer *buffer;
    // uint32_t buffer_content_serial = 0;

    GstSample *sample = gst_app_sink_pull_sample(appsink);

    if (sample == NULL)
    {
        // end of stream
        return GST_FLOW_OK;
    }
    buffer = gst_sample_get_buffer(sample);
    printf("ZAVOLALI MA TAK SOM TU!");
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
static const char *audio_pipeline = "pipewiresrc name=pw_src !"
                                    "rawaudioparse format=pcm pcm-format=f32le sample-rate=48000 num-channels=2 ! "
                                    "audioresample ! "
                                    "audioconvert ! "
                                    "voaacenc ! "
                                    "appsink name=sink ";

// static inline void
// gst_audio_encoder_pipeline_setup_bus_listeners(struct gst_audio_encoder_pipeline *gst_audio_encoder_pipeline)
// {
//     GstBus *bus = gst_pipeline_get_bus(GST_PIPELINE(gst_audio_encoder_pipeline->pipeline));
//     gst_bus_set_sync_handler(bus, sync_bus_call, gst_audio_encoder_pipeline, NULL);
//     gst_bus_add_watch(bus, async_bus_call, gst_audio_encoder_pipeline);
//     gst_object_unref(bus);
// }

static inline struct gst_audio_encoder_pipeline *
gst_audio_encoder_pipeline_create(struct gst_audio_encoder *gst_encoder)
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
    gst_app_sink_set_wait_on_eos(app_sink, true);
    callback_data = g_new0(struct sample_callback_data, 1);
    callback_data->encoder = gst_encoder->audio_encoder;
    gst_app_sink_set_callbacks(app_sink, &encoded_audio_sample_callback, (gpointer)callback_data,
                               NULL);
    gst_object_unref(app_sink);

    // gst_audio_encoder_pipeline_setup_bus_listeners(gst_audio_encoder_pipeline);
    // toto by malo prejst

    app_src = gst_bin_get_by_name(GST_BIN(gst_audio_encoder_pipeline->pipeline), "pw_src");

    gchar *node = g_strdup_printf("%d", pip_node_id);
    // = (char*)&pip_node_id;
    printf("NODAAAAAAAAAAAAA: %d %s\n", pip_node_id, node);
    g_object_set(app_src, "path", node, NULL);
    // printf("PPPPPPPPPPPPPPPPPPPPPPPPLLLLLLLLLLLLLIIIIIIIIIIIIS  %d \n",node_id);

    pad = gst_element_get_static_pad(GST_ELEMENT(app_src), "pw_src");
    // gst_audio_encoder_pipeline->app_src_pad_probe = gst_pad_add_probe(pad, GST_PAD_PROBE_TYPE_BUFFER,
    //   (GstPadProbeCallback)gst_audio_encoder_pipeline_app_src_have_data,
    //   gst_audio_encoder_pipeline, NULL);
    gst_object_unref(pad);
    gst_object_unref(app_src);

    return gst_audio_encoder_pipeline;
}



static inline void
gst_audio_encoder_create(struct audio_encoder *encoder, const char *audio_pipeline)
{
printf("OLaaa\n \n");
    struct gst_audio_encoder *gst_audio_encoder = g_new0(struct gst_audio_encoder, 1);
    gst_audio_encoder->audio_encoder = encoder;
    gst_audio_encoder->pipeline_definition = audio_pipeline;
    // create pipeline

    //  struct audio_encoder *encoder = *audio_encoder_pp;
    //     audio_encoder->audio_callback = audio_ready_callback;
    //     *audio_encoder_pp = audio_encoder;
    //     const char * audio_pipeline;

    // najprv get id

    gst_audio_encoder->pipeline = (struct gst_audio_encoder_pipeline *)gst_audio_encoder_pipeline_create(gst_audio_encoder);
    if (gst_audio_encoder->pipeline == NULL)
    {
        g_error("BUG? Failed to create audio pipeline.");
    }
    gst_audio_encoder->pipeline->gst_audio_encoder = gst_audio_encoder;

    encoder->impl = gst_audio_encoder;
}

void do_gst_audio_encoder_recreate_pipeline(int PW_node_id)
{
printf("OLAAAAAAAA\n\n");
    gchar *node = g_strdup_printf("%d", PW_node_id);

    // = (char*)&pip_node_id;
    // printf("NODAAAAAAAAAAAAA: %d %s\n", pip_node_id, node );
    int required_size = snprintf(NULL, 0, "pipewiresrc name=pw_src path=%s !"
                                          "rawaudioparse format=pcm pcm-format=f32le sample-rate=48000 num-channels=2 ! "
                                          "audioresample ! "
                                          "audioconvert ! "
                                          "voaacenc ! "
                                          "appsink name=sink ",
                                 node);

    // Allocate memory for the resulting string
    char *new_audio_pipeline = (char *)malloc(required_size + 1); // +1 for the null terminator

    sprintf(new_audio_pipeline, "pipewiresrc name=pw_src path=%s !"
                                "rawaudioparse format=pcm pcm-format=f32le sample-rate=48000 num-channels=2 ! "
                                "audioresample ! "
                                "audioconvert ! "
                                "voaacenc ! "
                                "appsink name=sink ",
            node);

    audio_pipeline = new_audio_pipeline;
    // gst_audio_encoder_create(audio_encoder, audio_pipeline);
    // gst_audio_encoder->pipeline_definition;
}
void do_gst_audio_encoder_encode(struct audio_encoder **audio_encoder_pp)
{

  printf("WWWOOOHOOOU");
    struct audio_encoder *encoder = *audio_encoder_pp;
    if (encoder->terminated)
    {
        g_error("BUG. Can not encode. Encoder is terminated.");
    }

    struct audio_encoding_result *encoding_result;
    if (encoder->impl == NULL)
    {
        gst_audio_encoder_create(encoder, audio_pipeline);
    }
    encoding_result = g_new0(struct audio_encoding_result, 1);
    // printf("WWWOOOHOOOU");
    // gst_audio_encoder_encode(encoder->impl, buffer_resource, encoding_result);
}

void do_gst_audio_encoder_create(audio_callback_func audio_ready_callback, void *user_data,
                                 struct audio_encoder **audio_encoder_pp)
{
    pid_t *client_pid = user_data;
 printf("WWWOOOHOOOU CREATE");
    // TODO lookup  node id from pipewire
    // struct GstElement pipewiresrc = gst_bin_get_by_name(GST_BIN(audio_pipeline), "audio_src");
    // if (!pipewiresrc) {
    //     g_print("Failed to get pipewiresrc element\n");
    //     gst_object_unref(audio_pipeline);
    //     return -1;
    // }
    // // Set the node-id property for the pipewiresrc element
    // guint node_id ; // Replace with the desired node-id
    // g_object_set(pipewiresrc, "node-id", node_id, NULL);
    // g_object_set(shader_element, "uniforms", uniforms, NULL);

    struct audio_encoder *audio_encoder = g_new0(struct audio_encoder, 1);
    audio_encoder->audio_callback = audio_ready_callback;
    audio_encoder->user_data = user_data;
    audio_encoder->audio_encoding_results = g_queue_new();
    *audio_encoder_pp = audio_encoder;

    // TODO
    gst_audio_encoder_create(audio_encoder, audio_pipeline);
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
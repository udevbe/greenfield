#include <stdio.h>
#include <glib.h>
#include <gst/gst.h>
#include <libgnomevfs/gnome-vfs.h>

static gboolean
cb_bus(GstBus *bus, GstMessage *msg, gpointer user_data)
{
    GMainLoop *loop;

    loop = user_data;
    switch (GST_MESSAGE_TYPE(msg))
    {
    case GST_MESSAGE_EOS:
        g_main_loop_quit(loop);
        g_print("End of encoding\n");
        break;
    case GST_MESSAGE_ERROR:
        break;
        g_print("err: terminating ...\n");
        g_main_loop_quit(loop);
    default:
        break;
    }

    return TRUE;
}

static void
cb_pad_added(GstElement *element, GstPad *pad, gpointer user_data)
{
    GstCaps *caps;
    GstStructure *str;
    GstPad *audiopad;
    GstElement *audiobin;

    audiobin = user_data;

    audiopad = gst_element_get_static_pad(audiobin, "sink");
    if (GST_PAD_IS_LINKED(audiopad))
    {
        g_object_unref(audiopad);
        return;
    }

    caps = gst_pad_get_caps(pad);
    str = gst_caps_get_structure(caps, 0);
    if (!g_strrstr(gst_structure_get_name(str), "audio"))
    {
        gst_caps_unref(caps);
        gst_object_unref(audiopad);
        return;
    }
    gst_caps_unref(caps);

    gst_pad_link(pad, audiopad);
    g_object_unref(audiopad);
}

int main(int argc, char *argv[])
{
    GMainLoop *loop;
    GstElement *pipeline, *audiobin;
    GstPad *audiopad;
    GstElement *source, *decoder, *convert, *encoder, *sink;
    GstElement *m4acapsfilter = NULL;
    GstBus *bus;
    const gchar *savefilename;
    gchar *savepath;
    gint format;

    if (argc != 3)
    {
        fprintf(stderr,
                "usage: %s [input] [output format 1=WAV, 2=MP3, 3=MP4]\n",
                argv[0]);
        return 1;
    }

    format = atoi(argv[2]);
    if ((format != 1) && (format != 2) && (format != 3))
    {
        fprintf(stderr,
                "usage: %s [input] [output format 1=WAV, 2=MP3, 3=MP4]\n",
                argv[0]);
        return 1;
    }

    g_thread_init(NULL);
    if (!gnome_vfs_init())
    {
        return 1;
    }
    gst_init(&argc, &argv);

    loop = g_main_loop_new(NULL, FALSE);

    pipeline = gst_pipeline_new("pipeline");
    if (!pipeline)
    {
        fprintf(stderr, "err: create pipeline failed\n");
        return 1;
    }

    bus = gst_pipeline_get_bus(GST_PIPELINE(pipeline));
    gst_bus_add_watch(bus, cb_bus, loop);
    gst_object_unref(bus);

    source = gst_element_factory_make("filesrc", NULL);
    if (!source)
    {
        fprintf(stderr, "err: create filesrc failed\n");
        return 1;
    }
    g_object_set(G_OBJECT(source), "location", argv[1], NULL);

    decoder = gst_element_factory_make("decodebin2", NULL);
    if (!decoder)
    {
        fprintf(stderr, "err: create decodebin2 failed\n");
        return 1;
    }

    convert = gst_element_factory_make("audioconvert", NULL);
    if (!convert)
    {
        fprintf(stderr, "err: create audioconvert failed\n");
        return 1;
    }

    if (format == 1)
    {
        g_print("output testWAV.wav\n");
        encoder = gst_element_factory_make("wavenc", NULL);
        if (!encoder)
        {
            fprintf(stderr, "err: create encoder waveenc failed\n");
            return 1;
        }
    }
    else if (format == 2)
    {
        g_print("output testMP3.mp3\n");
        encoder = gst_element_factory_make("twolame", NULL);
        if (!encoder)
        {
            fprintf(stderr, "err: create encoder twolame failed\n");
            return 1;
        }
        g_object_set(G_OBJECT(encoder), "bitrate", 128, NULL);
    }
    else
    {
        gint bitrate, width, depth, rate, channels;
        GstCaps *caps;
        GstStructure *gst_struct;

        g_print("output testMP4.m4a\n");
        encoder = gst_element_factory_make("nokiaaacenc", NULL);
        if (!encoder)
        {
            fprintf(stderr, "err: create encoder nokiaaacenc failed\n");
            return 1;
        }
        bitrate = 128000;
        width = 16;
        depth = 16;
        rate = 48000;
        channels = 1;

        caps = gst_caps_new_empty();
        gst_struct = gst_structure_empty_new("audio/x-raw-int");
        gst_structure_set(gst_struct, "width", G_TYPE_INT, width,
                          NULL);
        gst_structure_set(gst_struct, "depth", G_TYPE_INT, depth,
                          NULL);
        gst_structure_set(gst_struct, "rate", G_TYPE_INT, rate,
                          NULL);
        gst_structure_set(gst_struct, "channels", G_TYPE_INT, channels,
                          NULL);
        gst_caps_merge_structure(caps, gst_struct);
        m4acapsfilter = gst_element_factory_make("capsfilter", NULL);
        g_object_set(m4acapsfilter, "caps", caps, NULL);
        gst_caps_unref(caps);

        encoder = gst_element_factory_make("nokiaaacenc", NULL);
        g_object_set(G_OBJECT(encoder), "bitrate", bitrate, NULL);
    }

    sink = gst_element_factory_make("filesink", "sink");
    if (!sink)
    {
        fprintf(stderr, "err: create fileseink failed\n");
        return 1;
    }
    if (format == 1)
    {
        savefilename = "testWAV.wav";
    }
    else if (format == 2)
    {
        savefilename = "testMP3.mp3";
    }
    else
    {
        savefilename = "testM4A.m4a";
    }
    savepath = g_strconcat(g_getenv("HOME"), "/MyDocs/.sounds/",
                           savefilename, NULL);
    g_object_set(G_OBJECT(sink), "location", savepath, NULL);

    audiobin = gst_bin_new("audiobin");

    if (format == 3)
    {
        gst_bin_add(GST_BIN(audiobin), m4acapsfilter);
    }
    gst_bin_add_many(GST_BIN(audiobin), convert, encoder, sink, NULL);
    if (format == 3)
    {
        gst_element_link_many(convert, m4acapsfilter, encoder, sink, NULL);
    }
    else
    {
        gst_element_link_many(convert, encoder, sink, NULL);
    }
    audiopad = gst_element_get_static_pad(convert, "sink");
    gst_element_add_pad(audiobin, gst_ghost_pad_new("sink", audiopad));
    gst_object_unref(audiopad);
    gst_bin_add(GST_BIN(pipeline), audiobin);

    gst_bin_add_many(GST_BIN(pipeline), source, decoder, NULL);
    gst_element_link(source, decoder);
    g_signal_connect(decoder, "pad-added", G_CALLBACK(cb_pad_added),
                     audiobin);

    gst_element_set_state(pipeline, GST_STATE_PLAYING);

    g_print("Run...\n");
    g_main_loop_run(loop);

    gst_element_set_state(pipeline, GST_STATE_NULL);
    gst_object_unref(GST_OBJECT(pipeline));
    pipeline = NULL;

    return 0;
}
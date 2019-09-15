//
// Created by erik on 9/14/19.
//

#ifndef APP_ENDPOINT_ENCODING_X264GST_ENCODER_H
#define APP_ENDPOINT_ENCODING_X264GST_ENCODER_H

#include <gst/gstelement.h>
#include "encoder.h"


//`appsrc name=source caps=video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1 !
//videoscale ! capsfilter name=scale caps=video/x-raw,width=${width + (width % 2)},height=${height + (height % 2)} !
//
//tee name=t ! queue !
//glupload !
//glcolorconvert !
//glshader fragment="
//#version 120
//#ifdef GL_ES
//precision mediump float;
//#endif
//varying vec2 v_texcoord;
//uniform sampler2D tex;
//uniform float time;
//uniform float width;
//uniform float height;
//
//void main () {
//    vec4 pix = texture2D(tex, v_texcoord);
//    gl_FragColor = vec4(pix.a,pix.a,pix.a,0);
//}
//"
//vertex = "
//#version 120
//#ifdef GL_ES
//precision mediump float;
//#endif
//attribute vec4 a_position;
//attribute vec2 a_texcoord;
//varying vec2 v_texcoord;
//
//void main() {
//    gl_Position = a_position;
//    v_texcoord = a_texcoord;
//}
//" !
//glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 !
//gldownload !
//x264enc byte-stream=true qp-max=32 tune=zerolatency speed-preset=veryfast intra-refresh=0 !
//video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au,framerate=60/1 !
//appsink name=alphasink
//
//t. ! queue !
//glupload !
//glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 !
//gldownload !
//x264enc byte-stream=true qp-max=26 tune=zerolatency speed-preset=veryfast intra-refresh=0 !
//video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au,framerate=60/1 !
//appsink name=sink`

struct x264gst_alpha_encoder {
    struct encoder base_encoder;

    GstElement *appsrc;
    GstElement *videobox;
    GstElement *tee;

    struct alpha {
        GstElement *queue;
        GstElement *glupload;
        GstElement *glcolorconvert0;
        GstElement *glshader;
        GstElement *glcolorconvert1;
        GstElement *gldownload;
        GstElement *x264enc;
        GstElement *appsink;
    } alpha;

    GstElement *queue;
    GstElement *glupload;
    GstElement *glcolorconvert;
    GstElement *gldownload;
    GstElement *x264enc;
    GstElement *appsink;

    GstElement *pipeline;
};

struct x264gst_alpha_encoder*
create(void);

#endif //APP_ENDPOINT_ENCODING_X264GST_ENCODER_H

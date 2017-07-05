#!/usr/bin/env node
'use strict';

const wfs = require('./protocol/greenfield-server-protocol.js');
const WebSocket = require('ws');
const express = require('express');
const http = require("http");
const webrtc = require('wrtc');
const fs = require("fs");
const child_process = require("child_process");

const webrtcSignaling = new wfs.Global("webrtc_signaling", 1);
webrtcSignaling.bindClient = onBindClient;

function onBindClient(client, id, version) {

    const webrtcSignaling = new wfs.webrtc_signaling(client, id, version);

    webrtcSignaling.implementation.peerConnection = new webrtc.RTCPeerConnection({
        'iceServers': [
            {'urls': 'stun:stun.wtfismyip.com/'},
        ]
    });
    webrtcSignaling.implementation.client_ice_candidates = onClientIceCandidates;
    webrtcSignaling.implementation.client_sdp_offer = onClientSdpOffer;

    setupChannel(client, webrtcSignaling);
}

function onClientIceCandidates(webrtcSignaling, description) {
    const signal = JSON.parse(description);

    webrtcSignaling.implementation.peerConnection.addIceCandidate(new webrtc.RTCIceCandidate(signal.candidate)).catch((error) => {
        console.error("Error: Failure during addIceCandidate()", error);
        webrtcSignaling.client.close();
    });
}

function onClientSdpOffer(webrtcSignaling, description) {
    const signal = JSON.parse(description);

    webrtcSignaling.implementation.peerConnection.setRemoteDescription(new webrtc.RTCSessionDescription(signal.sdp)).then(() => {
        return webrtcSignaling.implementation.peerConnection.createAnswer();
    }).then((desc) => {
        return webrtcSignaling.implementation.peerConnection.setLocalDescription(desc);
    }).then(() => {
        webrtcSignaling.server_sdp_reply(JSON.stringify({"sdp": webrtcSignaling.implementation.peerConnection.localDescription}));
    }).catch((error) => {
        console.error(error);
        webrtcSignaling.client.close();
    });
}

/**
 * @param {webrtc_signaling} webrtcSignaling
 */
function setupChannel(client, webrtcSignaling) {

    webrtcSignaling.implementation.peerConnection.onicecandidate = (evt) => {
        if (evt.candidate !== null) {
            webrtcSignaling.server_ice_candidates(JSON.stringify({"candidate": evt.candidate}));
        }
    };

    webrtcSignaling.implementation.peerConnection.ondatachannel = (event) => {
        const datachannel = event.channel;

        datachannel.onopen = function (event) {
            pushFrames(client, datachannel);
        };
    };
}

class RtpFrameReader {
    constructor(rtpStream) {
        this.frameBytesRemaining = -1;
        this.rtpFrame = null;

        //in case of partial header
        this.busyReadingHeader = false;

        rtpStream.on("data", (chunk) => {
            this.parseChunk(chunk);
        });
        rtpStream.on("error", (error) => {
            console.log("Got rtp stream error: " + error);
        });
        rtpStream.resume();
    }

    parseChunk(chunk) {
        chunk.bytesRemaining = chunk.length;

        //loop until there is no more data to process
        while (chunk.bytesRemaining > 0) {

            //Check if we've only read the first byte of the header
            if (this.busyReadingHeader && chunk.bytesRemaining >= 1) {
                //we've already read the first part, so OR  the new part with what we've already got.
                this.frameBytesRemaining &= chunk.readUInt8(chunk.length - chunk.bytesRemaining);
                chunk.bytesRemaining -= 1;
                this.busyReadingHeader = false;

                //allocate new rtp buffer based on the size the header gave us.
                this.rtpFrame = Buffer.alloc(this.frameBytesRemaining);

            } else
            //We're not busy reading the header, and have not read any header at all in fact.
            if (this.frameBytesRemaining === -1) {
                //Check if we can read at least 2 bytes to make sure we can read the entire header
                if (chunk.bytesRemaining >= 2) {
                    this.frameBytesRemaining = chunk.readUInt16BE(chunk.length - chunk.bytesRemaining, true);
                    chunk.bytesRemaining -= 2;

                    //allocate new rtp buffer based on the size the header gave us.
                    this.rtpFrame = Buffer.alloc(this.frameBytesRemaining);
                } else if (chunk.bytesRemaining >= 1) {
                    //we can only read the header partially
                    this.busyReadingHeader = true;
                    this.frameBytesRemaining = chunk.readUInt8(0);
                    chunk.bytesRemaining -= 1;
                    this.frameBytesRemaining = this.frameBytesRemaining << 8;
                }
            }

            if (chunk.bytesRemaining > 0 && !this.busyReadingHeader && this.frameBytesRemaining !== -1) {
                //read the rest of the rtp frame

                //copy as much data as possible from the chunk into the rtp frame.
                const maxBytesToCopy = chunk.bytesRemaining >= this.frameBytesRemaining ? this.frameBytesRemaining : chunk.bytesRemaining;
                const bytesCopied = chunk.copy(this.rtpFrame, this.rtpFrame.length - this.frameBytesRemaining, chunk.length - chunk.bytesRemaining, (chunk.length - chunk.bytesRemaining) + maxBytesToCopy);//target, target start, source start, source end
                this.frameBytesRemaining -= bytesCopied;
                chunk.bytesRemaining -= bytesCopied;
            }

            if (this.frameBytesRemaining === 0) {
                if (this.rtpFrame.length !== 0) {
                    const rtpVersion = (this.rtpFrame.readUInt8(0) >>> 6);
                    if (rtpVersion !== 2) {
                        console.warn("Malformed rtp packet. Expected version 2, got: " + rtpVersion)
                    }
                    this.onRtpFrame(this.rtpFrame);
                }
                this.frameBytesRemaining = -1;
            }
        }
    }

    onRtpFrame(rtpFrame) {
    }
}

function pushFrames(client, dataChannel) {
    //crate named pipe and get fd to it:
    const fifoPath = "/tmp/tmp.fifo";

    fs.unlink(fifoPath, (error) => {
        child_process.execSync("mkfifo " + fifoPath);

        const rtpStreamProcess = child_process.spawn("gst-launch-1.0",
            ["videotestsrc", "pattern=0", "is-live=true", "do-timestamp=true", "!",
                "clockoverlay", "!",
                "videorate", "!", "video/x-raw,framerate=60/1", "!",
                "videoconvert", "!", "video/x-raw,format=I420,width=1920,height=1080", "!",
                "vaapih264enc", "keyframe-period=60", "rate-control=vbr", "bitrate=20000", "!",
                //"x264enc", "key-int-max=1", "pass=pass1", "aud=false", "b-adapt=false", "bframes=0", "tune=zerolatency", "sliced-threads=false", "speed-preset=veryfast", "qp-max=30", "qp-min=20", "ip-factor=2", "intra-refresh=true", "!",
                "video/x-h264,profile=constrained-baseline,framerate=60/1", "!",
                "rtph264pay", "config-interval=-1", "mtu=5000", "!",
                "rtpstreampay", "!",
                "filesink", "location=" + fifoPath, "append=true", "buffer-mode=unbuffered", "sync=false"]);

        rtpStreamProcess.on("exit", (exit) => {
            console.log("gst-launch exited: " + exit);
        });

        const fd = fs.openSync(fifoPath, "r");

        const rtpStream = fs.createReadStream(null, {
            fd: fd
        });

        const rtpFrameReader = new RtpFrameReader(rtpStream).onRtpFrame = (rtpFrame) => {
            if (dataChannel.readyState === "open") {
                dataChannel.send(rtpFrame);
            }
        };

        fs.unlinkSync(fifoPath);

        client.onclose = (event) => {
            rtpStreamProcess.kill(0);
            rtpStream.destroy();
        };
    });
}

//Create westfield server. Required to expose global singleton protocol objects to clients.
const wfsServer = new wfs.Server();

//Register the global so clients can find it when they connect.
wfsServer.registry.register(webrtcSignaling);

//setup connection logic (http+websocket)
const app = express();
app.use(express.static('client/public'));

const server = http.createServer();
server.on('request', app);
const wss = new WebSocket.Server({
    server: server,
    path: "/westfield"
});

//listen for new websocket connections.
wss.on('connection', function connection(ws) {

    //Make sure we detected disconnects asap.
    ws._socket.setKeepAlive(true);

    //A new connection was established. Create a new westfield client object to represent this connection.
    const client = wfsServer.createClient();

    //Wire the send callback of this client object to our websocket.
    client.onSend = function (wireMsg) {
        if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
            //Fail silently as we will soon receive the close event which will trigger the cleanup.
            return;
        }

        try {
            ws.send(wireMsg, function (error) {
                if (error !== undefined) {
                    console.error(error);
                    ws.close();
                }
            });
        } catch (error) {
            console.error(error);
            ws.close();
        }
    };

    //Wire data receiving from the websocket to the client object.
    ws.onmessage = function incoming(message) {
        try {
            //The client object expects an ArrayBuffer as it's argument.
            //Slice and get the ArrayBuffer of the Node Buffer with the provided offset, else we take too much data into account.
            client.message(message.data.buffer.slice(message.data.offset, message.data.length + message.data.offset));
        } catch (error) {
            console.error(error);
            ws.close();
        }
    };

    //Wire closing of the websocket to our client object.
    ws.onclose = function () {
        client.close();
        if(typeof client.onclose === "function"){
            client.onclose();
        }
    };

    //Tell the client object we ready to handle protocol communication.
    client.open();
});

//Listen for incoming http requests on port 8080.
server.listen(8080);

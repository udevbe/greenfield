"use strict";
const wfc = require("./protocol/greenfield-client-protocol.js");
import RTPFactory from './lib/rtp/factory.js';
import {SDPParser} from  "./lib/parsers/sdp.js";
import {RTPPayloadParser} from "./lib/rtp/payload/parser.js";
import {Remuxer} from "./lib/remuxer/newremuxer.js";


const connection = new wfc.Connection("ws://" + location.host + "/westfield");

connection.registry.listener.global = (name, interface_, version) => {
    if (interface_ === "webrtc_signaling") {
        const webrtcSignaling = connection.registry.bind(name, interface_, version);
        setupDataChannels(webrtcSignaling);
    }
};

function setupPeerConnection(webrtcSignaling) {
    const peerConnection = new RTCPeerConnection({
        'iceServers': [
            {'urls': 'stun:stun.wtfismyip.com/'},
        ]
    });

    peerConnection.onicecandidate = (evt) => {
        if (evt.candidate !== null) {
            webrtcSignaling.client_ice_candidates(JSON.stringify({"candidate": evt.candidate}));
        }
    };

    webrtcSignaling.listener.server_ice_candidates = (description) => {
        const signal = JSON.parse(description);
        peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate)).catch(error => {
            console.log("Error: Failure during addIceCandidate()", error);
            connection.close();
        });
    };

    webrtcSignaling.listener.server_sdp_reply = (description) => {
        const signal = JSON.parse(description);
        peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).catch((error) => {
            console.log("Error: Failure during setRemoteDescription()", error);
            connection.close();
        });
    };

    return peerConnection;
}

function setupDataChannels(webrtcSignaling) {

    const peerConnection = setupPeerConnection(webrtcSignaling);

    const sdpParser = new SDPParser();
    sdpParser.parse(
        "v=0\n" +
        "m=video 5004 RTP/AVP 96\n" +
        "a=rtpmap:96 H264/90000\n").then(() => {

        const rtpFactory = new RTPFactory(sdpParser);
        const track = sdpParser.getMediaBlock("video");
        const video = document.getElementById("surface.123");
        const remuxer = new Remuxer(track);
        return remuxer.addVideo(video).then((mse) => {
            const channel = peerConnection.createDataChannel(webrtcSignaling.id, {ordered: false, maxRetransmits: 0});
            setupStreamChannel(channel, rtpFactory, sdpParser, remuxer, mse);
        });
    }).then(() => {
        return peerConnection.createOffer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false,
            voiceActivityDetection: false,
            iceRestart: false
        })
    }).then((desc) => {
        return peerConnection.setLocalDescription(desc);
    }).then(() => {
        webrtcSignaling.client_sdp_offer(JSON.stringify({"sdp": peerConnection.localDescription}));
    }).catch((error) => {
        console.error(error);
        webrtcSignaling.client.close();
    });
}

function setupStreamChannel(receiveChannel,
                            rtpFactory,
                            sdpParser,
                            remuxer,
                            mse) {
    const nalQueue = [];

    const rtpPayloadParser = new RTPPayloadParser();

    receiveChannel.binaryType = "arraybuffer";
    receiveChannel.onmessage = function (event) {
        const rtpPacket = rtpFactory.build(new Uint8Array(event.data), sdpParser);

        // //TODO jitter buffer?

        const nal = rtpPayloadParser.parse(rtpPacket);
        if (nal) {
            nalQueue.push(nal);
        }

        if (mse.buffer === null || (mse.buffer.queue.length === 0)) {
            remuxer.flush(nalQueue);
        }
    };

    mse.onBuffer().then((buffer) => {
        remuxer.flush(nalQueue);
        buffer.flush = () => {
            remuxer.flush(nalQueue);
        };
    });
}





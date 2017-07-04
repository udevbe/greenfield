import {MSE} from "../presentation/newmse.js";
import {H264Remuxer} from "./h264.js";
import {MP4} from '../iso-bmff/mp4-generator.js';

export class Remuxer {

    constructor() {
        this.trackConverter = new H264Remuxer(90000);
        this.initialized = false;
        this.trackConverter.duration = 1;
    }

    _init() {
        let initPts = Infinity;
        let initDts = Infinity;

        if (!MSE.isSupported([this.trackConverter.mp4track.codec])) {
            throw new Error(`${this.trackConverter.mp4track.type} codec ${track.mp4track.codec} is not supported`);
        }
        this.trackConverter.init(initPts, initDts);
        this.initialized = true;
    }

    _initMSE() {
        this.mse.setCodec(`video/mp4; codecs="${this.trackConverter.mp4track.codec}"`);
        this.mse.feed(MP4.initSegment([this.trackConverter.mp4track], 0, this.trackConverter.timescale));
        this.mse.play();
    }

    addVideo(video) {

        const mediaSource = new MediaSource();

        let onSourceOpen;
        const muxer = this;
        const mediaReady = new Promise((resolve, reject) => {
            onSourceOpen = () => {
                muxer.mse = new MSE(video, mediaSource);
                resolve(muxer.mse);
            }
        });
        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', onSourceOpen);

        return mediaReady;
    }

    flush(nalQueue) {
        this._onSamples(nalQueue);
        if (!this.initialized) {
            if (!this.trackConverter.readyToDecode || !this.trackConverter.samples.length) return;
            this._init();
        }

        if (this.initialized) {
            if (!this.mse.initialized) {
                this._initMSE();
                this.mse.initialized = true;
            } else {
                let pay = this.trackConverter.getPayload();
                if (pay && pay.byteLength) {
                    this.mse.feed([MP4.moof(this.trackConverter.seq, this.trackConverter.firstDTS, this.trackConverter.mp4track), MP4.mdat(pay)]);
                    this.trackConverter.flush();
                }
            }
        }
    }

    _onSamples(queue) {
        while (queue.length) {
            let units = queue.shift();
            for (let chunk of units) {
                this.trackConverter.remux(chunk);
            }
        }
    }
}

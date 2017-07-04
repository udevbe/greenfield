import {H264Parser} from '../parsers/h264.js';
import {BaseRemuxer} from './base.js';

// TODO: asm.js
export class H264Remuxer extends BaseRemuxer {

    constructor(timescale, scaleFactor = 1, params = {}) {
        super(timescale, scaleFactor);

        this.readyToDecode = false;
        this.initialized = false;

        this.lastDTS = 0;
        this.firstDTS = null;
        this.baseMediaDecodeTime = 0;

        this.mp4track = {
            id: BaseRemuxer.getTrackID(),
            type: 'video',
            len: 0,
            fragmented: true,
            sps: '',
            pps: '',
            width: 0,
            height: 0,
            timescale: timescale,
            duration: timescale,
            samples: []
        };
        this.samples = [];
        this.lastGopDTS = 0;
        this.gop = [];
        this.firstUnit = true;

        this.h264 = new H264Parser(this);

        if (params.sps) {
            this.setSPS(new Uint8Array(params.sps));
        }
        if (params.pps) {
            this.setPPS(new Uint8Array(params.pps));
        }

        if (this.mp4track.pps && this.mp4track.sps) {
            this.readyToDecode = true;
        }
    }

    setSPS(sps) {
        this.h264.parseSPS(sps);
    }

    setPPS(pps) {
        this.h264.parsePPS(pps);
    }

    remux(nalu) {
        // console.log(nalu.toString());
        if (this.lastGopDTS < nalu.dts) {
            this.gop.sort(BaseRemuxer.dtsSortFunc);
            for (let unit of this.gop) {
                if (this.h264.parseNAL(unit)) {
                    if (this.firstUnit) {
                        unit.ntype = 5;//NALU.IDR;
                        this.firstUnit = false;
                    }
                    if (super.remux.call(this, unit)) {
                        this.mp4track.len += unit.getSize();
                    }
                }
            }
            this.gop = [];
            this.lastGopDTS = nalu.dts
        }
        this.gop.push(nalu);
    }

    getPayload() {
        if (!this.getPayloadBase()) {
            return null;
        }

        let payload = new Uint8Array(this.mp4track.len);
        let offset = 0;
        let mp4Sample;

        this.firstDTS = null;
        while (this.samples.length) {
            const sample = this.samples.shift();
            if (sample === null) {
                // discontinuity
                continue ;
            }

            let unit = sample.unit;
            if(!this.firstDTS){
                this.firstDTS = sample.dts;
            }

            mp4Sample = {
                size: unit.getSize(),
                duration: ///this.lastDTS ? sample.dts - this.lastDTS :
                    1500,
                duration: //this.lastDTS ? sample.dts - this.lastDTS :
                    1500,
                cts: 0,
                flags: {
                    isLeading: 0,
                    isDependedOn: 0,
                    hasRedundancy: 0,
                    degradPrio: 0
                }
            };
            let flags = mp4Sample.flags;
            if (sample.unit.isKeyframe() === true) {
                // the current sample is a key frame
                flags.dependsOn = 2;
                flags.isNonSync = 0;
            } else {
                flags.dependsOn = 1;
                flags.isNonSync = 1;
            }

            payload.set(unit.getData(), offset);
            offset += unit.getSize();

            this.mp4track.samples.push(mp4Sample);
            this.lastDTS = sample.dts;
        }

        if (!this.mp4track.samples.length) return null;

        return new Uint8Array(payload.buffer, 0, this.mp4track.len);
    }
}
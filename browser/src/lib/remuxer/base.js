let track_id = 1;
export class BaseRemuxer {

    static get MP4_TIMESCALE() { return 90000;}

    // TODO: move to ts parser
    // static PTSNormalize(value, reference) {
    //
    //     let offset;
    //     if (reference === undefined) {
    //         return value;
    //     }
    //     if (reference < value) {
    //         // - 2^33
    //         offset = -8589934592;
    //     } else {
    //         // + 2^33
    //         offset = 8589934592;
    //     }
    //     /* PTS is 33bit (from 0 to 2^33 -1)
    //      if diff between value and reference is bigger than half of the amplitude (2^32) then it means that
    //      PTS looping occured. fill the gap */
    //     while (Math.abs(value - reference) > 4294967296) {
    //         value += offset;
    //     }
    //     return value;
    // }

    static getTrackID() {
        return track_id++;
    }

    constructor(timescale, scaleFactor, params) {
        this.timeOffset = 0;
        this.timescale = timescale;
        this.scaleFactor = scaleFactor;
        this.readyToDecode = false;
        this.samples = [];
        this.seq = 1;
        this.tsAlign = 1;
    }

    shifted(timestamp) {
        return timestamp - this.timeOffset;
    }

    scaled(timestamp) {
        return timestamp / this.scaleFactor;
    }

    unscaled(timestamp) {
        return timestamp * this.scaleFactor;
    }

    remux(unit) {
        if (unit && this.timeOffset >= 0) {
            this.samples.push({
                unit: unit,
                pts: this.shifted(unit.pts),
                dts: this.shifted(unit.dts)
            });
            return true;
        }
        return false;
    }

    static toMS(timestamp) {
        return timestamp/90;
    }
    
    setConfig(config) {
        
    }

    insertDscontinuity() {
        this.samples.push(null);
    }

    init(initPTS, initDTS, shouldInitialize=true) {
        this.initPTS = Math.min(initPTS, this.samples[0].dts - this.unscaled(this.timeOffset));
        this.initDTS = Math.min(initDTS, this.samples[0].dts - this.unscaled(this.timeOffset));
        console.debug(`Initial pts=${this.initPTS} dts=${this.initDTS} offset=${this.unscaled(this.timeOffset)}`);
        this.initialized = shouldInitialize;
    }

    flush() {
        this.seq++;
        this.mp4track.len = 0;
        this.mp4track.samples = [];
    }

    static dtsSortFunc(a,b) {
        return (a.dts-b.dts);
    }

    getPayloadBase(sampleFunction, setupSample) {
        if (!this.readyToDecode || !this.initialized || !this.samples.length) return null;
        this.samples.sort(BaseRemuxer.dtsSortFunc);
        return true;
        //
        // let payload = new Uint8Array(this.mp4track.len);
        // let offset = 0;
        // let samples=this.mp4track.samples;
        // let mp4Sample, lastDTS, pts, dts;
        //
        // while (this.samples.length) {
        //     let sample = this.samples.shift();
        //     if (sample === null) {
        //         // discontinuity
        //         this.nextDts = undefined;
        //         break;
        //     }
        //
        //     let unit = sample.unit;
        //
        //     pts = Math.round((sample.pts - this.initDTS)/this.tsAlign)*this.tsAlign;
        //     dts = Math.round((sample.dts - this.initDTS)/this.tsAlign)*this.tsAlign;
        //     // ensure DTS is not bigger than PTS
        //     dts = Math.min(pts, dts);
        //
        //     // sampleFunction(pts, dts);   // TODO:
        //
        //     // mp4Sample = setupSample(unit, pts, dts);    // TODO:
        //
        //     payload.set(unit.getData(), offset);
        //     offset += unit.getSize();
        //
        //     samples.push(mp4Sample);
        //     lastDTS = dts;
        // }
        // if (!samples.length) return null;
        //
        // // samplesPostFunction(samples); // TODO:
        //
        // return new Uint8Array(payload.buffer, 0, this.mp4track.len);
    }
}
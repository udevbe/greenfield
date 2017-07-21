import {NALU} from './NALU.js';

// TODO: asm.js
export class NALUAsm {

    constructor() {
        this.nalu_l = null;
        this.nalu_t = null;
        this.dts_l = 0;
    }

    shiftTemp(val) {
        let ret;
        if (this.nalu_t !== null) {
            ret = this.nalu_t;
            this.nalu_t = val;
        } else {
            ret = val;
        }
        return ret ? [ret] : null;
    }

    onNALUFragment(rawData, dts, pts) {

        let data = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);

        let nalhdr = data.getUint8(0);

        let nri = nalhdr & 0x60;
        let naltype = nalhdr & 0x1F;

        let nal_start_idx = 1;
        let ret = null;

        if ((7 > naltype && 0 < naltype) || (28 > naltype && 8 < naltype)) {
            if (this.dts_l !== dts) {
                this.dts_l = dts;
                ret = this.shiftTemp(this.nalu_l);
                this.nalu_l = new NALU(naltype, nri, rawData.subarray(nal_start_idx), dts, pts);
            } else {
                ret = this.shiftTemp(null);
                if (this.nalu_l !== null) {
                    this.nalu_l.appendData(new Uint8Array([0, 0, 1]));
                    this.nalu_l.appendData(rawData.subarray(0));
                }
            }
            return ret;
        } else if (naltype === NALU.SPS || naltype === NALU.PPS) {
            return [new NALU(naltype, nri, rawData.subarray(nal_start_idx), dts, pts)];
        } else if (NALU.FU_A === naltype || NALU.FU_B === naltype) {
            let nalfrag = data.getUint8(1);
            let nfstart = (nalfrag & 0x80) >>> 7;
            let nfend = (nalfrag & 0x40) >>> 6;
            let nftype = nalfrag & 0x1F;

            nal_start_idx++;
            let nfdon = 0;
            if (NALU.FU_B === naltype) {
                nfdon = data.getUint16(2);
                nal_start_idx += 2;
            }
            if (this.dts_l !== dts) {
                if (nfstart) {
                    ret = this.shiftTemp(this.nalu_l);
                    this.nalu_l = new NALU(nftype, nri + nftype, rawData.subarray(nal_start_idx), dts, pts);
                    this.dts_l = dts;
                } else {
                    ret = this.shiftTemp(null);
                    console.log("fu packet error");
                }
            } else {
                if (this.nalu_l !== null) {
                    if (this.nalu_l.ntype === nftype) {
                        ret = this.shiftTemp(null);
                        if (nfstart) {
                            this.nalu_l.appendData(new Uint8Array([0, 0, 1, nri + nftype]));
                            this.nalu_l.appendData(rawData.subarray(nal_start_idx));
                        } else {
                            this.nalu_l.appendData(rawData.subarray(nal_start_idx));
                        }
                    } else {
                        if (nfstart) {
                            ret = this.shiftTemp(this.nalu_l);
                            this.nalu_l = new NALU(nftype, nri + nftype, rawData.subarray(nal_start_idx), dts, pts);
                            this.dts_l = dts;
                        } else {
                            ret = this.shiftTemp(null);
                            console.log("fu packet error");
                        }
                    }
                } else {
                    ret = this.shiftTemp(null);
                    console.log("fu packet start without head");
                }
            }
            return ret;
        } else {
            /* 30 - 31 is undefined, ignore those (RFC3984). */
            console.log('Undefined NAL unit, type: ' + naltype);
            ret = this.shiftTemp(null);
            return ret;
        }
    }
}

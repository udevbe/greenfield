import {appendByteArray} from './binary.js';

export class NALU {

    static get NDR() {return 1;}
    static get IDR() {return 5;}
    static get SEI() {return 6;}
    static get SPS() {return 7;}
    static get PPS() {return 8;}
    static get FU_A() {return 28;}
    static get FU_B() {return 29;}

    static get TYPES() {return {
        [NALU.IDR]: 'IDR',
        [NALU.SEI]: 'SEI',
        [NALU.SPS]: 'SPS',
        [NALU.PPS]: 'PPS',
        [NALU.NDR]: 'NDR'
    }};

    static type(nalu) {
        if (nalu.ntype in NALU.TYPES) {
            return NALU.TYPES[nalu.ntype];
        } else {
            return 'UNKNOWN';
        }
    }

    constructor(ntype, nri, data, dts, pts) {

        this.data = data;
        this.ntype = ntype;
        this.nri = nri;
        this.dts = dts;
        this.pts = pts ? pts : this.dts;

    }

    appendData(idata) {
        this.data = appendByteArray(this.data, idata);
    }

    toString() {
        return `${NALU.type(this)}: NRI: ${this.getNri()}, PTS: ${this.pts}, DTS: ${this.dts}`;
    }

    getNri() {
        return this.nri >> 6;
    }

    type() {
        return this.ntype;
    }

    isKeyframe() {
        return this.ntype == NALU.IDR;
    }

    getSize() {
        return 4 + 1 + this.data.byteLength;
    }

    getData() {
        let header = new Uint8Array(5 + this.data.byteLength);
        let view = new DataView(header.buffer);
        view.setUint32(0, this.data.byteLength + 1);
        view.setUint8(4, (0x0 & 0x80) | (this.nri & 0x60) | (this.ntype & 0x1F));
        header.set(this.data, 5);
        return header;
    }
}

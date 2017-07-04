export default class RTP {
    constructor(pkt/*uint8array*/, sdp) {
        let bytes = new DataView(pkt.buffer, pkt.byteOffset, pkt.byteLength);

        this.version   = bytes.getUint8(0) >>> 6;
        this.padding   = bytes.getUint8(0) & 0x20 >>> 5;
        this.has_extension = bytes.getUint8(0) & 0x10 >>> 4;
        this.csrc      = bytes.getUint8(0) & 0x0F;
        this.marker    = bytes.getUint8(1) >>> 7;
        this.pt        = bytes.getUint8(1) & 0x7F;
        this.sequence  = bytes.getUint16(2) ;
        this.timestamp = bytes.getUint32(4);
        this.ssrc      = bytes.getUint32(8);
        this.csrcs     = [];

        let pktIndex=12;
        if (this.csrc>0) {
            this.csrcs.push(bytes.getUint32(pktIndex));
            pktIndex+=4;
        }
        if (this.has_extension===1) {
            this.extension = bytes.getUint16(pktIndex);
            this.ehl = bytes.getUint16(pktIndex+2);
            pktIndex+=4;
            this.header_data = pkt.slice(pktIndex, this.ehl);
            pktIndex += this.ehl;
        }

        this.headerLength = pktIndex;
        let padLength = 0;
        if (this.padding) {
            padLength = bytes.getUint8(pkt.byteLength-1);
        }

        // this.bodyLength   = pkt.byteLength-this.headerLength-padLength;

        this.media = sdp.getMediaBlockByPayloadType(this.pt);
        if (null === this.media) {
            console.log(`Media description for payload type: ${this.pt} not provided.`);
        }
        this.type = this.media.ptype;//PayloadType.string_map[this.media.rtpmap[this.media.fmt[0]].name];

        this.data = pkt.subarray(pktIndex);
        // this.timestamp = 1000 * (this.timestamp / this.media.rtpmap[this.pt].clock);
        // console.log(this);
    }
    getPayload() {
        return this.data;
    }

    getTimestampMS() {
        return this.timestamp; //1000 * (this.timestamp / this.media.rtpmap[this.pt].clock);
    }

    toString() {
        return "RTP(" +
            "version:"   + this.version   + ", " +
            "padding:"   + this.padding   + ", " +
            "has_extension:" + this.has_extension + ", " +
            "csrc:"      + this.csrc      + ", " +
            "marker:"    + this.marker    + ", " +
            "pt:"        + this.pt        + ", " +
            "sequence:"  + this.sequence  + ", " +
            "timestamp:" + this.timestamp + ", " +
            "ssrc:"      + this.ssrc      + ")";
    }

    isVideo(){return this.media.type === 'video';}
}
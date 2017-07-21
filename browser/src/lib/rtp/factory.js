import RTP from './rtp.js';

export default class RTPFactory {
    constructor(sdp) {
        this.tsOffsets={};
        for (let pay in sdp.media) {
            for (let pt of sdp.media[pay].fmt) {
                this.tsOffsets[pt] = {last: 0, overflow: 0};
            }
        }
    }

    build(pkt/*uint8array*/, sdp) {
        let rtp = new RTP(pkt, sdp);

        let tsOffset = this.tsOffsets[rtp.pt];
        if (tsOffset) {
            rtp.timestamp += tsOffset.overflow;
            if (tsOffset.last && Math.abs(rtp.timestamp - tsOffset.last) > 0x7fffffff) {
                console.log(`\nlast ts: ${tsOffset.last}\n
                            new ts: ${rtp.timestamp}\n
                            new ts adjusted: ${rtp.timestamp+0xffffffff}\n
                            last overflow: ${tsOffset.overflow}\n
                            new overflow: ${tsOffset.overflow+0xffffffff}\n
                            `);
                tsOffset.overflow += 0xffffffff;
                rtp.timestamp += 0xffffffff;
            }
            /*if (rtp.timestamp>0xffffffff) {
                console.log(`ts: ${rtp.timestamp}, seq: ${rtp.sequence}`);
            }*/
            tsOffset.last = rtp.timestamp;
        }

        return rtp;
    }
}
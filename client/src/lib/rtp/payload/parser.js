import {NALUAsm} from "../../parsers/NALUAsm.js";

export class RTPPayloadParser {

    constructor() {
        this.h264parser = new RTPH264Parser();
    }

    parse(rtp) {
        if (rtp.media.type === 'video') {
            return this.h264parser.parse(rtp);
        } else {
            console.error("Can not parse rtp packet with media type: " + rtp.media.type);
        }
        return null;
    }
}

class RTPH264Parser {
    constructor() {
        this.naluasm = new NALUAsm();
    }

    parse(rtp) {
        return this.naluasm.onNALUFragment(rtp.getPayload(), rtp.getTimestampMS());
    }
}
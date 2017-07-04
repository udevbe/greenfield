import {ExpGolomb} from './exp-golomb.js';
import {NALU} from './NALU.js';

export class H264Parser {

    constructor(remuxer) {
        this.remuxer = remuxer;
        this.track = remuxer.mp4track;
    }

    msToScaled(timestamp) {
        return (timestamp - this.remuxer.timeOffset) * this.remuxer.scaleFactor;
    }

    parseSPS(sps) {
        var config = H264Parser.readSPS(new Uint8Array(sps));

        this.track.width = config.width;
        this.track.height = config.height;
        this.track.sps = [new Uint8Array(sps)];
        // this.track.timescale = this.remuxer.timescale;
        // this.track.duration = this.remuxer.timescale; // TODO: extract duration for non-live client
        this.track.codec = 'avc1.';

        let codecarray = new DataView(sps.buffer, sps.byteOffset+1, 4);
        for (let i = 0; i < 3; ++i) {
            var h = codecarray.getUint8(i).toString(16);
            if (h.length < 2) {
                h = '0' + h;
            }
            this.track.codec  += h;
        }
    }

    parsePPS(pps) {
        this.track.pps = [new Uint8Array(pps)];
    }

    parseNAL(unit) {
        if (!unit) return false;
        
        let push = false;
        switch (unit.type()) {
            case NALU.NDR:
                push = true;
                break;
            case NALU.IDR:
                push = true;
                break;
            case NALU.PPS:
                if (!this.track.pps) {
                    this.parsePPS(unit.getData().subarray(4));
                    if (!this.remuxer.readyToDecode && this.track.pps && this.track.sps) {
                        this.remuxer.readyToDecode = true;
                    }
                }
                break;
            case NALU.SPS:
                if(!this.track.sps) {
                    this.parseSPS(unit.getData().subarray(4));
                    if (!this.remuxer.readyToDecode && this.track.pps && this.track.sps) {
                        this.remuxer.readyToDecode = true;
                    }
                }
                break;
            case NALU.SEI:
                // console.log('SEI');
                break;
            default:
        }
        return push;
    }

    /**
     * Advance the ExpGolomb decoder past a scaling list. The scaling
     * list is optionally transmitted as part of a sequence parameter
     * set and is not relevant to transmuxing.
     * @param decoder {ExpGolomb} exp golomb decoder
     * @param count {number} the number of entries in this scaling list
     * @see Recommendation ITU-T H.264, Section 7.3.2.1.1.1
     */
    static skipScalingList(decoder, count) {
        let lastScale = 8,
            nextScale = 8,
            deltaScale;
        for (let j = 0; j < count; j++) {
            if (nextScale !== 0) {
                deltaScale = decoder.readEG();
                nextScale = (lastScale + deltaScale + 256) % 256;
            }
            lastScale = (nextScale === 0) ? lastScale : nextScale;
        }
    }

    /**
     * Read a sequence parameter set and return some interesting video
     * properties. A sequence parameter set is the H264 metadata that
     * describes the properties of upcoming video frames.
     * @param data {Uint8Array} the bytes of a sequence parameter set
     * @return {object} an object with configuration parsed from the
     * sequence parameter set, including the dimensions of the
     * associated video frames.
     */
    static readSPS(data) {
        let decoder = new ExpGolomb(data);
        let frameCropLeftOffset = 0,
            frameCropRightOffset = 0,
            frameCropTopOffset = 0,
            frameCropBottomOffset = 0,
            sarScale = 1,
            profileIdc,profileCompat,levelIdc,
            numRefFramesInPicOrderCntCycle, picWidthInMbsMinus1,
            picHeightInMapUnitsMinus1,
            frameMbsOnlyFlag,
            scalingListCount;
        decoder.readUByte();
        profileIdc = decoder.readUByte(); // profile_idc
        profileCompat = decoder.readBits(5); // constraint_set[0-4]_flag, u(5)
        decoder.skipBits(3); // reserved_zero_3bits u(3),
        levelIdc = decoder.readUByte(); //level_idc u(8)
        decoder.skipUEG(); // seq_parameter_set_id
        // some profiles have more optional data we don't need
        if (profileIdc === 100 ||
            profileIdc === 110 ||
            profileIdc === 122 ||
            profileIdc === 244 ||
            profileIdc === 44  ||
            profileIdc === 83  ||
            profileIdc === 86  ||
            profileIdc === 118 ||
            profileIdc === 128) {
            var chromaFormatIdc = decoder.readUEG();
            if (chromaFormatIdc === 3) {
                decoder.skipBits(1); // separate_colour_plane_flag
            }
            decoder.skipUEG(); // bit_depth_luma_minus8
            decoder.skipUEG(); // bit_depth_chroma_minus8
            decoder.skipBits(1); // qpprime_y_zero_transform_bypass_flag
            if (decoder.readBoolean()) { // seq_scaling_matrix_present_flag
                scalingListCount = (chromaFormatIdc !== 3) ? 8 : 12;
                for (let i = 0; i < scalingListCount; ++i) {
                    if (decoder.readBoolean()) { // seq_scaling_list_present_flag[ i ]
                        if (i < 6) {
                            H264Parser.skipScalingList(decoder, 16);
                        } else {
                            H264Parser.skipScalingList(decoder, 64);
                        }
                    }
                }
            }
        }
        decoder.skipUEG(); // log2_max_frame_num_minus4
        var picOrderCntType = decoder.readUEG();
        if (picOrderCntType === 0) {
            decoder.readUEG(); //log2_max_pic_order_cnt_lsb_minus4
        } else if (picOrderCntType === 1) {
            decoder.skipBits(1); // delta_pic_order_always_zero_flag
            decoder.skipEG(); // offset_for_non_ref_pic
            decoder.skipEG(); // offset_for_top_to_bottom_field
            numRefFramesInPicOrderCntCycle = decoder.readUEG();
            for(let i = 0; i < numRefFramesInPicOrderCntCycle; ++i) {
                decoder.skipEG(); // offset_for_ref_frame[ i ]
            }
        }
        decoder.skipUEG(); // max_num_ref_frames
        decoder.skipBits(1); // gaps_in_frame_num_value_allowed_flag
        picWidthInMbsMinus1 = decoder.readUEG();
        picHeightInMapUnitsMinus1 = decoder.readUEG();
        frameMbsOnlyFlag = decoder.readBits(1);
        if (frameMbsOnlyFlag === 0) {
            decoder.skipBits(1); // mb_adaptive_frame_field_flag
        }
        decoder.skipBits(1); // direct_8x8_inference_flag
        if (decoder.readBoolean()) { // frame_cropping_flag
            frameCropLeftOffset = decoder.readUEG();
            frameCropRightOffset = decoder.readUEG();
            frameCropTopOffset = decoder.readUEG();
            frameCropBottomOffset = decoder.readUEG();
        }
        if (decoder.readBoolean()) {
            // vui_parameters_present_flag
            if (decoder.readBoolean()) {
                // aspect_ratio_info_present_flag
                let sarRatio;
                const aspectRatioIdc = decoder.readUByte();
                switch (aspectRatioIdc) {
                    case 1: sarRatio = [1,1]; break;
                    case 2: sarRatio = [12,11]; break;
                    case 3: sarRatio = [10,11]; break;
                    case 4: sarRatio = [16,11]; break;
                    case 5: sarRatio = [40,33]; break;
                    case 6: sarRatio = [24,11]; break;
                    case 7: sarRatio = [20,11]; break;
                    case 8: sarRatio = [32,11]; break;
                    case 9: sarRatio = [80,33]; break;
                    case 10: sarRatio = [18,11]; break;
                    case 11: sarRatio = [15,11]; break;
                    case 12: sarRatio = [64,33]; break;
                    case 13: sarRatio = [160,99]; break;
                    case 14: sarRatio = [4,3]; break;
                    case 15: sarRatio = [3,2]; break;
                    case 16: sarRatio = [2,1]; break;
                    case 255: {
                        sarRatio = [decoder.readUByte() << 8 | decoder.readUByte(), decoder.readUByte() << 8 | decoder.readUByte()];
                        break;
                    }
                }
                if (sarRatio) {
                    sarScale = sarRatio[0] / sarRatio[1];
                }
            }
            if (decoder.readBoolean()) {decoder.skipBits(1);}

            if (decoder.readBoolean()) {
                decoder.skipBits(4);
                if (decoder.readBoolean()) {
                    decoder.skipBits(24);
                }
            }
            if (decoder.readBoolean()) {
                decoder.skipUEG();
                decoder.skipUEG();
            }
            if (decoder.readBoolean()) {
                let unitsInTick = decoder.readUInt();
                let timeScale = decoder.readUInt();
                let fixedFrameRate = decoder.readBoolean();
                let frameDuration = timeScale/(2*unitsInTick);
                console.log(`timescale: ${timeScale}; unitsInTick: ${unitsInTick}; fixedFramerate: ${fixedFrameRate}; avgFrameDuration: ${frameDuration}`);
            }
        }
        return {
            width: Math.ceil((((picWidthInMbsMinus1 + 1) * 16) - frameCropLeftOffset * 2 - frameCropRightOffset * 2) * sarScale),
            height: ((2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16) - ((frameMbsOnlyFlag? 2 : 4) * (frameCropTopOffset + frameCropBottomOffset))
        };
    }

    static readSliceType(decoder) {
        // skip NALu type
        decoder.readUByte();
        // discard first_mb_in_slice
        decoder.readUEG();
        // return slice_type
        return decoder.readUEG();
    }
}
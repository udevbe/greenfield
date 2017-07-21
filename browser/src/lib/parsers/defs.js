export class PayloadType {
    static get H264() {return 1;}

    static get map() {return {
        [PayloadType.H264]: 'video',
    }};

    static get string_map() {return  {
        H264: PayloadType.H264,
    }}
}
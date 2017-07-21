// TODO: asm.js

export function appendByteArray(buffer1, buffer2) {
    let tmp = new Uint8Array((buffer1.byteLength|0) + (buffer2.byteLength|0));
    tmp.set(buffer1, 0);
    tmp.set(buffer2, buffer1.byteLength|0);
    return tmp;
}

export function appendByteArrayAsync(buffer1, buffer2) {
    return new Promise((resolve, reject)=>{
        let blob = new Blob([buffer1, buffer2]);
        let reader = new FileReader();
        reader.addEventListener("loadend", function() {
            resolve();
        });
        reader.readAsArrayBuffer(blob);
    });
}
export function base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

export function hexToByteArray(hex) {
    let len = hex.length >> 1;
    var bufView = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bufView[i] = parseInt(hex.substr(i<<1,2),16);
    }
    return bufView;
}

export function concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (let arr of arrays) {
        totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

export function bitSlice(bytearray, start=0, end=bytearray.byteLength*8) {
    let byteLen = Math.ceil((end-start)/8);
    let res = new Uint8Array(byteLen);
    let startByte = start >>> 3;   // /8
    let endByte = (end>>>3) - 1;    // /8
    let bitOffset = start & 0x7;     // %8
    let nBitOffset = 8 - bitOffset;
    let endOffset = 8 - end & 0x7;   // %8
    for (let i=0; i<byteLen; ++i) {
        let tail = 0;
        if (i<endByte) {
            tail = bytearray[startByte+i+1] >> nBitOffset;
            if (i == endByte-1 && endOffset < 8) {
                tail >>= endOffset;
                tail <<= endOffset;
            }
        }
        res[i]=(bytearray[startByte+i]<<bitOffset) | tail;
    }
    return res;
}

export class BitArray {

    constructor(src) {
        this.src    = new DataView(src.buffer, src.byteOffset, src.byteLength);
        this.bitpos = 0;
        this.byte   = this.src.getUint8(0); /* This should really be undefined, uint wont allow it though */
        this.bytepos = 0;
    }

    readBits(length) {
        if (32 < (length|0) || 0 === (length|0)) {
            /* To big for an uint */
            throw new Error("too big");
        }

        let result = 0;
        for (let i = length; i > 0; --i) {

            /* Shift result one left to make room for another bit,
             then add the next bit on the stream. */
            result = ((result|0) << 1) | (((this.byte|0) >> (8 - (++this.bitpos))) & 0x01);
            if ((this.bitpos|0)>=8) {
                this.byte = this.src.getUint8(++this.bytepos);
                this.bitpos &= 0x7;
            }
        }

        return result;
    }
    skipBits(length) {
        this.bitpos += (length|0) & 0x7; // %8
        this.bytepos += (length|0) >>> 3;  // *8
        if (this.bitpos > 7) {
            this.bitpos &= 0x7;
            ++this.bytepos;
        }

        if (!this.finished()) {
            this.byte = this.src.getUint8(this.bytepos);
            return 0;
        } else {
            return this.bytepos-this.src.byteLength-this.src.bitpos;
        }
    }
    
    finished() {
        return this.bytepos >= this.src.byteLength;
    }
}
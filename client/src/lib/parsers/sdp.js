import {PayloadType} from './defs.js';

export class SDPParser {
    constructor() {
        this.version = -1;
        this.origin = null;
        this.sessionName = null;
        this.timing = null;
        this.sessionBlock = {};
        this.media = {};
        this.tracks = {};
        this.mediaMap = {};
    }

    parse(content) {
        return new Promise((resolve, reject) => {
            var dataString = content;
            var success = true;
            var currentMediaBlock = this.sessionBlock;

            // TODO: multiple audio/video tracks

            for (let line of dataString.split("\n")) {
                line = line.replace(/\r/, '');
                if (0 === line.length) {
                    /* Empty row (last row perhaps?), skip to next */
                    continue;
                }

                switch (line.charAt(0)) {
                    case 'v':
                        if (-1 !== this.version) {
                            console.log('Version present multiple times in SDP');
                            reject();
                            return false;
                        }
                        success = success && this._parseVersion(line);
                        break;

                    case 'o':
                        if (null !== this.origin) {
                            console.log('Origin present multiple times in SDP');
                            reject();
                            return false;
                        }
                        success = success && this._parseOrigin(line);
                        break;

                    case 's':
                        if (null !== this.sessionName) {
                            console.log('Session Name present multiple times in SDP');
                            reject();
                            return false;
                        }
                        success = success && this._parseSessionName(line);
                        break;

                    case 't':
                        if (null !== this.timing) {
                            console.log('Timing present multiple times in SDP');
                            reject();
                            return false;
                        }
                        success = success && this._parseTiming(line);
                        break;

                    case 'm':
                        if (null !== currentMediaBlock && this.sessionBlock !== currentMediaBlock) {
                            /* Complete previous block and store it */
                            this.media[currentMediaBlock.type] = currentMediaBlock;
                        }

                        /* A wild media block appears */
                        currentMediaBlock = {};
                        currentMediaBlock.rtpmap = {};
                        this._parseMediaDescription(line, currentMediaBlock);
                        break;

                    case 'a':
                        SDPParser._parseAttribute(line, currentMediaBlock);
                        break;

                    default:
                        console.log('Ignored unknown SDP directive: ' + line);
                        break;
                }

                if (!success) {
                    reject();
                    return;
                }
            }

            this.media[currentMediaBlock.type] = currentMediaBlock;

            success ? resolve() : reject();
        });
    }

    _parseVersion(line) {
        let matches = line.match(/^v=([0-9]+)$/);
        if (!matches || !matches.length) {
            console.log('\'v=\' (Version) formatted incorrectly: ' + line);
            return false;
        }

        this.version = matches[1];
        if (0 != this.version) {
            console.log('Unsupported SDP version:' + this.version);
            return false;
        }

        return true;
    }

    _parseOrigin(line) {
        let matches = line.match(/^o=([^ ]+) ([0-9]+) ([0-9]+) (IN) (IP4|IP6) ([^ ]+)$/);
        if (!matches || !matches.length) {
            console.log('\'o=\' (Origin) formatted incorrectly: ' + line);
            return false;
        }

        this.origin = {};
        this.origin.username = matches[1];
        this.origin.sessionid = matches[2];
        this.origin.sessionversion = matches[3];
        this.origin.nettype = matches[4];
        this.origin.addresstype = matches[5];
        this.origin.unicastaddress = matches[6];

        return true;
    }

    _parseSessionName(line) {
        let matches = line.match(/^s=([^\r\n]+)$/);
        if (!matches || !matches.length) {
            console.log('\'s=\' (Session Name) formatted incorrectly: ' + line);
            return false;
        }

        this.sessionName = matches[1];

        return true;
    }

    _parseTiming(line) {
        let matches = line.match(/^t=([0-9]+) ([0-9]+)$/);
        if (!matches || !matches.length) {
            console.log('\'t=\' (Timing) formatted incorrectly: ' + line);
            return false;
        }

        this.timing = {};
        this.timing.start = matches[1];
        this.timing.stop = matches[2];

        return true;
    }

    _parseMediaDescription(line, media) {
        let matches = line.match(/^m=([^ ]+) ([^ ]+) ([^ ]+)[ ]/);
        if (!matches || !matches.length) {
            console.log('\'m=\' (Media) formatted incorrectly: ' + line);
            return false;
        }

        media.type = matches[1];
        media.port = matches[2];
        media.proto = matches[3];
        media.fmt = line.substr(matches[0].length).split(' ').map(function (fmt, index, array) {
            return parseInt(fmt);
        });

        for (let fmt of media.fmt) {
            this.mediaMap[fmt] = media;
        }

        return true;
    }

    static _parseAttribute(line, media) {
        if (null === media) {
            /* Not in a media block, can't be bothered parsing attributes for session */
            return true;
        }

        var matches;
        /* Used for some cases of below switch-case */
        var separator = line.indexOf(':');
        var attribute = line.substr(0, (-1 === separator) ? 0x7FFFFFFF : separator);
        /* 0x7FF.. is default */

        switch (attribute) {
            case 'a=recvonly':
            case 'a=sendrecv':
            case 'a=sendonly':
            case 'a=inactive':
                media.mode = line.substr('a='.length);
                break;
            case 'a=range':
                matches = line.match(/^a=range:\s*([a-zA-Z-]+)=([0-9.]+|now)\s*-\s*([0-9.]*)$/);
                media.range = [Number(matches[2] == "now" ? -1 : matches[2]), Number(matches[3]), matches[1]];
                break;
            case 'a=control':
                media.control = line.substr('a=control:'.length);
                break;

            case 'a=rtpmap':
                matches = line.match(/^a=rtpmap:(\d+) (.*)$/);
                if (null === matches) {
                    console.log('Could not parse \'rtpmap\' of \'a=\'');
                    return false;
                }

                var payload = parseInt(matches[1]);
                media.rtpmap[payload] = {};

                var attrs = matches[2].split('/');
                media.rtpmap[payload].name = attrs[0].toUpperCase();
                media.rtpmap[payload].clock = attrs[1];
                if (undefined !== attrs[2]) {
                    media.rtpmap[payload].encparams = attrs[2];
                }
                media.ptype = PayloadType.string_map[attrs[0].toUpperCase()];

                break;

            case 'a=fmtp':
                matches = line.match(/^a=fmtp:(\d+) (.*)$/);
                if (0 === matches.length) {
                    console.log('Could not parse \'fmtp\'  of \'a=\'');
                    return false;
                }

                media.fmtp = {};
                for (var param of matches[2].split(';')) {
                    var idx = param.indexOf('=');
                    media.fmtp[param.substr(0, idx).toLowerCase().trim()] = param.substr(idx + 1).trim();
                }
                break;
        }

        return true;
    }

    getSessionBlock() {
        return this.sessionBlock;
    }

    hasMedia(mediaType) {
        return this.media[mediaType] != undefined;
    }

    getMediaBlock(mediaType) {
        return this.media[mediaType];
    }

    getMediaBlockByPayloadType(pt) {
        // for (var m in this.media) {
        //     if (-1 !== this.media[m].fmt.indexOf(pt)) {
        //         return this.media[m];
        //     }
        // }
        return this.mediaMap[pt] || null;

        //ErrorManager.dispatchError(826, [pt], true);
        // console.error(`failed to find media with payload type ${pt}`);
        //
        // return null;
    }

    getMediaBlockList() {
        var res = [];
        for (var m in this.media) {
            res.push(m);
        }

        return res;
    }
}
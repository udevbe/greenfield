export const IKCP_RTO_NDL = 30 // no delay min rto
export const IKCP_RTO_MIN = 100 // normal min rto
export const IKCP_RTO_DEF = 200
export const IKCP_RTO_MAX = 60000
export const IKCP_CMD_PUSH = 81 // cmd: push data
export const IKCP_CMD_ACK = 82 // cmd: ack
export const IKCP_CMD_WASK = 83 // cmd: window probe (ask)
export const IKCP_CMD_WINS = 84 // cmd: window size (tell)
export const IKCP_ASK_SEND = 1 // need to send IKCP_CMD_WASK
export const IKCP_ASK_TELL = 2 // need to send IKCP_CMD_WINS
export const IKCP_WND_SND = 32
export const IKCP_WND_RCV = 32
export const IKCP_MTU_DEF = 1400
export const IKCP_ACK_FAST = 3
export const IKCP_INTERVAL = 100
export const IKCP_OVERHEAD = 24
export const IKCP_DEADLINK = 20
export const IKCP_THRESH_INIT = 2
export const IKCP_THRESH_MIN = 2
export const IKCP_PROBE_INIT = 7000 // 7 secs to probe window size
export const IKCP_PROBE_LIMIT = 120000 // up to 120 secs to probe window
export const IKCP_SN_OFFSET = 12

const refTime = Date.now()

function currentMs(): number {
  return Date.now() - refTime
}

/* encode 8 bits unsigned int */
function ikcp_encode8u(p: DataView, c: number, offset = 0): void {
  p.setUint8(offset, c)
}

/* decode 8 bits unsigned int */
function ikcp_decode8u(p: DataView, offset = 0): number {
  return p.getUint8(offset)
}

/* encode 16 bits unsigned int (lsb) */
function ikcp_encode16u(p: DataView, w: number, offset = 0) {
  p.setUint16(offset, w, true)
}

/* decode 16 bits unsigned int (lsb) */
function ikcp_decode16u(p: DataView, offset = 0): number {
  return p.getUint16(offset, true)
}

/* encode 32 bits unsigned int (lsb) */
function ikcp_encode32u(p: DataView, l: number, offset = 0): void {
  p.setUint32(offset, l, true)
}

/* decode 32 bits unsigned int (lsb) */
function ikcp_decode32u(p: DataView, offset = 0): number {
  return p.getUint32(offset, true)
}

function _ibound_(lower: number, middle: number, upper: number): number {
  return Math.min(Math.max(lower, middle), upper)
}

class Segment {
  // uint32
  // 会话ID
  conv: number
  // uint8
  // command 的缩写，代表此 segment 是什么类型
  // cmd 有4种，分别是
  // - 数据包 ( IKCP_CMD_PUSH )
  // - ACK 包 ( IKCP_CMD_ACK )
  // - 窗口探测包 ( IKCP_CMD_WASK )
  // - 窗口回应包 ( IKCP_CMD_WINS )
  cmd: number
  // uint8
  // fragment 的缩写
  // 代表数据分片的倒序序号，当数据大于 mss 时，需要将数据分片
  frg: number
  // uint16
  // window 的缩写
  wnd: number
  // uint32
  // timestamp 的缩写，当前 segment 发送的时间戳
  ts: number
  // sequence number 的缩写，代表 segment 的序列号
  sn: number
  // unacknowledged 的缩写，表示此编号之前的包都收到了
  una: number
  // Retransmision TimeOut，超时重传时间
  rto: number
  // segment 的发送次数，没发送一次加1，用于统计 segment 发送了几次
  xmit: number
  // 即 resend timestmap，指定的重传的时间戳
  resendts: number
  // 用于以数据驱动的快速重传机制
  fastack: number
  acked: number

  data!: Uint8Array

  constructor(size?: number, public readonly time?: number) {
    this.conv = 0
    this.cmd = 0
    this.frg = 0
    this.wnd = 0
    this.ts = 0
    this.sn = 0
    this.una = 0
    this.rto = 0
    this.xmit = 0
    this.resendts = 0
    this.fastack = 0
    this.acked = 0
    if (size) {
      this.data = new Uint8Array(size)
    }
  }

  // encode a segment into buffer
  encode(ptr: Uint8Array): Uint8Array {
    const dataView = new DataView(ptr.buffer, ptr.byteOffset, ptr.byteLength)
    ikcp_encode32u(dataView, this.conv)
    ikcp_encode8u(dataView, this.cmd, 4)
    ikcp_encode8u(dataView, this.frg, 5)
    ikcp_encode16u(dataView, this.wnd, 6)
    ikcp_encode32u(dataView, this.ts, 8)
    ikcp_encode32u(dataView, this.sn, 12)
    ikcp_encode32u(dataView, this.una, 16)
    const len = this.data?.byteLength || 0
    ikcp_encode32u(dataView, len, 20)
    return ptr.subarray(IKCP_OVERHEAD)
  }
}

type AckItem = {
  sn: number // uint32
  ts: number // uint32
}

type output_callback = (buf: Uint8Array, len: number, user: any) => void

export class Kcp {
  conv: number // uint32
  mtu: number // uint32
  mss: number // uint32
  state: number // uint32
  // uint32
  snd_una: number
  snd_nxt: number
  rcv_nxt: number
  // uint32
  ts_recent: number
  ts_lastack: number
  ssthresh: number
  // int32
  rx_rttvar: number
  rx_srtt: number
  rx_rto: number
  rx_minrto: number
  // uint32
  snd_wnd: number
  rcv_wnd: number
  rmt_wnd: number
  // 拥塞窗口的大小
  cwnd: number
  probe: number
  // uint32
  interval: number
  ts_flush: number
  xmit: number

  nodelay: number
  updated: number

  ts_probe: number
  probe_wait: number

  dead_link: number
  incr: number

  snd_queue: Segment[]
  rcv_queue: Segment[]
  snd_buf: Segment[]
  rcv_buf: Segment[]

  acklist: AckItem[]

  ackcount: number
  ackblock: number

  buffer: Uint8Array

  fastresend: number // int
  nocwnd: number // int
  stream: number // int

  user: any
  output!: output_callback

  reserved: number // uint32

  constructor(conv: number, user: any) {
    this.conv = conv
    this.mtu = IKCP_MTU_DEF
    this.mss = this.mtu - IKCP_OVERHEAD
    this.buffer = new Uint8Array(this.mtu)
    this.state = 0

    this.snd_una = 0 // 发送出去未得到确认的包的序号
    this.snd_nxt = 0 // 下一个发出去的包的序号
    this.rcv_nxt = 0 // 待接收的下一个包的序号

    this.ts_recent = 0
    this.ts_lastack = 0
    this.ssthresh = IKCP_THRESH_INIT

    this.rx_rttvar = 0
    this.rx_srtt = 0
    this.rx_rto = IKCP_RTO_DEF
    this.rx_minrto = IKCP_RTO_MIN

    this.snd_wnd = IKCP_WND_SND // [发送窗口]的大小
    this.rcv_wnd = IKCP_WND_RCV // [接收窗口]的大小
    this.rmt_wnd = IKCP_WND_RCV // 远端的[接收窗口]的大小
    this.cwnd = 0
    this.probe = 0

    // this.current = 0;
    this.interval = IKCP_INTERVAL
    this.ts_flush = IKCP_INTERVAL
    this.xmit = 0

    this.nodelay = 0
    this.updated = 0

    this.ts_probe = 0
    this.probe_wait = 0

    this.dead_link = IKCP_DEADLINK
    this.incr = 0

    this.snd_queue = []
    this.rcv_queue = []
    this.snd_buf = []
    this.rcv_buf = []

    this.acklist = [] // ack 列表，收到的 ack 放在这里
    this.ackcount = 0 // ack 的个数
    this.ackblock = 0 // acklist 的大小，这个值 >= ackCount

    this.fastresend = 0 // int
    this.nocwnd = 0 // int
    this.stream = 0 // int

    this.reserved = 0

    this.user = user
  }

  private _delSegment(seg: Segment) {
    if (seg?.data) {
      // @ts-ignore
      seg.data = undefined
    }
  }

  setWndSize(sndwnd: number, rcvwnd: number): number {
    if (sndwnd > 0) {
      this.snd_wnd = sndwnd
    }
    if (rcvwnd > 0) {
      this.rcv_wnd = rcvwnd
    }
    return 0
  }

  setMtu(mtu: number): number {
    if (mtu < 50 || mtu < IKCP_OVERHEAD) {
      return -1
    }
    if (this.reserved >= this.mtu - IKCP_OVERHEAD || this.reserved < 0) {
      return -1
    }

    const buffer = new Uint8Array(mtu)
    if (!buffer) {
      return -2
    }
    this.mtu = mtu
    this.mss = this.mtu - IKCP_OVERHEAD - this.reserved
    this.buffer = buffer
    return 0
  }

  // NoDelay options
  // fastest: ikcp_nodelay(kcp, 1, 20, 2, 1)
  // nodelay: 0:disable(default), 1:enable
  // interval: internal update timer interval in millisec, default is 100ms
  // resend: 0:disable fast resend(default), 1:enable fast resend
  // nc: 0:normal congestion control(default), 1:disable congestion control
  setNoDelay(nodelay: number, interval: number, resend: number, nc: number): number {
    if (nodelay >= 0) {
      this.nodelay = nodelay
      if (nodelay != 0) {
        this.rx_minrto = IKCP_RTO_NDL
      } else {
        this.rx_minrto = IKCP_RTO_MIN
      }
    }
    if (interval >= 0) {
      if (interval > 5000) {
        interval = 5000
      } else if (interval < 10) {
        interval = 10
      }
      this.interval = interval
    }
    if (resend >= 0) {
      this.fastresend = resend
    }
    if (nc >= 0) {
      this.nocwnd = nc
    }
    return 0
  }

  release(): void {
    // @ts-ignore
    this.snd_buf = undefined
    // @ts-ignore
    this.rcv_buf = undefined
    // @ts-ignore
    this.snd_queue = undefined
    // @ts-ignore
    this.rcv_queue = undefined
    // @ts-ignore
    this.buffer = undefined
    // @ts-ignore
    this.acklist = undefined
    this.ackcount = 0
  }

  context(): any {
    return this.user
  }

  peekSizeAndRecvDuration(): { size: number; duration: number } {
    if (this.rcv_queue.length === 0) {
      return { size: -1, duration: 0 }
    }

    const seg = this.rcv_queue[0]
    if (seg.frg === 0) {
      return { size: seg.data.length, duration: 0 }
    }

    if (this.rcv_queue.length < seg.frg + 1) {
      return { size: -1, duration: 0 }
    }

    let length = 0
    let startRecvTime = Infinity
    let endRecvTime = 0
    for (const seg of this.rcv_queue) {
      if (seg.time && seg.time < startRecvTime) {
        startRecvTime = seg.time
      }
      if (seg.time && seg.time > endRecvTime) {
        endRecvTime = seg.time
      }
      length += seg.data.byteLength
      if (seg.frg === 0) {
        break
      }
    }
    return { size: length, duration: endRecvTime - startRecvTime }
  }

  recv(buffer: Uint8Array): number {
    const peeksize = this.peekSize()
    if (peeksize < 0) {
      return -1
    }
    if (peeksize > buffer.byteLength) {
      return -2
    }

    let fast_recover = false
    if (this.rcv_queue.length >= this.rcv_wnd) {
      fast_recover = true
    }

    let n = 0
    let count = 0
    for (const seg of this.rcv_queue) {
      buffer.set(seg.data)
      buffer = buffer.subarray(seg.data.byteLength)
      n += seg.data.byteLength
      count++
      this._delSegment(seg)
      if (seg.frg === 0) {
        break
      }
    }
    if (count > 0) {
      this.rcv_queue.splice(0, count)
    }

    // move available data from rcv_buf -> rcv_queue
    count = 0
    for (const seg of this.rcv_buf) {
      if (seg.sn === this.rcv_nxt && this.rcv_queue.length + count < this.rcv_wnd) {
        this.rcv_nxt++
        count++
      } else {
        break
      }
    }

    if (count > 0) {
      const segs = this.rcv_buf.splice(0, count)
      this.rcv_queue.push(...segs)
    }

    // fast recover
    if (this.rcv_queue.length < this.rcv_wnd && fast_recover) {
      this.probe |= IKCP_ASK_TELL
    }
    return n
  }

  // Input a packet into kcp state machine.
  //
  // 'regular' indicates it's a real data packet from remote, and it means it's not generated from ReedSolomon
  // codecs.
  //
  // 'ackNoDelay' will trigger immediate ACK, but surely it will not be efficient in bandwidth
  // @ts-ignore
  input(data: Uint8Array, regular: boolean, ackNodelay: boolean): number {
    const snd_una = this.snd_una
    if (data.byteLength < IKCP_OVERHEAD) {
      return -1
    }

    let latest = 0 // uint32 , the latest ack packet
    let flag = 0 // int
    let inSegs = 0 // uint64 统计用
    let windowSlides = false

    while (true) {
      let ts = 0 // uint32
      let sn = 0 // uint32
      let length = 0 // uint32
      let una = 0 // uint32
      let conv = 0 // uint32
      let wnd = 0 // uint16
      let cmd = 0 // uint3
      let frg = 0 // uint8

      if (data.byteLength < IKCP_OVERHEAD) {
        break
      }

      const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength)
      conv = ikcp_decode32u(dataView)
      if (conv !== this.conv) {
        return -1
      }

      cmd = ikcp_decode8u(dataView, 4)
      frg = ikcp_decode8u(dataView, 5)
      wnd = ikcp_decode16u(dataView, 6)
      ts = ikcp_decode32u(dataView, 8)
      sn = ikcp_decode32u(dataView, 12)
      una = ikcp_decode32u(dataView, 16)
      length = ikcp_decode32u(dataView, 20)
      data = data.subarray(IKCP_OVERHEAD)
      if (data.byteLength < length) {
        return -2
      }

      if (cmd !== IKCP_CMD_PUSH && cmd !== IKCP_CMD_ACK && cmd !== IKCP_CMD_WASK && cmd !== IKCP_CMD_WINS) {
        return -3
      }

      // only trust window updates from regular packates. i.e: latest update
      if (regular) {
        this.rmt_wnd = wnd
      }
      if (this._parse_una(una) > 0) {
        windowSlides = true
      }
      this._shrink_buf()

      if (cmd === IKCP_CMD_ACK) {
        this._parse_ack(sn)
        this._parse_fastack(sn, ts)
        flag |= 1
        latest = ts
      } else if (cmd === IKCP_CMD_PUSH) {
        let repeat = true
        if (sn < this.rcv_nxt + this.rcv_wnd) {
          this._ack_push(sn, ts)
          if (sn >= this.rcv_nxt) {
            const seg = new Segment(0, performance.now())
            seg.conv = conv
            seg.cmd = cmd
            seg.frg = frg
            seg.wnd = wnd
            seg.ts = ts
            seg.sn = sn
            seg.una = una
            seg.data = data.subarray(0, length) // delayed data copying
            repeat = this._parse_data(seg)
          }
        }
        if (regular && repeat) {
          // do nothing
          // 统计重复的包
        }
      } else if (cmd === IKCP_CMD_WASK) {
        // ready to send back IKCP_CMD_WINS in Ikcp_flush
        // tell remote my window size
        this.probe |= IKCP_ASK_TELL
      } else if (cmd === IKCP_CMD_WINS) {
        // do nothing
      } else {
        return -3
      }

      inSegs++
      data = data.subarray(length)
    }

    // update rtt with the latest ts
    // ignore the FEC packet
    if (flag !== 0 && regular) {
      const current = currentMs()
      if (current >= latest) {
        this._update_ack(current - latest)
      }
    }

    // cwnd update when packet arrived
    if (this.nocwnd === 0) {
      if (this.snd_una > snd_una) {
        if (this.cwnd < this.rmt_wnd) {
          const mss = this.mss
          if (this.cwnd < this.ssthresh) {
            this.cwnd++
            this.incr += mss
          } else {
            if (this.incr < mss) {
              this.incr = mss
            }
            this.incr += (mss * mss) / this.incr + mss / 16
            if ((this.cwnd + 1) * mss <= this.incr) {
              if (mss > 0) {
                this.cwnd = (this.incr + mss - 1) / mss
              } else {
                this.cwnd = this.incr + mss - 1
              }
            }
          }
          if (this.cwnd > this.rmt_wnd) {
            this.cwnd = this.rmt_wnd
            this.incr = this.rmt_wnd * mss
          }
        }
      }
    }

    if (windowSlides) {
      // if window has slided, flush
      this.flush(false)
    } else if (ackNodelay && this.acklist.length > 0) {
      // ack immediately
      this.flush(true)
    }
  }

  private _parse_una(una: number): number {
    let count = 0
    for (const seg of this.snd_buf) {
      if (una > seg.sn) {
        this._delSegment(seg)
        count++
      } else {
        break
      }
    }
    if (count > 0) {
      this.snd_buf.splice(0, count)
    }
    return count
  }

  private _shrink_buf() {
    if (this.snd_buf.length > 0) {
      const seg = this.snd_buf[0]
      this.snd_una = seg.sn
    } else {
      this.snd_una = this.snd_nxt
    }
  }

  private _parse_ack(sn: number) {
    if (sn < this.snd_una || sn >= this.snd_nxt) {
      return
    }

    for (const seg of this.snd_buf) {
      if (sn === seg.sn) {
        // mark and free space, but leave the segment here,
        // and wait until `una` to delete this, then we don't
        // have to shift the segments behind forward,
        // which is an expensive operation for large window
        seg.acked = 1
        this._delSegment(seg)
        break
      }
      if (sn < seg.sn) {
        break
      }
    }
  }

  private _parse_fastack(sn: number, ts: number) {
    if (sn < this.snd_una || sn >= this.snd_nxt) {
      return
    }

    for (const seg of this.snd_buf) {
      if (sn < seg.sn) {
        break
      } else if (sn !== seg.sn && seg.ts <= ts) {
        seg.fastack++
      }
    }
  }

  // returns true if data has repeated
  private _parse_data(newseg: Segment): boolean {
    const sn = newseg.sn
    if (sn >= this.rcv_nxt + this.rcv_wnd || sn < this.rcv_nxt) {
      return true
    }

    let insert_idx = 0
    let repeat = false
    if (this.rcv_buf.length > 0) {
      const n = this.rcv_buf.length - 1
      for (let i = n; i >= 0; i--) {
        const seg = this.rcv_buf[i]
        if (seg.sn === sn) {
          repeat = true
          break
        }
        if (sn > seg.sn) {
          insert_idx = i + 1
          break
        }
      }
    }

    if (!repeat) {
      // replicate the content if it's new
      const dataCopy = new Uint8Array(newseg.data.byteLength)
      dataCopy.set(newseg.data)
      newseg.data = dataCopy

      this.rcv_buf.splice(insert_idx, 0, newseg)
    }

    // move available data from rcv_buf -> rcv_queue
    let count = 0
    for (const seg of this.rcv_buf) {
      if (seg.sn === this.rcv_nxt && this.rcv_queue.length + count < this.rcv_wnd) {
        this.rcv_nxt++
        count++
      } else {
        break
      }
    }
    if (count > 0) {
      const segs = this.rcv_buf.splice(0, count)
      this.rcv_queue.push(...segs)
    }

    return repeat
  }

  private _update_ack(rtt: number): void {
    // https://tools.ietf.org/html/rfc6298
    let rto = 0 // uint32
    if (this.rx_srtt === 0) {
      this.rx_srtt = rtt
      this.rx_rttvar = rtt >> 1
    } else {
      let delta = rtt - this.rx_srtt
      this.rx_srtt += delta >> 3
      if (delta < 0) {
        delta = -delta
      }
      if (rtt < this.rx_srtt - this.rx_rttvar) {
        // if the new RTT sample is below the bottom of the range of
        // what an RTT measurement is expected to be.
        // give an 8x reduced weight versus its normal weighting
        this.rx_rttvar += (delta - this.rx_rttvar) >> 5
      } else {
        this.rx_rttvar += (delta - this.rx_rttvar) >> 2
      }
    }
    rto = this.rx_srtt + Math.max(this.interval, this.rx_rttvar << 2)
    this.rx_rto = _ibound_(this.rx_minrto, rto, IKCP_RTO_MAX)
  }

  private _ack_push(sn: number, ts: number) {
    this.acklist.push({ sn, ts })
  }

  send(buffer: Uint8Array): number {
    let count = 0
    if (buffer.byteLength === 0) {
      return -1
    }

    // append to previous segment in streaming mode (if possible)
    if (this.stream !== 0) {
      const n = this.snd_queue.length
      if (n > 0) {
        const seg = this.snd_queue[n - 1]
        if (seg.data.byteLength < this.mss) {
          const capacity = this.mss - seg.data.byteLength
          let extend = capacity
          if (buffer.byteLength < capacity) {
            extend = buffer.byteLength
          }

          // grow slice, the underlying cap is guaranteed to
          // be larger than kcp.mss
          const oldlen = seg.data.byteLength
          seg.data = seg.data.subarray(0, oldlen + extend)

          seg.data.set(buffer.subarray(oldlen))
          buffer = buffer.subarray(extend)
        }
      }
    }

    if (buffer.byteLength <= this.mss) {
      count = 1
    } else {
      count = Math.floor((buffer.byteLength + this.mss - 1) / this.mss)
    }

    if (count > 255) {
      return -2
    }

    if (count === 0) {
      count = 1
    }

    for (let i = 0; i < count; i++) {
      let size = 0
      if (buffer.byteLength > this.mss) {
        size = this.mss
      } else {
        size = buffer.byteLength
      }
      const seg = new Segment(size)
      seg.data.set(buffer.subarray(0, size))
      if (this.stream === 0) {
        // message mode
        seg.frg = count - i - 1 // uint8
      } else {
        // stream mode
        seg.frg = 0
      }
      this.snd_queue.push(seg)
      buffer = buffer.subarray(size)
    }

    return 0
  }

  setOutput(output: output_callback): void {
    this.output = output
  }

  // Update updates state (call it repeatedly, every 10ms-100ms), or you can ask
  // ikcp_check when to call it again (without ikcp_input/_send calling).
  // 'current' - current timestamp in millisec.
  update(): void {
    let slap = 0 // int32

    const current = currentMs()
    if (this.updated === 0) {
      this.updated = 1
      this.ts_flush = current
    }

    slap = current - this.ts_flush

    if (slap >= 10000 || slap < -10000) {
      this.ts_flush = current
      slap = 0
    }

    if (slap >= 0) {
      this.ts_flush += this.interval
      if (current >= this.ts_flush) {
        this.ts_flush = current + this.interval
      }
      this.flush(false)
    }
  }

  // Check determines when should you invoke ikcp_update:
  // returns when you should invoke ikcp_update in millisec, if there
  // is no ikcp_input/_send calling. you can call ikcp_update in that
  // time, instead of call update repeatly.
  // Important to reduce unnacessary ikcp_update invoking. use it to
  // schedule ikcp_update (eg. implementing an epoll-like mechanism,
  // or optimize ikcp_update when handling massive kcp connections)
  check(): number {
    const current = currentMs()
    let ts_flush = this.ts_flush
    let tm_flush = 0x7fffffff
    let tm_packet = 0x7fffffff
    let minimal = 0

    if (this.updated === 0) {
      return 0
    }

    if (current - ts_flush >= 10000 || current - ts_flush < -10000) {
      ts_flush = current
    }

    if (current >= ts_flush) {
      return 0
    }

    tm_flush = ts_flush - current

    for (const seg of this.snd_buf) {
      const diff = seg.resendts - current
      if (diff <= 0) {
        return 0
      }
      if (diff < tm_packet) {
        tm_packet = diff
      }
    }

    minimal = tm_packet
    if (tm_packet >= tm_flush) {
      minimal = tm_flush
    }
    if (minimal >= this.interval) {
      minimal = this.interval
    }

    return minimal
  }

  private _wnd_unused(): number {
    if (this.rcv_queue.length < this.rcv_wnd) {
      return this.rcv_wnd - this.rcv_queue.length
    }
    return 0
  }

  // flush pending data
  flush(ackOnly: boolean): number {
    const seg = new Segment()
    seg.conv = this.conv
    seg.cmd = IKCP_CMD_ACK
    seg.wnd = this._wnd_unused()
    seg.una = this.rcv_nxt

    const buffer = this.buffer
    let ptr = buffer.subarray(this.reserved) // keep n bytes untouched

    // makeSpace makes room for writing
    const makeSpace = (space: number) => {
      const size = buffer.byteLength - ptr.byteLength
      if (size + space > this.mtu) {
        this.output(buffer, size, this.user)
        ptr = buffer.subarray(this.reserved)
      }
    }

    // flush bytes in buffer if there is any
    const flushBuffer = () => {
      const size = buffer.byteLength - ptr.byteLength
      if (size > this.reserved) {
        this.output(buffer, size, this.user)
      }
    }

    // flush acknowledges
    for (let i = 0; i < this.acklist.length; i++) {
      const ack = this.acklist[i]
      makeSpace(IKCP_OVERHEAD)
      // filter jitters cased by bufferbloat
      if (ack.sn >= this.rcv_nxt || this.acklist.length - 1 === i) {
        seg.sn = ack.sn
        seg.ts = ack.ts
        ptr = seg.encode(ptr)
      }
    }
    this.acklist = []

    if (ackOnly) {
      // flash remain ack segments
      flushBuffer()
      return this.interval
    }

    // probe window size (if remote window size equals zero)
    if (this.rmt_wnd === 0) {
      const current = currentMs()
      if (this.probe_wait === 0) {
        this.probe_wait = IKCP_PROBE_INIT
        this.ts_probe = current + this.probe_wait
      } else {
        if (current >= this.ts_probe) {
          if (this.probe_wait < IKCP_PROBE_INIT) {
            this.probe_wait = IKCP_PROBE_INIT
          }
          this.probe_wait += this.probe_wait / 2
          if (this.probe_wait > IKCP_PROBE_LIMIT) {
            this.probe_wait = IKCP_PROBE_LIMIT
          }
          this.ts_probe = current + this.probe_wait
          this.probe |= IKCP_ASK_SEND
        }
      }
    } else {
      this.ts_probe = 0
      this.probe_wait = 0
    }

    // flush window probing commands
    if ((this.probe & IKCP_ASK_SEND) != 0) {
      seg.cmd = IKCP_CMD_WASK
      makeSpace(IKCP_OVERHEAD)
      ptr = seg.encode(ptr)
    }

    // flush window probing commands
    if ((this.probe & IKCP_ASK_TELL) != 0) {
      seg.cmd = IKCP_CMD_WINS
      makeSpace(IKCP_OVERHEAD)
      ptr = seg.encode(ptr)
    }

    this.probe = 0

    // calculate window size
    let cwnd = Math.min(this.snd_wnd, this.rmt_wnd)
    if (this.nocwnd === 0) {
      cwnd = Math.min(this.cwnd, cwnd)
    }

    // sliding window, controlled by snd_nxt && sna_una + cwnd
    let newSegsCount = 0
    for (let k = 0; k < this.snd_queue.length; k++) {
      if (this.snd_nxt >= this.snd_una + cwnd) {
        break
      }
      const newseg = this.snd_queue[k]
      newseg.conv = this.conv
      newseg.cmd = IKCP_CMD_PUSH
      newseg.sn = this.snd_nxt
      this.snd_buf.push(newseg)
      this.snd_nxt++
      newSegsCount++
    }
    if (newSegsCount > 0) {
      this.snd_queue.splice(0, newSegsCount)
    }

    // calculate resent
    let resent = this.fastresend
    if (this.fastresend <= 0) {
      resent = 0xffffffff
    }

    // check for retransmissions
    const current = currentMs()
    let change = 0
    let lostSegs = 0
    let fastRetransSegs = 0
    let earlyRetransSegs = 0
    let minrto = this.interval

    // const ref = this.snd_buf.slice(); // for bounds check elimination
    const ref = this.snd_buf
    for (let k = 0; k < ref.length; k++) {
      const segment = ref[k]
      let needsend = false
      if (segment.acked === 1) {
        continue
      }
      if (segment.xmit === 0) {
        // initial transmit
        needsend = true
        segment.rto = this.rx_rto
        segment.resendts = current + segment.rto
      } else if (segment.fastack >= resent) {
        // fast retransmit
        needsend = true
        segment.fastack = 0
        segment.rto = this.rx_rto
        segment.resendts = current + segment.rto
        change++
        fastRetransSegs++
      } else if (segment.fastack > 0 && newSegsCount === 0) {
        // early retransmit
        needsend = true
        segment.fastack = 0
        segment.rto = this.rx_rto
        segment.resendts = current + segment.rto
        change++
        earlyRetransSegs++
      } else if (current >= segment.resendts) {
        // RTO
        needsend = true
        if (this.nodelay === 0) {
          segment.rto += this.rx_rto
        } else {
          segment.rto += Math.floor(this.rx_rto / 2)
        }
        segment.fastack = 0
        segment.resendts = current + segment.rto
        lostSegs++
      }

      if (needsend) {
        const current = currentMs()
        segment.xmit++
        segment.ts = current
        segment.wnd = seg.wnd
        segment.una = seg.una

        const need = IKCP_OVERHEAD + segment.data.byteLength
        makeSpace(need)
        ptr = segment.encode(ptr)
        ptr.set(segment.data)
        ptr = ptr.subarray(segment.data.byteLength)

        if (segment.xmit >= this.dead_link) {
          this.state = 0xffffffff
        }
      }

      // get the nearest rto
      const rto = segment.resendts - current
      if (rto > 0 && rto < minrto) {
        minrto = rto
      }
    }

    // flush remain segments
    flushBuffer()

    // counter updates
    let sum = lostSegs
    if (lostSegs > 0) {
      // stat
    }
    if (fastRetransSegs > 0) {
      sum += fastRetransSegs
    }
    if (earlyRetransSegs > 0) {
      sum += earlyRetransSegs
    }
    if (sum > 0) {
      // stat
    }

    // cwnd update
    if (this.nocwnd === 0) {
      // update ssthresh
      // rate halving, https://tools.ietf.org/html/rfc6937
      if (change > 0) {
        const inflight = this.snd_nxt - this.snd_una
        this.ssthresh = Math.floor(inflight / 2)
        if (this.ssthresh < IKCP_THRESH_MIN) {
          this.ssthresh = IKCP_THRESH_MIN
        }
        this.cwnd = this.ssthresh + resent
        this.incr = this.cwnd * this.mss
      }

      // congestion control, https://tools.ietf.org/html/rfc5681
      if (lostSegs > 0) {
        this.ssthresh = Math.floor(cwnd / 2)
        if (this.ssthresh < IKCP_THRESH_MIN) {
          this.ssthresh = IKCP_THRESH_MIN
        }
        this.cwnd = 1
        this.incr = this.mss
      }

      if (this.cwnd < 1) {
        this.cwnd = 1
        this.incr = this.mss
      }
    }

    return minrto
  }

  peekSize(): number {
    if (this.rcv_queue.length === 0) {
      return -1
    }

    const seg = this.rcv_queue[0]
    if (seg.frg === 0) {
      return seg.data.length
    }

    if (this.rcv_queue.length < seg.frg + 1) {
      return -1
    }

    let length = 0
    for (const seg of this.rcv_queue) {
      length += seg.data.byteLength
      if (seg.frg === 0) {
        break
      }
    }
    return length
  }

  // WaitSnd gets how many packet is waiting to be sent
  getWaitSnd(): number {
    return this.snd_buf.length + this.snd_queue.length
  }

  setReserveBytes(len: number): boolean {
    if (len >= this.mtu - IKCP_OVERHEAD || len < 0) {
      return false
    }
    this.reserved = len
    this.mss = this.mtu - IKCP_OVERHEAD - len
    return true
  }
}

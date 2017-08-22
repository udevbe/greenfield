#!/usr/bin/env node

'use strict'

const fs = require('fs')
const childProcess = require('child_process')
const Splitter = require('stream-split')

const LocalSession = require('./LocalSession')
const LocalClient = require('./LocalClient')
const LocalRtcBufferFactory = require('./LocalRtcBufferFactory')

const NALseparator = Buffer.from([0, 0, 0, 1])// NAL break
const frameHeader = Buffer.alloc(4)// frame counter header

/**
 *
 * @param {LocalClient} localClient
 * @param {LocalRtcDcBuffer} localRtcDcBuffer
 * @param {wfc.GrSurface} grSurfaceProxy
 */
function pushTestClientFrames (localClient, localRtcDcBuffer, grSurfaceProxy) {
  const dataChannel = localRtcDcBuffer.dataChannel

  // crate named pipe and get fd to it:
  const fifoPath = '/tmp/tmp.fifo'

  fs.unlink(fifoPath, (error) => {
    childProcess.execSync('mkfifo ' + fifoPath)

    fs.open(fifoPath, 'r', (err, fd) => {
      if (err) {
        console.error('Error: Failure during addIceCandidate()', error)
        localClient.connection.close()
      } else {
        const h264Stream = fs.createReadStream(null, {
          fd: fd
        })

        let frameCounter = 0
        const nalStream = h264Stream.pipe(new Splitter(NALseparator))
        nalStream.on('data', (data) => {
          // attach the buffer
          grSurfaceProxy.attach(localRtcDcBuffer.grBufferProxy, 0, 0)

          // send the buffer contents
          frameCounter++
          localRtcDcBuffer.rtcDcBufferProxy.syn(frameCounter)
          // set size once
          if (frameCounter === 1) {
            localRtcDcBuffer.rtcDcBufferProxy.size(800, 600)
          }
          frameHeader.writeUInt32LE(frameCounter, 0, false)
          const h264Nal = Buffer.concat([frameHeader, data])
          dataChannel.send(h264Nal.buffer.slice(h264Nal.byteOffset, h264Nal.byteOffset + h264Nal.byteLength))

          // commit the buffer
          grSurfaceProxy.commit()
        })
      }
    })

    // spawn gstreamer child process and send raw h264 frames to a named pipe
    const rtpStreamProcess = childProcess.spawn('gst-launch-1.0',
      ['videotestsrc', 'pattern=0', 'is-live=true', 'do-timestamp=true', '!',
        'clockoverlay', '!',
        'videorate', '!', 'video/x-raw,framerate=30/1', '!',
        'videoconvert', '!', 'video/x-raw,format=I420,width=800,height=600', '!',
        'x264enc', 'byte-stream=true', 'key-int-max=30', 'pass=pass1', 'tune=zerolatency', 'threads=2', 'ip-factor=2', 'speed-preset=veryfast', 'intra-refresh=0', 'qp-max=43', '!',
        // 'vaapih264enc', 'keyframe-period=600', 'rate-control=vbr', 'bitrate=10000', '!',
        'video/x-h264,profile=constrained-baseline,stream-format=byte-stream,framerate=30/1', '!',
        'filesink', 'location=' + fifoPath, 'append=true', 'buffer-mode=unbuffered', 'sync=false'])
    // immediately unlink the file, the resulting file descriptor won't be cleaned up until the child process is terminated.

    rtpStreamProcess.on('exit', (exit) => {
      console.log('gst-launch exited: ' + exit)
    })
  })
}

/**
 *
 * @param {LocalClient} localClient
 */
function testClient (localClient) {
  const grSurfaceProxy = localClient.localCompositor.grCompositorProxy.createSurface()
  const grRegionProxy = localClient.localCompositor.grCompositorProxy.createRegion()
  grRegionProxy.add(0, 0, 800, 600)
  grSurfaceProxy.setOpaqueRegion(grRegionProxy)

  LocalRtcBufferFactory.create(localClient).then((localRtcBufferFactory) => {
    const localRtcDcBuffer = localRtcBufferFactory.createLocalRtcDcBuffer()
    pushTestClientFrames(localClient, localRtcDcBuffer, grSurfaceProxy)
  })
}

function main () {
  // TODO browser should inquire for a session id first through a http request, in response a websocket server
  // is forked that maps its url based on this session id. The browser will then connect to this forked server.

  // TODO this code should run in a forked instance that basically tracks the lifecycle of the browser connection.
  // This means that LocalSession will become invalid as soon as the browser disconnects.
  LocalSession.create().then((localSession) => {
    return localSession.createConnection()
  }).then((wfcConnection) => {
    return LocalClient.create(wfcConnection)
  }).then((localClient) => {
    testClient(localClient)
  }).catch((error) => {
    console.error(error)
  })
}

main()

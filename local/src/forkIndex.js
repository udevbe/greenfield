#!/usr/bin/env node

'use strict'

const ShimSession = require('./ShimSession')

// const LocalRtcBufferFactory = require('./LocalRtcBufferFactory')
// const H264Encoder = require('./H264Encoder')

// /**
//  *
//  * @param {LocalClient} localClient
//  * @param {LocalRtcDcBuffer} localRtcDcBuffer
//  * @param {wfc.GrSurface} grSurfaceProxy
//  */
// function pushTestClientFrames (localClient, localRtcDcBuffer, grSurfaceProxy) {
//   const dataChannel = localRtcDcBuffer.dataChannel
//
//   const h264Encoder = H264Encoder.create()
//
//   let frameCounter = 0
//   const pull = () => {
//     h264Encoder.appsink.pull(function (buf) {
//       if (buf) {
//         // attach the buffer
//         grSurfaceProxy.attach(localRtcDcBuffer.grBufferProxy, 0, 0)
//
//         // send the buffer contents
//         frameCounter++
//         localRtcDcBuffer.rtcDcBufferProxy.syn(frameCounter)
//         // set size once
//         if (frameCounter === 1) {
//           localRtcDcBuffer.rtcDcBufferProxy.size(1280, 720)
//         }
//         buf.writeUInt32LE(frameCounter, 0, false)
//         dataChannel.send(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
//
//         // commit the buffer
//         grSurfaceProxy.commit()
//
//         pull()
//       } else {
//         console.log('no buf')
//         setTimeout(pull, 66)
//       }
//     })
//   }
//
//   h264Encoder.pipeline.play()
//
//   pull()
// }

// /**
//  *
//  * @param {LocalClient} localClient
//  */
// function testClient (localClient) {
//   const grSurfaceProxy = localClient.localCompositor.proxy.createSurface()
//   const grRegionProxy = localClient.localCompositor.proxy.createRegion()
//   grRegionProxy.add(0, 0, 800, 600)
//   grSurfaceProxy.setOpaqueRegion(grRegionProxy)
//
//   LocalRtcBufferFactory.create(localClient).then((localRtcBufferFactory) => {
//     const localRtcDcBuffer = localRtcBufferFactory.createLocalRtcDcBuffer()
//     pushTestClientFrames(localClient, localRtcDcBuffer, grSurfaceProxy)
//   })
// }

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error.stack)
  })

  process.once('message', (request, socket) => {
    ShimSession.create(request[0], socket, request[1]).then((shimSession) => {
      process.on('message', (request, socket) => {
        shimSession.localSession._handleUpgrade(request[0], socket, request[1])
      })

      const cleanUp = () => {
        shimSession.end('shim-compositor closed.')
        process.exit(0)
      }

      process.on('SIGINT', cleanUp)
      process.on('SIGTERM', cleanUp)
      process.on('SIGBREAK', cleanUp)
      process.on('SIGHUP', cleanUp)

      shimSession.localSession.primaryConnection.onClose = () => {
        shimSession.end('remote end closed.')
        process.exit(0)
      }

      shimSession.start()
    }).catch((error) => {
      console.error(error)
      // FIXME handle error state (disconnect?)
    })
  })
}

main()

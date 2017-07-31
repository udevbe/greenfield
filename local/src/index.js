#!/usr/bin/env node

'use strict'

const LocalSession = require('./LocalSession')
const LocalClient = require('./LocalClient')
const LocalRtcBufferFactory = require('./LocalRtcBufferFactory')

function testClient (localClient) {
  const grSurfaceProxy = localClient.compositor.grCompositorProxy.createSurface()
  const grRegionProxy = localClient.compositor.grCompositorProxy.createRegion()
  grRegionProxy.add(0, 0, 100, 200)
  grSurfaceProxy.setOpaqueRegion(grRegionProxy)

  LocalRtcBufferFactory.create(localClient).then((localRtcBufferFactory) => {
    const localRtcDcBuffer = localRtcBufferFactory.createLocalRtcDcBuffer()
    localRtcDcBuffer.dataChannel.onopen = (evet) => {
      localRtcDcBuffer.dataChannel.send('test123')
    }
  })
}

function main () {
  // TODO browser should inquire for a session id first through a http request, in reponse a websocket server
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

#!/usr/bin/env node

'use strict'

const LocalSession = require('./LocalSession')
const LocalClient = require('./LocalClient')

function testClient (localClient) {
  const grSurfaceProxy = localClient.compositor.grCompositorProxy.createSurface()
  const grRegionProxy = localClient.compositor.grCompositorProxy.createRegion()
  grRegionProxy.add(0, 0, 100, 200)
  grSurfaceProxy.setOpaqueRegion(grRegionProxy)
}

function main () {
  // TODO browser should inquire for a session id first through a http request, in reponse a websocket server
  // is forked that maps its url based on this session id. The browser will then connect to this forked server.

  // TODO this code should run in a forked instance that basically tracks the lifecycle of the browser connection.
  // This means that LocalSession will become invalid as soon as the browser disconnects.
  LocalSession.create().then((localSession) => {
    return localSession.createConnection()
  }).then((connection) => {
    return LocalClient.create(connection)
  }).then((localClient) => {
    testClient(localClient)
  })
}

main()

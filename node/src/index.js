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
  LocalSession.create().then((localSession) => {
    return localSession.createConnection()
  }).then((connection) => {
    return LocalClient.create(connection)
  }).then((localClient) => {
    testClient(localClient)
  })
}

main()

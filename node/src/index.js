#!/usr/bin/env node

'use strict'

import LocalSession from './LocalSession'
import LocalClient from './LocalClient'

function testClient (localClient) {
  const grSurfaceProxy = localClient.compositor.grCompositorProxy.createSurface()
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

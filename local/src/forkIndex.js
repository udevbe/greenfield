#!/usr/bin/env node

'use strict'

const ShimSession = require('./ShimSession')

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error.stack)
  })

  process.once('message', async (request, socket) => {
    const shimSession = await ShimSession.create(request[0], socket, request[1])
    process.on('message', (request, socket) => {
      shimSession.localSession._handleUpgrade(request[0], socket, request[1]).catch((error) => {
        console.error(error)
        // TODO disconnection client here?
      })
    })

    const cleanUp = () => {
      shimSession.end('shim-compositor closed.')
      process.exit(0)
    }

    process.on('SIGINT', cleanUp)
    process.on('SIGTERM', cleanUp)
    process.on('SIGBREAK', cleanUp)
    process.on('SIGHUP', cleanUp)

    shimSession.localSession.onTerminate = () => {
      console.log(`Child ${process.pid} will exit.`)
      process.exit(0)
    }
    shimSession.start()
  })
}

main()

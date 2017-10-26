#!/usr/bin/env node

'use strict'

const ShimSession = require('./ShimSession')

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error.stack)
  })

  process.once('message', (request, socket) => {
    ShimSession.create(request[0], socket, request[1]).then((shimSession) => {
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

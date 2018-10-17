'use strict'

const AppEndpointCompositorPair = require('./AppEndpointCompositorPair')

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error, error.stack)
  })

  const cleanUp = () => {
    process.exit(0)
  }

  process.on('SIGINT', cleanUp)
  process.on('SIGTERM', cleanUp)
  process.on('SIGBREAK', cleanUp)
  process.on('SIGHUP', cleanUp)

  process.once('message', async (message) => {
    const compositorSessionid = message.compositorSessionId

    const appEndpointCompositorPair = await AppEndpointCompositorPair.create(compositorSessionid)
    appEndpointCompositorPair.onDestroy().then(() => {
      cleanUp()
    })
  })
}

main()

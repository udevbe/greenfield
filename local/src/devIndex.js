'use strict'

const express = require('express')
const http = require('http')
const webpack = require('webpack')
const webpackConfig = require('../../browser/build.config/webpack.config.dev')
const middleware = require('webpack-dev-middleware')
const ShimSession = require('./ShimSession')
const DesktopShellAppsController = require('./DesktopShellAppsController')

const controllers = {
  'apps': DesktopShellAppsController
}

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error)
  })

  console.warn('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  console.warn('!!! Running in DEVELOPMENT mode !!!')
  console.warn('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n')

  const compiler = webpack(webpackConfig)

  const app = express()

  app.use(middleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))
  app.use(require('webpack-hot-middleware')(compiler))

  const server = http.createServer()
  server.on('request', app)

  let shimSessionPromise = null

  server.on('upgrade', async (request, socket, head) => {
    if (shimSessionPromise) {
      await shimSessionPromise
      // handle other non-session websocket connections
      const pathElements = request.url.split('/')
      pathElements.shift() // empty element
      const sessionId = pathElements.shift()
      console.log(`Development session id is ${sessionId}`)
      const controllerId = pathElements.shift()
      const controller = controllers[controllerId]
      if (controller) {
        controller.create(request, socket, pathElements)
      }
    } else {
      shimSessionPromise = ShimSession.create(request, socket, head)
      const shimSession = await shimSessionPromise
      shimSession.localSession.onTerminate = () => {
        console.log('Development session terminated.')
      }
      shimSession.start()
      console.log('Development session started.')
    }
  })

  server.listen(8080)
}

main()

'use strict'

const express = require('express')
const http = require('http')
const webpack = require('webpack')
const webpackConfig = require('../../browser/build.config/webpack.config.dev')
const middleware = require('webpack-dev-middleware')
const ShimSession = require('./ShimSession')

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

  let shimSession = null

  server.on('upgrade', async (request, socket, head) => {
    if (!shimSession) {
      shimSession = await ShimSession.create(request, socket, head)
      shimSession.localSession.onTerminate = () => {
        shimSession = null
        console.log('Session terminated.')
      }
      shimSession.start()
      console.log('Session started.')
    } else {
      console.error('Only a single connection is supported in development mode.')
    }
  })

  server.listen(8080)
}

main()

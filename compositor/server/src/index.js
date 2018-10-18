'use strict'

const config = require('./src/config')
const express = require('express')
const http = require('http')
const childProcess = require('child_process')
const path = require('path')

const WebSocket = require('ws')

const AppEndpoint = require('./src/AppEndpoint')
const appEndpointWebSocketServer = new WebSocket.Server({
  noServer: true,
  handshakeTimeout: 2000
})

/**
 * @type {Object.<string, ChildProcess>}
 */
const compositorSessionForks = {}
/**
 * @type {Object.<string, AppEndpoint>}
 */
const appEndpoints = {}
const uuidRegEx = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

/**
 * @param {string} compositorSessionId
 * @return {ChildProcess}
 */
function createCompositorSessionFork (compositorSessionId) {
  let child = compositorSessionForks[compositorSessionId]
  if (child == null) {
    // uncomment next line for debugging support in the child process
    // process.execArgv.push('--inspect-brk=0')

    console.log('Parent creating new child process.')
    const configPath = process.argv[2]
    child = childProcess.fork(path.join(__dirname, 'compositorSessionIndex.js'), configPath == null ? [] : [`${configPath}`])

    const removeChild = () => {
      console.log(`Compositor session child [${child.pid}] exit.`)
      delete compositorSessionForks[compositorSessionId]
    }

    child.on('exit', removeChild)
    child.on('SIGINT', function () {
      global.DEBUG && console.log(`Compositor session child [${child.pid}] received SIGINT.`)
      child.exit()
    })
    child.on('SIGTERM', function () {
      global.DEBUG && console.log(`Compositor session child [${child.pid}] received SIGTERM.`)
      child.exit()
    })

    compositorSessionForks[compositorSessionId] = child
  } else {
    // TODO error out as there already exists a compositor session fork for this compositor session id.
  }
  return child
}

/**
 * @param {IncomingMessage}request
 * @param {Socket}socket
 * @param {Buffer}head
 * @param {string[]}pathElements
 */
function announceCompositor (request, socket, head, pathElements) {
  const compositorSessionId = pathElements.shift() // a UUID

  if (compositorSessionId && uuidRegEx.test(compositorSessionId)) {
    // fork a new process that will handle all things related to this compositor instance.
    let compositorSessionFork = createCompositorSessionFork(compositorSessionId)
    compositorSessionFork.send([{
      headers: request.headers,
      method: request.method,
      pathElements: pathElements,
      intention: 'announce',
      compositorSessionId: compositorSessionId
    }, head], socket)

    appEndpoints.forEach(appEndpoint => {
      appEndpoint.announceCompositors(compositorSessionId)
    })
    // TODO listen for compositor destruction & send a denounce to app endpoints
  } else {
    socket.destroy(`Expected valid UUID in path for 'announceCompositor' intention, instead got: '${compositorSessionId}'.`)
  }
}

/**
 * @param {IncomingMessage}request
 * @param {Socket}socket
 * @param {Buffer}head
 * @param {string[]}pathElements
 */
function announceAppEndpointDaemon (request, socket, head, pathElements) {
  const appEndpointId = pathElements.shift() // a UUID
  if (appEndpointId && uuidRegEx.test(appEndpointId)) {
    appEndpointWebSocketServer.handleUpgrade(request, socket, head, (ws) => {
      console.log(`AppEndpointId ${appEndpointId} web socket is open.`)

      const appEndpoint = AppEndpoint.create(ws)
      appEndpoints[appEndpointId] = appEndpoint
      appEndpoint.onDestroy().then(() => {
        delete appEndpoints.endpointId
      })

      appEndpoint.announceCompositors(Object.keys(compositorSessionForks))
    })

  } else {
    socket.destroy(`Expected valid UUID in path for 'announceAppEndpoint' intention, instead got: '${appEndpointId}'.`)
  }
}

/**
 * @param {IncomingMessage}request
 * @param {Socket}socket
 * @param {Buffer}head
 * @param {string[]}pathElements
 */
function pairAppEndpoint (request, socket, head, pathElements) {
  const endpointSessionId = pathElements.shift() // a UUID
  const compositorSessionId = pathElements.shift() // a UUID

  if (endpointSessionId && uuidRegEx.test(compositorSessionId) &&
    compositorSessionId && uuidRegEx.test(compositorSessionId)) {
    const compositorSessionFork = compositorSessionForks[compositorSessionId]
    if (compositorSessionFork) {
      compositorSessionFork.send([{
        headers: request.headers,
        method: request.method,
        intention: 'pair',
        endpointSessionId: endpointSessionId
      }, head], socket)
    } else {
      socket.destroy('Compositor session id does not resolve to a valid compositor session.')
    }
  } else {
    socket.destroy(`Expected valid UUIDs in path for 'pairAppEndpoint' intention, instead got endpoint session id: '${endpointSessionId} and compositor session id: ${compositorSessionId}'.`)
  }
}

/**
 * @param {IncomingMessage}request
 * @param {Socket}socket
 * @param {Buffer}head
 */
function handleHttpUpgradeRequest (request, socket, head) {
  console.log('Parent received web socket upgrade request. Delegating to child process.')
  const pathElements = request.url.split('/')
  pathElements.shift() // empty element
  const intention = pathElements.shift()

  const intentationHandler = this[intention]
  if (intentationHandler) { // 'announceAppEndpointDaemon', 'pairAppEndpoint', 'announceCompositor'
    intentationHandler(request, socket, head, pathElements)
  } else {
    socket.destroy(`Unknown intention ${intention}.`)
  }
}

function main () {
  console.log('>>> [web-endpoint] Running in PRODUCTION mode <<<\n')
  express.static.mime.define({'application/wasm': ['wasm']})
  const app = express()
  app.use(express.static(path.join(__dirname, '../../compositor/dist')))

  const server = http.createServer()
  server.on('request', app)
  server.setTimeout(config['http-server']['socket-timeout'])

  server.on('upgrade', handleHttpUpgradeRequest)

  const cleanUp = () => {
    console.log('Parent exit. Cleaning up child processes.')
    Object.values(compositorSessionForks).forEach((child) => {
      console.log(`Parent sending child ${child.pid} SIGKILL`)
      child.disconnect()
      child.kill('SIGKILL')
    })
  }

  process.on('exit', cleanUp)
  process.on('SIGINT', () => {
    console.log('Parent received SIGINT')
    process.exit()
  })
  process.on('SIGTERM', () => {
    console.log('Parent received SIGTERM')
    process.exit()
  })

  server.listen(config['http-server']['port'])
}

main()

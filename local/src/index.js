#!/usr/bin/env node

'use strict'

const express = require('express')
const http = require('http')

const childProcess = require('child_process')
const path = require('path')

const forks = {}

function ensureFork (grSessionId) {
  let child = forks[grSessionId]
  if (child == null) {
    // uncomment next line for debugging support
    // process.execArgv.push('--inspect-brk=0')

    console.log('Remote endpoint detected. Starting new shim-compositor.')
    child = childProcess.fork(path.join(__dirname, 'forkIndex.js'))

    const removeChild = () => {
      console.log('child exit')
      delete forks[grSessionId]
    }

    child.on('exit', removeChild)
    child.on('SIGINT', function () {
      console.log('child received SIGINT')
      child.exit()
    })
    child.on('SIGTERM', function () {
      console.log('child received SIGTERM')
      child.exit()
    })

    forks[grSessionId] = child
  }
  return child
}

function main () {
  process.on('uncaughtException', (error) => {
    console.error(error)
  })

  express.static.mime.define({'application/wasm': ['wasm']})
  const app = express()
  app.use(express.static(path.join(__dirname, '../../browser/public')))

  const server = http.createServer()
  server.on('request', app)

  server.on('upgrade', (request, socket, head) => {
    let child = ensureFork(request.url.substring(1))
    child.send([{
      headers: request.headers,
      method: request.method
    }, head], socket)
  })

  const cleanUp = () => {
    console.log('parent exit')
    for (const grSessionId in forks) {
      const child = forks[grSessionId]
      if (child != null) {
        console.log('sending child SIGKILL')
        child.disconnect()
        child.kill('SIGKILL')
      }
    }
  }

  process.on('exit', cleanUp)
  process.on('SIGINT', () => {
    console.log('parent received SIGINT')
    process.exit()
  })
  process.on('SIGTERM', () => {
    console.log('parent received SIGTERM')
    process.exit()
  })

  server.listen(8080)
}

main()

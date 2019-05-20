'use strict'

const path = require('path')

const entryFile = path.resolve(__dirname, '../src/index.js')

/**
 * @return {{output: {path: string, filename: string, publicPath: string}, entry: string[]}}
 */
const commonConfig = () => {
  return {
    entry: [entryFile],
    output: {
      // put build output somewhere where the compositor can find it.
      path: path.resolve(__dirname, `../../../compositor/public/store/simple-web-shm/`),
      publicPath: '/',
      filename: 'app.js'
    }
  }
}

module.exports = commonConfig

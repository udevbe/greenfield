'use strict'

const path = require('path')

const entryFile = path.resolve(__dirname, '../src/index.js')

/**
 * @param {string}appBundle
 * @return {{output: {path: string, filename: string, publicPath: string}, entry: string[]}}
 */
const commonConfig = (appBundle) => {
  return {
    entry: [entryFile],
    output: {
      // put build output somewhere where the compositor can find it.
      path: path.resolve(__dirname, `../../../compositor/web/public/clients/`),
      publicPath: '/',
      filename: appBundle
    }
  }
}

module.exports = commonConfig

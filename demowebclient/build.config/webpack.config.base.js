'use strict'

const path = require('path')

const entryFile = path.resolve(__dirname, '../src/index.js')

/**
 * @param {string}appBundle
 * @param {string}buildDir
 * @return {{entry: string, output: {path: string, filename: string}, plugins: *[]}}
 */
const commonConfig = (appBundle, buildDir) => {
  return {
    entry: [entryFile],
    output: {
      path: path.resolve(__dirname, `../${buildDir}`),
      publicPath: '/',
      filename: appBundle
    }
  }
}

module.exports = commonConfig

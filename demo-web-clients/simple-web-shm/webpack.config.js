'use strict'

const path = require('path')

const entryFile = path.resolve(__dirname, './src/index.js')

const commonConfig = () => {
  return {
    entry: [entryFile],
    output: {
      path: path.resolve(__dirname, `./build/`),
      publicPath: '/',
      filename: 'app.js'
    }
  }
}

module.exports = commonConfig

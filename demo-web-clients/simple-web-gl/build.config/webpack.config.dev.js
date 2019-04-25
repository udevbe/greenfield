'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const appBundle = 'simple.web.gl.js'

const base = baseConfig(appBundle)
const dev = {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(true)
    })
  ]
}

module.exports = merge(base, dev)

'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const appBundle = 'simple.web.shm.js'
const buildDir = 'dev'

const base = baseConfig(appBundle, buildDir)
const dev = {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(true)
    })
  ]
}

module.exports = merge(base, dev)

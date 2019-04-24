'use strict'

const path = require('path')

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const appBundle = 'app.js'
const buildDir = 'dev'

const base = baseConfig(appBundle, buildDir, true)
const dev = {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(true)
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, '../dev'),
    hot: true,
    open: true
  }
}

module.exports = merge(base, dev)

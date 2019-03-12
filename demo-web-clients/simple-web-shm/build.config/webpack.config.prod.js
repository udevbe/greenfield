const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')

const appBundle = 'simple.web.shm.js'

const base = baseConfig(appBundle)
const prod = {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(false)
    })
  ]
}

module.exports = merge(base, prod)

const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')
const CompressionPlugin = require('compression-webpack-plugin')

const base = baseConfig()
const prod = {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(false)
    }),
    new CompressionPlugin({
      deleteOriginalAssets: true
    })
  ]
}

module.exports = merge(base, prod)

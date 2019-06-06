const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.config.base')

const appBundle = 'app.min.js'
const buildDir = 'dist'

const base = baseConfig(appBundle, buildDir, false)
const prod = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(false)
    }),
    new CompressionPlugin({
      deleteOriginalAssets: true
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        libraries: {
          name: 'libraries',
          chunks: 'all',
          test: /node_modules/
        }
      }
    }
  }
}

module.exports = merge(base, prod)

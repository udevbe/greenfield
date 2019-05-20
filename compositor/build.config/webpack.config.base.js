'use strict'

const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlIndex = 'index.html'

const entryFile = path.resolve(__dirname, '../src/index.js')
const keymapsDir = path.resolve(__dirname, '../public/keymaps')
const storeDir = path.resolve(__dirname, '../public/store')
const rootFiles = path.resolve(__dirname, '../public/*.*')

/**
 * @param {string}appBundle
 * @param {string}buildDir
 * @param {boolean}debug
 * @return *
 */
const commonConfig = (appBundle, buildDir, debug) => {
  return {
    entry: [entryFile],
    output: {
      path: path.resolve(__dirname, `../${buildDir}`),
      publicPath: '/',
      filename: appBundle,
      chunkFilename: '[name].js'
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: keymapsDir, to: 'keymaps' },
        { from: storeDir, to: 'store' },
        { from: rootFiles, to: '.', flatten: true }
      ]),
      new HtmlWebpackPlugin({
        file: htmlIndex,
        title: 'Greenfield',
        meta: {
          viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no',
          Description: 'A cloud desktop environment. Run Linux applications remotely from physical different hosts or run web applications directly inside your browser.'
        },
        favicon: path.resolve(__dirname, `../public/favicon.ico`),
        minify: debug ? false : {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          html5: true,
          minifyCSS: true,
          removeComments: true,
          removeEmptyAttributes: true
        }
      })
    ],
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(jsx)$/,
          resolve: { extensions: ['.js', '.jsx'] },
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  }
}

module.exports = commonConfig

'use strict'

const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlTemplate = 'index.template.html'
const htmlIndex = 'index.html'

const commonConfig = (appBundle, buildDir, debug) => {
  return {
    entry: './browser/src/index.js',
    output: {
      path: path.resolve(__dirname, `../${buildDir}`),
      filename: appBundle
    },
    plugins: [
      new CopyWebpackPlugin([
        {from: 'browser/public/assets', to: 'assets'},
        {from: 'browser/public/style', to: 'style'},
        {from: 'browser/public/keymaps', to: 'keymaps'},
        {from: 'browser/public/*.*', to: '.', flatten: true, ignore: [htmlTemplate]}
      ]),
      new HtmlWebpackPlugin({
        template: `browser/public/${htmlTemplate}`,
        file: htmlIndex,
        app: appBundle,
        minify: debug ? false : {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          html5: true,
          minifyCSS: true,
          removeComments: true,
          removeEmptyAttributes: true
        }
      })
    ]
  }
}

module.exports = commonConfig

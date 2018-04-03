'use strict'

const path = require('path')

// const ClosureCompilerPlugin = require('webpack-closure-compiler')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const htmlTemplate = 'index.template.html'
const htmlIndex = 'index.html'

const appBundle = 'browser.bundle.js'
const buildDir = 'dist'

module.exports = {
  mode: 'none',
  entry: './browser/src/index.js',
  output: {
    path: path.resolve(__dirname, `../${buildDir}`),
    filename: appBundle
  },
  plugins: [
    // enable if you want a minimized build.
    //   new ClosureCompilerPlugin({
    //     compiler: {
    //       create_source_map: true,
    //       language_in: 'ECMASCRIPT6_STRICT',
    //       language_out: 'ECMASCRIPT6_STRICT',
    //       compilation_level: 'ADVANCED'
    //     }
    //   })

    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '..')
    }),
    new CopyWebpackPlugin([
      {from: 'browser/public/assets', to: 'assets'},
      {from: 'browser/public/style', to: 'style'},
      {from: 'browser/public/keymaps', to: 'keymaps'},
      {from: 'browser/public/*.*', to: '.', flatten: true, ignore: [htmlTemplate]}
    ]),
    new HtmlWebpackPlugin({
      template: `browser/public/${htmlTemplate}`,
      file: htmlIndex,
      app: appBundle
    })
  ]
}

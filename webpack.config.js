const path = require('path')
// const ClosureCompilerPlugin = require('webpack-closure-compiler')

module.exports = {
  mode: 'none',
  entry: './browser/src/index.js',
  output: {
    path: path.resolve(__dirname, 'browser/public'),
    filename: 'browser.bundle.js'
  }
  // enable if you want a minimized build.
  // , plugins: [
  //   new ClosureCompilerPlugin({
  //     compiler: {
  //       create_source_map: true,
  //       language_in: 'ECMASCRIPT6_STRICT',
  //       language_out: 'ECMASCRIPT6_STRICT',
  //       compilation_level: 'ADVANCED'
  //     }
  //   })
  // ]
}

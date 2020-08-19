const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.ts'
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Greenfield Compositor Demo'
    }),
    new CopyPlugin({ patterns: [{ from: 'public' }] }),
    // apply this plugin only to .ts files - the rest is taken care of
    new webpack.SourceMapDevToolPlugin({
      filename: null,
      test: /\.ts($|\?)/i
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      // Handle TypeScript
      {
        test: /\.(ts?)$/,
        use: 'ts-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.(wasm\.asset)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[contenthash].wasm'
            }
          }
        ]
      },
      {
        test: /\.(data\.asset)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  }
}

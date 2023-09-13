const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const outputPath = path.resolve(__dirname, 'dist')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.ts',
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Greenfield Compositor Demo',
    }),
    // new CopyPlugin({ patterns: [{ from: 'public' }] }),
    // apply this plugin only to .ts files - the rest is taken care of
    new webpack.SourceMapDevToolPlugin({
      filename: null,
      test: /\.ts($|\?)/i,
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: outputPath,
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
  },
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: 'worker-loader',
        options: { filename: '[name].[contenthash].js' },
      },
      // Handle TypeScript
      {
        test: /\.(ts?)$/,
        use: [
          {
            loader: 'ts-loader',
            // options: {
            //   configFile: './demo-compositor/tsconfig.json',
            // },
          },
        ],
        exclude: [/node_modules/],
      },
      // Handle png images
      {
        test: /\.(png)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      // Handle web assembly
      {
        test: /\.(wasm\.asset)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[contenthash].wasm',
            },
          },
        ],
      },
      // Handle generic binary data files
      {
        test: /\.(data\.asset)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      // Handle sources
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
}

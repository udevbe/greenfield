const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const outputPath = path.resolve(__dirname, 'dist')

module.exports = {
  mode: 'development',
  entry: {
    app: './demo-compositor/src/index.ts',
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Greenfield Compositor Demo',
    }),
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
    static: './dist',
  },
  module: {
    rules: [
      // Handle TypeScript
      {
        test: /\.(ts?)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: __dirname + '/tsconfig.json',
              logLevel: 'info',
            },
          },
        ],
        exclude: [/node_modules/],
      },
      // Handle png images
      {
        test: /\.(png)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
        type: 'javascript/auto',
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

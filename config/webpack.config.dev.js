const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.js');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const getIPAddress = () => {
  const interfaces = os.networkInterfaces();
  return interfaces['以太网'] && interfaces['以太网'][1].address;
};

const devConfig = {
  mode: 'development',
  entry: path.join(__dirname, '../src/page/index.tsx'),
  output: {
    path: path.join(__dirname, '../dev/'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'happypack/loader?id=css',
      },
      {
        test: /\.scss$/,
        use: 'happypack/loader?id=scss',
      },
    ],
  },
  devServer: {
    hot: true,
    host: '0.0.0.0',
    contentBase: path.join(__dirname, '../dev/'),
    compress: true,
    port: 3001,
    historyApiFallback: true, // 所有的404都连接到index.html
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new HappyPack({
      id: 'css',
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
          },
        },
        'postcss-loader',
      ],
      threadPool: happyThreadPool,
    }),
    new HappyPack({
      id: 'scss',
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
          },
        },
        'postcss-loader',
        'sass-loader',
      ],
      threadPool: happyThreadPool,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../src/template.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: '"development"',
    }),
  ],
};

module.exports = merge(baseConfig, devConfig);

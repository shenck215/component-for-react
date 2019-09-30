const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  resolve: {
    extensions: [
      ".jsx",
      ".js",
      ".css",
      ".scss",
      ".json",
      ".gif",
      ".png",
      ".jpg",
      ".html"
    ],
    alias: {
      "@pages": path.join(__dirname,'../src/page'),
      "@components": path.join(__dirname,'../src/components'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "happypack/loader?id=jsx",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: [{
          loader: "url-loader",
          options: {
            publicPath: "images/",
            outputPath: "images/",
            limit: 1 * 1024
          }
        }],
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name]-[hash:5].min.[ext]",
              limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
              publicPath: "fonts/",
              outputPath: "fonts/"
            }
          }
        ],
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'jsx',
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
    }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
  ]
};

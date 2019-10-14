const path = require("path");
const webpack = require("webpack");
const HappyPack = require("happypack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const tsImportPluginFactory = require('ts-import-plugin')
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  resolve: {
    extensions: [
      ".tsx",
      ".ts",
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
      'react-dom': '@hot-loader/react-dom'
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)|(jsx?)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true,
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [
                  tsImportPluginFactory({
                    libraryName: "antd",
                    libraryDirectory: "es",
                    camel2DashComponentName: false, 
                    camel2UnderlineComponentName: false, 
                    style: 'css', 
                  })
                ]
              }),
              compilerOptions: {
                module: "es2015"
              },
              happyPackMode: true,
              configFile: path.join(__dirname, "../tsconfig.json")
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: [
          {
            loader: "url-loader",
            options: {
              publicPath: "images/",
              outputPath: "images/",
              limit: 1 * 1024
            }
          }
        ]
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
        ]
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.join(__dirname, "../tsconfig.json")
    }),
    new webpack.ProvidePlugin({
      React: "react"
    })
  ]
};

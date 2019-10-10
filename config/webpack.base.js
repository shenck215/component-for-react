const path = require("path");
const webpack = require("webpack");
const HappyPack = require("happypack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
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
      "@pages": path.join(__dirname, "../src/page"),
      "@components": path.join(__dirname, "../src/components")
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)|(jsx?)$/,
        use: ["happypack/loader?id=tsx"],
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
    new HappyPack({
      id: "tsx",
      use: [
        {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({
              before: [
                tsImportPluginFactory({
                  libraryName: "antd",
                  libraryDirectory: "lib",
                  style: "css"
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
      threadPool: happyThreadPool
    }),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.join(__dirname, "../tsconfig.json")
    }),
    new webpack.ProvidePlugin({
      React: "react"
    })
  ]
};

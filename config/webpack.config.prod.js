const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HappyPack = require('happypack')
const os = require('os');
const { name } = require('../package.json')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const dirs = [
  path.join(__dirname, "../dist"),
  path.join(__dirname, "../es"),
  path.join(__dirname, "../lib")
]
dirs.forEach(item => {
  const files = fs.readdirSync(item)
  console.log(files)
})
// fs.access(path.join(__dirname, "../dist/main.css"), err => {
//   if(!err){
//     fs.unlinkSync(path.join(__dirname, "../dist/main.css"))
//   }
// })

let path=p.join(__dirname,"./test2");
deleteFolder(path);
function deleteFolder(path) {
    let files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }

const prodConfig = {
  mode: "production",
  entry: path.join(__dirname, "../src/components/index.js"),
  output: {
    library: name,
    libraryTarget: "umd",
    filename: "[name].min.js",
    umdNamedDefine: true, // 是否将模块名称作为 AMD 输出的命名空间
    path: path.join(__dirname, "../dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'happypack/loader?id=css'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'happypack/loader?id=scss'
        ]
      }
    ]
  },
  devtool: "cheap-module-source-map",
  plugins: [
    new HappyPack({
      id: 'css',
      loaders: [
        // "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 2,
          }
        },
        "postcss-loader"
      ],
      threadPool: happyThreadPool,
    }),
    new HappyPack({
      id: 'scss',
      loaders: [
        // "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 2,
          }
        },
        "postcss-loader",
        "sass-loader",
      ],
      threadPool: happyThreadPool,
    }),
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      __DEBUG__: false,
    }),
    // new CleanWebpackPlugin(), // 默认清除output.path下生成的目录
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      chunkFilename: '[id].min.css'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react"
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom"
    }
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: false
          },
        }
      }),
      new OptimizeCSSAssetsPlugin({
        // 压缩css  与 MiniCssExtractPlugin 配合使用
        cssProcessor: require("cssnano"),
        cssProcessorOptions: { discardComments: { removeAll: true } }, // 移除所有注释
        canPrint: true // 是否向控制台打印消息
      })
    ],
    noEmitOnErrors: true,
    splitChunks: {
      chunks: "all" // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
    }
  }
};

module.exports = merge(baseConfig, prodConfig);

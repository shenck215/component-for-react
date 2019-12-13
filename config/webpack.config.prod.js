const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

/** 每次打包前要清空的文件夹 */
const dirs = [path.join(__dirname, '../dist'), path.join(__dirname, '../es'), path.join(__dirname, '../lib')];

/** 清空文件夹方法 */
const deleteFolder = (path) => {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      const curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

dirs.forEach((p) => {
  deleteFolder(p);
});

const prodConfig = {
  mode: 'production',
  entry: path.join(__dirname, '../src/components/index.ts'),
  output: {
    library: 'xbzoom',
    libraryTarget: 'umd',
    filename: 'xbzoom.min.js',
    umdNamedDefine: true, // 是否将模块名称作为 AMD 输出的命名空间
    path: path.join(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=css'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=scss'],
      },
    ],
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new HappyPack({
      id: 'css',
      use: [
        // "style-loader",
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
        // "style-loader",
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
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEBUG__: false,
    }),
    // new CleanWebpackPlugin(), // 默认清除output.path下生成的目录
    new MiniCssExtractPlugin({
      filename: 'xbzoom.min.css',
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    dayjs: {
      root: 'dayjs',
      commonjs2: 'dayjs',
      commonjs: 'dayjs',
      amd: 'dayjs',
    },
    classnames: {
      root: 'classnames',
      commonjs2: 'classnames',
      commonjs: 'classnames',
      amd: 'classnames',
    },
    omit: {
      root: 'omit',
      commonjs2: 'omit',
      commonjs: 'omit',
      amd: 'omit',
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs2: 'prop-types',
      commonjs: 'prop-types',
      amd: 'prop-types',
    },
    'react-lifecycles-compat': {
      root: 'react-lifecycles-compat',
      commonjs2: 'react-lifecycles-compat',
      commonjs: 'react-lifecycles-compat',
      amd: 'react-lifecycles-compat',
    },
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true, // 开启缓存
        parallel: true, // 支持多进程
        sourceMap: true,
        extractComments: true,
      }),
      new OptimizeCSSAssetsPlugin({
        // 压缩css  与 MiniCssExtractPlugin 配合使用
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } }, // 移除所有注释
        canPrint: true, // 是否向控制台打印消息
      }),
    ],
    noEmitOnErrors: true,
    // splitChunks: {
    //   chunks: "all" // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
    // }
  },
};

module.exports = merge(baseConfig, prodConfig);

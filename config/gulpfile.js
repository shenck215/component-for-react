/**
 * @name gulpfile.js
 * @description 打包项目css依赖
 */
const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const size = require('gulp-filesize');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');

const browserList = [
  "last 2 versions",
  "Android >= 4.4",
  "Firefox ESR",
  "not ie < 9",
  "ff >= 30",
  "chrome >= 34",
  "safari >= 6",
  "opera >= 12.1",
  "ios >= 6"
];

const DIR = {
  // 输入目录
  scss: path.resolve(__dirname, '../src/components/**/*.scss'),
  buildSrc: path.resolve(__dirname, '../src/components/**/style/*.scss'),
  style: path.resolve(__dirname, '../src/components/**/style/index.ts'),
  
  // 输出目录
  lib: path.resolve(__dirname, '../lib'),
  es: path.resolve(__dirname, '../es'),
  dist: path.resolve(__dirname, '../dist')
};

const tsProjectForCopyIndexScssLib = ts.createProject('../tsconfig.json')
const tsProjectForCopyIndexScssEs = ts.createProject('../tsconfig.json')
const tsProjectForCreateCssLib = ts.createProject('../tsconfig.json')
const tsProjectForCreateCssEs = ts.createProject('../tsconfig.json')

// 拷贝 scss 文件
gulp.task('copyScss', () => {
  return gulp
    .src(DIR.scss)
    .pipe(gulp.dest(DIR.lib))
    .pipe(gulp.dest(DIR.es));
});

// 对 scss 进行编译后拷贝
gulp.task('copyCss', () => {
  return gulp
    .src(DIR.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({ overrideBrowserslist: browserList }))
    .pipe(size())
    .pipe(cssnano())
    .pipe(gulp.dest(DIR.lib))
    .pipe(gulp.dest(DIR.es));
});

// 编译style/index.ts并拷贝到lib
gulp.task('copyIndexScssLib', () => {
  return gulp
  .src(DIR.style)
  .pipe(tsProjectForCopyIndexScssLib())
  .js
  .pipe(babel({ 
    presets: [
      [
        "@babel/preset-env",
        {
          modules: 'commonjs'
        }
      ]
    ] 
  }))
  .pipe(gulp.dest(DIR.lib))
});

// 编译style/index.ts并拷贝到es
gulp.task('copyIndexScssEs', () => {
  return gulp
  .src(DIR.style)
  .pipe(tsProjectForCopyIndexScssEs())
  .js
  .pipe(babel({ 
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false
        }
      ]
    ] 
  }))
  .pipe(gulp.dest(DIR.es))
});

// 生成style/css.js到lib
gulp.task('createCssLib', () => {
  return gulp
    .src(DIR.style)
    .pipe(tsProjectForCreateCssLib())
    .js
    .pipe(replace(/\.scss/, '.css'))
    .pipe(rename({ basename: 'css' }))
    .pipe(babel({ 
      presets: [
        [
          "@babel/preset-env",
          {
            modules: 'commonjs'
          }
        ]
      ] 
    }))
    .pipe(gulp.dest(DIR.lib))
});

// 生成style/css.js到es
gulp.task('createCssEs', () => {
  return gulp
    .src(DIR.style)
    .pipe(tsProjectForCreateCssEs())
    .js
    .pipe(replace(/\.scss/, '.css'))
    .pipe(rename({ basename: 'css' }))
    .pipe(babel({ 
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false
          }
        ]
      ] 
    }))
    .pipe(gulp.dest(DIR.es));
});

// 编译打包所有组件的样式至 dist 目录
gulp.task('dist', () => {
  return gulp
    .src(DIR.buildSrc)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({ overrideBrowserslist: browserList }))
    .pipe(concat('main.css'))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))
    .pipe(sourcemaps.write())
    .pipe(rename('main.css.map'))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))
    .pipe(cssnano())
    .pipe(concat('main.min.css'))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))
    .pipe(sourcemaps.write())
    .pipe(rename('main.min.css.map'))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist));
});

gulp.task('default', gulp.parallel(
  'dist',
  'copyCss',
  'copyScss',
  'copyIndexScssLib',
  'copyIndexScssEs',
  'createCssLib',
  'createCssEs',
));
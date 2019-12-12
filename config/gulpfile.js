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
  'last 2 versions',
  'Android >= 4.4',
  'Firefox ESR',
  'not ie < 9',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 12.1',
  'ios >= 6',
];

const DIR = {
  // 输入目录
  assets: path.resolve(__dirname, '../src/components/assets/**/*'),
  scss: path.resolve(__dirname, '../src/components/**/*.scss'),
  build: path.resolve(__dirname, '../src/components/**/style/*.scss'),
  style: path.resolve(__dirname, '../src/components/style/index.scss'),
  styleTS: path.resolve(__dirname, '../src/components/**/style/index.ts'),
  styleLibJS: path.resolve(__dirname, '../lib/**/style/index.js'),
  styleEsJS: path.resolve(__dirname, '../es/**/style/index.js'),

  // 输出目录
  lib: path.resolve(__dirname, '../lib'),
  libAssets: path.resolve(__dirname, '../lib/assets'),
  es: path.resolve(__dirname, '../es'),
  esAssets: path.resolve(__dirname, '../es/assets'),
  dist: path.resolve(__dirname, '../dist'),
};

const tsLib = ts.createProject('../tsconfig.json');
const tsEs = ts.createProject('../tsconfig.json');

/** 拷贝assets */
gulp.task('copyAssets', () => {
  return gulp
    .src(DIR.assets)
    .pipe(gulp.dest(DIR.libAssets))
    .pipe(gulp.dest(DIR.esAssets));
});

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
    .src(DIR.styleTS)
    .pipe(tsLib())
    .js.pipe(
      babel({
        presets: [
          [
            '@babel/preset-env',
            {
              modules: 'commonjs',
            },
          ],
        ],
      })
    )
    .pipe(gulp.dest(DIR.lib));
});

// 编译style/index.ts并拷贝到es
gulp.task('copyIndexScssEs', () => {
  return gulp
    .src(DIR.styleTS)
    .pipe(tsEs())
    .js.pipe(
      babel({
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
            },
          ],
        ],
      })
    )
    .pipe(gulp.dest(DIR.es));
});

// 生成style/css.js到lib
gulp.task('createCssLib', () => {
  return gulp
    .src(DIR.styleLibJS)
    .pipe(replace(/\.scss/g, '.css'))
    .pipe(rename({ basename: 'css' }))
    .pipe(gulp.dest(DIR.lib));
});

// 生成style/css.es
gulp.task('createCssEs', () => {
  return gulp
    .src(DIR.styleEsJS)
    .pipe(replace(/\.scss/g, '.css'))
    .pipe(rename({ basename: 'css' }))
    .pipe(gulp.dest(DIR.es));
});

// 编译打包所有组件的样式至 dist 目录
gulp.task('dist', () => {
  return gulp
    .src([DIR.style, DIR.build])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({ overrideBrowserslist: browserList }))
    .pipe(concat('xbzoom.css'))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))
    .pipe(sourcemaps.write())
    .pipe(rename('xbzoom.css.map'))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))
    .pipe(cssnano())
    .pipe(concat('xbzoom.min.css'))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist))
    .pipe(sourcemaps.write())
    .pipe(rename('xbzoom.min.css.map'))
    .pipe(size())
    .pipe(gulp.dest(DIR.dist));
});

gulp.task('buildCss', gulp.parallel('dist', 'copyCss', 'copyScss', 'copyIndexScssLib', 'copyIndexScssEs'));

gulp.task('buildCssJs', gulp.parallel('createCssLib', 'createCssEs'));

gulp.task('copy', gulp.parallel('copyAssets'));

gulp.task('default', gulp.parallel('buildCss', 'buildCssJs', 'copy'));

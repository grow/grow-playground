require('es6-promise').polyfill();
require('gulp-typescript').createProject('tsconfig.json')

const autoprefixer = require('gulp-autoprefixer');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const webpack = require('webpack');
const webpackDevConfig = require('./webpack.config.js');
const webpackProdConfig = require('./webpack.prod.config.js');
const webpackStream = require('webpack-stream');

const SASS_SOURCE = [
  './source/sass/*.sass',
  './source/sass/*.scss',
  './source/sass/**/*.sass',
  './source/sass/**/*.scss',
];

const TS_SOURCE = [
  './source/js/*.ts',
  './source/js/**/*.ts',
];

gulp.task('sass', () => {
  return gulp.src(SASS_SOURCE)
      .pipe(sass({
        outputStyle: 'compressed',
        includePaths: [
          './node_modules/',
        ],
      }))
      .on('error', handleSassError)
      .pipe(rename(function(path) {
        path.basename += '.min';
      }))
      .pipe(autoprefixer())
      .pipe(gulp.dest('./dist/css/'));
});

gulp.task('ts-dev', () => {
  return gulp.src(TS_SOURCE)
      .pipe(webpackStream(webpackDevConfig, webpack, handleTsOutput))
      .pipe(gulp.dest('./dist/js/'));
});

gulp.task('ts-prod', () => {
  return gulp.src('./source/js/*.ts')
      .pipe(webpackStream(webpackProdConfig, webpack))
      .pipe(gulp.dest('./dist/js/'));
});

gulp.task('watch', () => {
  gulp.watch(
      SASS_SOURCE,
      {ignoreInitial: false},
      gulp.series('sass'));
  gulp.watch(
      TS_SOURCE,
      {ignoreInitial: false},
      gulp.series('ts-dev'));
});

gulp.task('build', gulp.parallel('sass', 'ts-prod'));
gulp.task('default', gulp.series('watch'));

var handleSassError = function(error) {
  sass.logError.call(this, error);
  notify.logLevel(0);
  notify({
    icon: null,
    message: error.messageOriginal,
    sound: false,
    title: 'Error in ./' + error.relativePath,
  }).write(error);
};

var handleTsOutput = function(err, stats) {
  gulpUtil.log(stats.toString({
    colors: gulpUtil.colors.supportsColor,
    hash: false,
    modules: false,
    version: false,
  }));
  if (!stats.hasErrors()) {
    return;
  }
  const error = stats.compilation.errors[0];
  notify.logLevel(0);
  notify({
    icon: null,
    // Strip ANSI color codes from output.
    message: error.message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''),
    sound: false,
    title: 'Error in ' + error.module.id,
  }).write(error);
};

/* jshint esversion: 6 */
const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const jsdoc = require('gulp-jsdoc3');
const sizereport = require('gulp-sizereport');
const phantom = require('gulp-mocha-phantomJS');
const docConf = require('./jsdoc.json');
const package = require('./package.json');
const modules = require('./modules.json');

gulp.task('dist', function () {
  return gulp.src(modules)
    .pipe(concat(`jul${package.version}.js`))
    .pipe(minify())
    .pipe(sizereport({ gzip: true, '*': { 'maxMinifiedGzippedSize': 5000 } }))
    .pipe(gulp.dest('dist'));
});

gulp.task('doc', ['dist'], function () {
  return gulp.src([`dist/jul${package.version}.js`,'README.md'], { read: false })
    .pipe(jsdoc(docConf));
});

gulp.task('test', ['dist'], function () {
  return gulp.src('./test/index.html', { read: false })
    .pipe(phantom({reporter: 'dot'}));
});

gulp.task('watch', function () {
  gulp.watch('./**/*.js', ['dist', 'doc', 'test']);
});

gulp.task('default', ['dist', 'doc', 'test']);

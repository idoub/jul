/* jshint esversion: 6 */
const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const jsdoc = require('gulp-jsdoc3');
const sizereport = require('gulp-sizereport');
const phantom = require('gulp-mocha-phantomJS');
const docConf = require('./jsdoc.json');
const package = require('./package.json');
let modules = require('./modules.json');

modules = ["src/jul.js","src/addModule.js"].concat(modules);

gulp.task('build', function () {
  return gulp.src(modules)
    .pipe(concat(`jul${package.version}.js`))
    .pipe(minify())
    .pipe(sizereport({ gzip: true, '*': { 'maxMinifiedGzippedSize': 5000 } }))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', ['build'], function () {
  return gulp.src('./test/index.html', { read: false })
    .pipe(phantom({reporter: 'dot'}));
});

gulp.task('doc', ['build', 'test'], function () {
  return gulp.src([`dist/jul${package.version}.js`,'README.md'], { read: false })
    .pipe(jsdoc(docConf));
});

gulp.task('watch', function () {
  gulp.watch('./**/*.js', ['build', 'test', 'doc']);
});

gulp.task('default', ['build', 'test', 'doc']);

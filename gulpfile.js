/* jshint esversion: 6 */
const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const jsdoc = require('gulp-jsdoc3');
const sizereport = require('gulp-sizereport');
const phantom = require('gulp-mocha-phantomJS');
const istanbul = require('gulp-istanbul-report');
const docConf = require('./jsdoc.json');
let modules = require('./modules.json');

const name = `jul${require('./package.json').version}.js`;
modules = ["src/jul.js","src/addModule.js"].concat(modules);

gulp.task('build', function () {
  return gulp.src(modules)
    .pipe(concat(name))
    .pipe(minify())
    .pipe(sizereport({ gzip: true, '*': { 'maxMinifiedGzippedSize': 5000 } }))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', ['build'], function () {
  return gulp.src('./test/index.html', { read: false })
    .pipe(phantom({
      reporter: 'spec',
      phantomjs: {
        hooks: 'mocha-phantomjs-istanbul',
        coverageFile: './dist/coverage.json'
      }
    }))
    .on('finish',function(){
      gulp.src('./dist/coverage.json')
        .pipe(istanbul());
    });
});

gulp.task('deploy', ['build'], function () {
  return gulp.src([`dist/${name}`,'README.md'], { read: false })
    .pipe(jsdoc(docConf));
});

gulp.task('watch', function () {
  return gulp.watch('./**/*.js', ['build', 'test', 'deploy']);
});

gulp.task('default', ['build', 'test', 'deploy']);

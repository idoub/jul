/* jshint esversion: 6 */
const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const jsdoc = require('gulp-jsdoc3');
const sizereport = require('gulp-sizereport');
const mocha = require('gulp-mocha');
const chai = require('chai');

const docConf = require('./jsdoc.json');

const fs = require('fs');
const package = JSON.parse(fs.readFileSync('./package.json'));

const name = `jul${package.version}`;
const modules = [
  'src/jul.js',
  'src/addModule.js',
  'src/add.js',
  'src/create.js',
  'src/each.js',
  'src/exists.js',
  'src/extend.js',
  'src/filter.js',
  'src/hash.js',
  'src/map.js',
  'src/pubsub.js',
  'src/ready.js',
  'src/addClass.js',
  'src/after.js',
  'src/ajax.js',
  'src/append.js',
  'src/attrs.js'
];

gulp.task('dist', function () {
  gulp.src(modules)
    .pipe(concat(`${name}.js`))
    .pipe(minify())
    .pipe(sizereport({ gzip: true, '*': { 'maxMinifiedGzippedSize': 5000 } }))
    .pipe(gulp.dest('dist'));
});

gulp.task('doc', ['dist'], function () {
  gulp.src(['src/**/*.js'], { read: false })
    .pipe(jsdoc(docConf));
});

gulp.task('test', ['dist'], function () {
  gulp.src('./test/**/test.*.js', { read: false })
    .pipe(mocha({ reporter: 'dot',globals: ['chai'], require: ['chai'] }));
});

gulp.task('watch', function () {
  gulp.watch('./**/*.js', ['dist', 'doc', 'test']);
});

gulp.task('default', ['dist', 'doc', 'test']);

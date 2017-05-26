/* jshint esversion: 6 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var jsdoc = require('gulp-jsdoc3');
var mocha = require('gulp-mocha');
var sizereport = require('gulp-sizereport');

var docConf = require('./jsdoc.json');

var fs = require('fs');
var package = JSON.parse(fs.readFileSync('./package.json'));

var name = `jul${package.version}`;
var modules = [
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

gulp.task('dist',function(){
    gulp.src(modules)
        .pipe(concat(`${name}.js`))
        .pipe(minify())
        .pipe(sizereport({gzip:true,'*':{'maxMinifiedGzippedSize':5000}}))
        .pipe(gulp.dest('dist'));
});

gulp.task('doc',['dist'],function(){
    gulp.src(['src/**/*.js'], {read: false})
        .pipe(jsdoc(docConf));
});

gulp.task('test',['dist'],function(){
    gulp.src('test/**/*.js', {read: false})
        .pipe(mocha());
});

gulp.task('watch',function(){
    gulp.watch('./**/*.js',['dist','doc','test']);
});

gulp.task('default',['dist','doc','test']);
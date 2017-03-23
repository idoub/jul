var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var jsdoc = require('gulp-jsdoc3');
var mocha = require('gulp-mocha');
var wait = require('gulp-wait');

var docConf = require('./jsdoc.json');

var fs = require('fs');
var package = JSON.parse(fs.readFileSync('./package.json'));

var name = `jul${package.version}`;
var dest = 'dist';

var modules = [
    'core/jul.js',
    'modules/pubsub.js',
    'modules/ready.js',
    'modules/exists.js',
    'modules/extend.js',
    'modules/each.js',
    'modules/map.js',
    'modules/filter.js',
    'modules/ajax.js',
    'modules/addClass.js',
    'modules/hash.js'
];

gulp.task('dist',function(){
    gulp.src(modules)
        .pipe(concat(`${name}.js`))
        .pipe(minify())
        .pipe(gulp.dest(dest));
});

gulp.task('doc',['dist'],function(){
    gulp.src(['core/**/*.js','modules/**/*.js'], {read: false})
        .pipe(jsdoc(docConf));
});

gulp.task('test',['dist'],function(){
    gulp.src('test/**/*.js', {read: false})
        .pipe(wait(1500))
        .pipe(mocha());
});

gulp.task('watch',function(){
    gulp.watch('./**/*.js',['dist','doc','test']);
});

gulp.task('default',['dist','doc','test']);
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minify = require('gulp-minify');
var fs = require('fs');

var package = JSON.parse(fs.readFileSync('./package.json'));

var name = `jul_${package.version}`;
var dest = 'dist';

gulp.task('default',function(){
    gulp.src(['core/**/*.js','modules/**/*.js'])
        .pipe(concat(`${name}.js`))
        .pipe(gulp.dest(dest))
        .pipe(rename(`${name}.min.js`))
        .pipe(minify())
        .pipe(gulp.dest(dest));
});
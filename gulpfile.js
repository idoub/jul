var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var fs = require('fs');

var package = JSON.parse(fs.readFileSync('./package.json'));

var name = `jul${package.version}`;
var dest = 'dist';

gulp.task('default',function(){
    gulp.src(['core/**/*.js','modules/**/*.js'])
        .pipe(concat(`${name}.js`))
        .pipe(minify())
        .pipe(gulp.dest(dest));
});
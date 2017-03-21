var gulp = require('gulp');
var fs = require('fs');

var package = JSON.parse(fs.readFileSync('./package.json'));

var name = `jul_${package.version}`;
var dest = 'dist';

gulp.task('build',function(){
    gulp.src(['core/**/*.js','modules/**/*.js'])
        .pipe(concat(`${name}.js`))
        .pip(gulp.dest(dest))
        .pipe(rename(`${name}.min.js`))
        .pipe(minify())
        .pip(gulp.dest(dest));
});
/* jshint esversion: 6 */
const gulp = require(`gulp`);
const concat = require(`gulp-concat`);
const minify = require(`gulp-minify`);
const jsdoc = require(`gulp-jsdoc3`);
const sizereport = require(`gulp-sizereport`);
const phantom = require(`gulp-mocha-phantomJS`);

const docConf = require(`./jsdoc.json`);

const fs = require(`fs`);
const package = JSON.parse(fs.readFileSync(`./package.json`));

const name = `jul${package.version}`;
const modules = [
  `src/jul.js`,
  `src/addModule.js`,
  `src/add.js`,
  `src/create.js`,
  `src/each.js`,
  `src/exists.js`,
  `src/extend.js`,
  `src/filter.js`,
  `src/hash.js`,
  `src/map.js`,
  `src/pubsub.js`,
  `src/ready.js`,
  `src/addClass.js`,
  `src/after.js`,
  `src/ajax.js`,
  `src/append.js`,
  `src/attrs.js`
];

gulp.task(`dist`, function () {
  return gulp.src(modules)
    .pipe(concat(`${name}.js`))
    .pipe(minify())
    .pipe(sizereport({ gzip: true, '*': { 'maxMinifiedGzippedSize': 5000 } }))
    .pipe(gulp.dest(`dist`));
});

gulp.task(`doc`, [`dist`], function () {
  return gulp.src([`dist/${name}.js`,`README.md`], { read: false })
    .pipe(jsdoc(docConf));
});

gulp.task(`test`, [`dist`], function () {
  return gulp.src(`./test/index.html`, { read: false })
    .pipe(phantom({reporter: `dot`}));
});

gulp.task(`watch`, function () {
  gulp.watch(`./**/*.js`, [`dist`, `doc`, `test`]);
});

gulp.task(`default`, [`dist`, `doc`, `test`]);

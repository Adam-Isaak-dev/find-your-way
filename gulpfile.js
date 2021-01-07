const { src, dest, series, parallel } =  require('gulp');
const postcss = require ('gulp-postcss');
const cssnano = require ('cssnano');
const autoprefixer = require ('autoprefixer'); 
const sourcemaps = require ('gulp-sourcemaps');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const clean = require('gulp-clean');


function cleanTask() {
  return src('dist/*')
    .pipe(clean())
}

function htmlTask() {
  return src('src/*.html')
    .pipe(dest('dist/'))
}

function cssTask() {
  return src('src/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(concat('all.css'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/css'))
}

function jsTask() {
  return src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/js'))
}

exports.html = htmlTask;
exports.css = cssTask;
exports.js = jsTask;
exports.default = series(cleanTask, htmlTask, parallel(cssTask, jsTask));
exports.build = series(cleanTask, htmlTask, parallel(cssTask, jsTask));
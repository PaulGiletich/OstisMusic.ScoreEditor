var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var concat = require('gulp-concat');
var rjs = require('gulp-requirejs');

gulp.task('less', function () {
    gulp.src('./less/**/*.less')
        .pipe(less())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./build/css/'));
});
//
//gulp.task('rjs', function() {
//    rjs({
//        optimize: true,
//        baseUrl:'js',
//        mainConfigFile: 'js/main.js',
//        out: 'main.js'
//    })
//    .pipe(gulp.dest('./build/js/'));
//});

gulp.task('default', ['less']);
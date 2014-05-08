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

gulp.task('rjs', function() {
    rjs({
        optimize: true,
        name: 'main',
        baseUrl: 'js',
        out: 'main.js',
        shim: {}
    })
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('default', ['less', 'rjs']);
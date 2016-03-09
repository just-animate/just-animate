var gulp = require('gulp');
var del = require('del');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var uglify = require('gulp-uglify');
var webpack = require('webpack-stream');

gulp.task('copy-animations', function () {
    return gulp.src('./src/animations/**/*.json')
        .pipe(gulp.dest('./build/animations/'));
});

gulp.task('build', ['copy-animations'], function () {
    var tsResult = tsProject
        .src()
        .pipe(ts(tsProject));

    return tsResult.js
        .pipe(gulp.dest('build'));
});

gulp.task('just-animate', ['build'], function () {
    return gulp.src('build/just-animate.js')
        .pipe(webpack({
            module: {
                loaders: [
                    { test: /\.json$/, loader: "json" }
                ]
            },
            output: {
                filename: "just-animate.js"
            }
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(notify('just-animate bundled'));
});

gulp.task('just-animate-angular', ['build'], function () {
    return gulp.src('build/just-animate-angular.js')
        .pipe(webpack({
            module: {
                loaders: [
                    { test: /\.json$/, loader: "json" }
                ]
            },
            output: {
                filename: "just-animate-angular.js"
            }
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(notify('just-animate bundled'));
});

gulp.task('clean-min', function () {
    return del([
        './dist/*.min.js'
    ]);
});

gulp.task('dist', ['just-animate', 'just-animate-angular', 'clean-min'], function () {
    return gulp.src('dist/*.js')
        .pipe(uglify({
            mangle: true,
            compress: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['dist'], function () { });
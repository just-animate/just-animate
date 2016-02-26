var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

gulp.task('copy-animations', function () {
  return gulp.src('./src/animations/**/*.json')
    .pipe(gulp.dest('./build/animations/'));
});

gulp.task('build', ['copy-animations'], function () {
  var tsResult = tsProject
    .src()
    .pipe(ts(tsProject));

  return tsResult.js
    .pipe(gulp.dest('build'))
    .pipe(notify('TypeScript compiled'));
});

gulp.task('just-animate', ['build'], function () {
  return browserify({
    entries: [
      './build/just-animate.js'
    ],
  })
    .bundle()
    .pipe(source('just-animate.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(notify('just-animate bundled'));
});

gulp.task('just-animate-angular', ['build'], function () {
  return browserify({
    entries: [
      './build/just-animate-angular.js'
    ],
  })
    .bundle()
    .pipe(source('just-animate-angular.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(notify('just-animate-angular bundled'));
});

gulp.task('default', ['just-animate', 'just-animate-angular'], function () {

});
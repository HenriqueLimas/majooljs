'use strict';

var gulp = require('gulp');
var Karma = require('karma').Server;
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');

var karmaConfig = {
  configFile: __dirname + '/karma.conf.js'
};

gulp.task('jshint', function() {
  return gulp.src(['src/**/*.js', 'gulpfile.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('jscs', function() {
  return gulp.src(['src/**/*.js', 'gulpfile.js'])
    .pipe($.jscs());
});

gulp.task('test:tdd', function(done) {
  new Karma(karmaConfig, done).start();
});

gulp.task('test', function(done) {
  new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('build', function() {
  return gulp.src(['src/majool.js', 'src/module/*.js'])
    .pipe($.concat('majool.js'))
    .pipe($.iife())
    .pipe(gulp.dest('./dist/'))
    .pipe($.uglify())
    .pipe($.concat('majool.min.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('dist', function() {
  return runSequence(
    ['jshint', 'jscs'],
    'clean',
    'build'
  );
});

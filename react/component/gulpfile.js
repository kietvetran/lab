'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require("gulp-jshint");
var connect = require('gulp-connect'); 

var source = require('vinyl-source-stream'); // Used to stream bundle for further handling etc.
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify'); 
var concat = require('gulp-concat');

gulp.task('lint', function() {
  console.log('-> task lint');
  gulp.src('./src/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('html', function () {
  console.log('-> task html');
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});
 
gulp.task('sass', function () {
  console.log('-> task sass');
  gulp.src('./src/sass/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/css/'))
    .pipe(connect.reload());
});

gulp.task('browserify', function() {
  console.log('-> task browserify');
  var bundler = browserify({
    entries: ['./src/script/main.jsx'], // Only need initial file, browserify finds the deps
    transform: [reactify], // We want to convert JSX to normal javascript
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  var watcher = watchify(bundler);
  return watcher.on('update', function () { // When any files update
    var updateStart = Date.now();
    console.log('Updating!');
    watcher.bundle()         // Create new bundle that uses the cache for high performance
    .pipe(source('main.js')) // This is where you add uglifying etc.
    .pipe(gulp.dest('./app/js/'));
    console.log('Updated!', (Date.now() - updateStart) + 'ms');
  }).bundle() // Create the initial bundle when starting the task
    .pipe(source('main.js'))
    .pipe(gulp.dest('./app/js/'));
});

gulp.task('connectDev', function () {
  console.log('-> task connectDev');
  connect.server({
    root: ['app', 'tmp'],
    port: 8000,
    livereload: true
  });
});
 
gulp.task('connectDist', function () {
  console.log('-> task connectDist');
  connect.server({
    root: 'dist',
    port: 8001,
    livereload: true
  });
});
 
gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./src/**/*.scss'], ['sass']);
  gulp.watch(['./src/**/*.jsx'], ['browserify']);
});
 
//gulp.task('default', ['connectDist','connectDev','html','sass','lint','watch']);
//gulp.task('default', ['connectDev','html','sass','lint','browserify','watch']);
//gulp.task('default', ['connectDev','html','sass','lint','watch']);
gulp.task('default', ['connectDev','html','lint','browserify','watch']);

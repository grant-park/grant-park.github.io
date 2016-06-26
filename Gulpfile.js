(function(){
'use strict';
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),  
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    browserify = require('browserify'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    livereload = require('gulp-livereload');

var tasks = {
    styles: function(){
      gulp.src('dev/sass/**/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./prod/css/'))
        .pipe(livereload());
    },
    templates: function(){
      gulp.src('dev/jade/**/*.jade')
        .pipe(jade({}))
        .pipe(gulp.dest('.'))
        .pipe(livereload());
    },
    lintjs: function(){
      return gulp.src(['gulpfile.js','dev/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .on('error', function(){
          console.log("afplay " + file);
          exec("afplay " + file);
        });
    },
    browserify: function(){
      //Mess with for later
      var b = browserify();
      b.add('prod/js/app.js');
      b.bundle().pipe(process.stdout);
    },
    scripts: function(){
      return gulp.src(['dev/js/tabletop.js','dev/js/TabletopProvider.js','dev/js/data.js'])
        .pipe(concat('app.js'))
        .pipe(minify({min:'.js'}))
        .pipe(gulp.dest('prod/js/'))
        .pipe(livereload());
    }
};

// Tasks
gulp.task('styles',tasks.styles);
gulp.task('templates',tasks.templates);
gulp.task('lintjs',tasks.lintjs);
gulp.task('scripts',tasks.scripts);

// Dev > Prod (+ linting)
gulp.task('watch',function() {
  livereload.listen();
  gulp.watch('dev/sass/**/*.scss',['styles']);
  gulp.watch('dev/jade/**/*.jade',['templates']);
  gulp.watch(['gulpfile.js','dev/js/**/*.js'],['lintjs','scripts']);
});
})();

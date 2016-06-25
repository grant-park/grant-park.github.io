(function(){
'use strict';
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),  
    watch = require('gulp-watch'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    browserify = require('browserify');

var tasks = {
    styles: function(){
      gulp.src('sass/**/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('css'));
    },
    minifyCSS: function(){
      return gulp.src('css/**/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./prod/css/'));
    },
    templates: function(){
      gulp.src('jade/**/*.jade')
        .pipe(jade({}))
        .pipe(gulp.dest('.'));
    },
    lintjs: function(){
      return gulp.src(['Gulpfile.js','js/**/*.js'])
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
    }
};

// Tasks
gulp.task('styles',tasks.styles);
gulp.task('minifyCSS',tasks.minifyCSS);
gulp.task('templates',tasks.templates);
gulp.task('lintjs',tasks.lintjs);

// Work from sass, Production from prod/css
gulp.task('watch',function() {
  gulp.watch('sass/**/*.scss',['styles']);
  gulp.watch('css/**/*.css',['minify-css']);
  gulp.watch('jade/**/*.jade',['templates']);
  gulp.watch(['Gulpfile.js','js/**/*.js'],['lintjs']);
});
})();

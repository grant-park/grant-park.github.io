var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),  
    watch = require('gulp-watch'),
    jade = require('gulp-jade');


gulp.task('styles',function() {
  gulp.src('sass/**/*.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('css'));
});

gulp.task('minify-css', function() {
  return gulp.src('css/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./prod/css/'));
});

gulp.task('templates',function(){
  gulp.src('jade/**/*.jade')
    .pipe(jade({}))
    .pipe(gulp.dest('.'))
});

// Work from sass, Production from prod/css
gulp.task('watch',function() {
  gulp.watch('sass/**/*.scss',['styles']);
  gulp.watch('css/**/*.css',['minify-css']);
  gulp.watch('jade/**/*.jade',['templates']);
});

var autoprefixer = require('autoprefixer'),
    gulp         = require('gulp'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass');

gulp.task('styles', function() {
  gulp.src('*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .on('error', function(error) {
      // Prevent errors breaking watch
      console.log(error.toString());
      this.emit('end');
    })
    .pipe(postcss([
      autoprefixer({browsers : ['last 2 versions', 'IE 9']})
    ]))
    .pipe(gulp.dest('.'));
});

gulp.task('default', function() {
  gulp.start('styles');
});

gulp.task('watch', function() {
  gulp.watch('*.scss', ['styles']);
});

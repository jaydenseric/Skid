var autoprefixer = require('autoprefixer'),
    gulp         = require('gulp'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass');

gulp.task('default', function() {
  gulp.src('*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss([
      autoprefixer({browsers : ['> 1% in US', 'IE >= 9']})
    ]))
    .pipe(gulp.dest('.'));
});

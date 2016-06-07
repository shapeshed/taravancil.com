var Promise      = require('es6-promise').Promise;
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename       = require('gulp-rename');
var cssmin       = require('gulp-clean-css');
var minifyHtml   = require('gulp-htmlmin');
var notification = require('gulp-notify');
var exec         = require('child_process').exec;
var plumber      = require('gulp-plumber');

gulp.task('build-scss', function() {
    var onError = function(err) {
        notification.onError({
            title:   "gulp: build-scss",
            message: "<%= error.message %>",
        })(err);
        this.emit('end');
    };

    return gulp.src('src/scss/style.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('static/css/'));
});

gulp.task('minify-html', function() {
    return gulp.src('public/**/*.html')
        .pipe(minifyHtml({collapseWhitespace: true}))
});

gulp.task('hugo-server', function() {
    exec('hugo server', function(stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
  });
});

gulp.task('hugo-build', function() {
    exec('hugo --canonifyURLs=true', function(stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
});

gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', ['build-scss']);
});

gulp.task('default', ['build-scss', 'watch', 'hugo-server']);
gulp.task('build', ['hugo-build', 'minify-html']);

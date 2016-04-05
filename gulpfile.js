
//   SETUP
// ----------

// Include gulp
var gulp = require('gulp'),

// Include plugins
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    shell = require('gulp-shell'),
    gulpSequence = require('gulp-sequence').use(gulp),
    del = require('del'),
    compass = require('gulp-compass'),
    coffee = require('gulp-coffee'),
    gulpif = require('gulp-if'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify');


//   TASKS
// ----------

function swallowError (error) {
  //If you want details of the error in the console
  console.log(error.toString());
  this.emit('end');
}

gulp.task('clear', function (done) {
  cache.clearAll(done);
});

// Styles
gulp.task('styles', function() {
  return gulp.src('sass/app.scss')
    .pipe(compass({
      config_file: './compass-config.rb',
      bundle_exec: 'true',
      css: 'gen/css/',
      sass: 'sass/',
      sourcemap: 'inline',
      image: 'img/',
      comments: false
    }))
    .on('error', swallowError)
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src([
    'js/*.js'
  ])
    .pipe(gulpif(/[.]coffee$/, coffee({bare: true}).on('error', swallowError)))
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest('gen/js'))
    .on('error', swallowError)
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Vendor scripts
gulp.task('vendor-scripts', function() {
  return gulp.src([
    'js/vendor/*.js'
  ])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('gen/js'))
})

// Jekyll

gulp.task('jekyll', shell.task([
  'jekyll serve --watch',
]));

// Cleanup
gulp.task('clean', function() {
    return del(['gen/**/*', '_site/**/*']);
});





//   DEFAULT & WATCH
// --------------------


// Watch files for changes
gulp.task('watch', function() {

  // Watch .scss, .js, image files
  gulp.watch('./sass/**/*.scss', ['styles']);
  gulp.watch(['js/*.js'], ['scripts']);
  gulp.watch(['js/vendor/*.js'], ['vendor-scripts']);
});

gulp.task('default', gulpSequence(
  ['clean', 'clear'],
  ['styles', 'scripts', 'vendor-scripts'],
  ['jekyll', 'watch']
));

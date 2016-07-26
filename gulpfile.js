
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
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass');
    sourcemaps = require('gulp-sourcemaps'),
    svgMin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    rename = require("gulp-rename"),
    imageResize = require('gulp-image-resize');


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
  return gulp.src('sass/v2/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true
    }))
    .on('error', swallowError)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./gen/css'))
    .pipe(gulp.dest('./_site/gen/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// font awesome
gulp.task('fonts', function(){
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('gen/fonts'));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src([
    'js/*.js',
    'coffee/*.coffee'
  ])
    .pipe(gulpif(/[.]coffee$/, coffee({bare: true}).on('error', swallowError)))
    .pipe(concat('main.js'))
    .pipe(browserify().on('error', swallowError))
    .pipe(gulp.dest('gen/js'))
    .on('error', swallowError)
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Vendor scripts
gulp.task('vendor-scripts', function() {
  return gulp.src([
    'js/vendor/*.js',
    'bower_components/waitForImages/dist/jquery.waitforimages.min.js',
    'node_modules/animejs/anime.js'
  ])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('gen/js'))
})

// photo thumbnails

gulp.task("thumbnails", function () {
  gulp.src("./photos/**/*.{jpg,png}")
    .pipe(imageResize({ width : 10 }))
    .pipe(rename(function (path) { path.basename += "-thumbnail"; }))
    .pipe(gulp.dest("./gen/photos/thumb/"));
});

// svg
gulp.task('svg', function(cb) {
  return gulp.src('svg/**/*')

    // add {{ include.class }} to each svg so we can pass a class name w/ jekyll
    .pipe(cheerio({
      parserOptions: { xmlMode: true },
      run: function ($, file) {
        $('svg').attr('class', '{{ include.class }}');
        $('svg').attr('xmlns', '');
      }
    }))

    // now minify svg
    .pipe(svgMin({
      plugins: [{
        removeTitle: true
      }]
    }))

    // have to store svgs in _includes folder if we want to include them via jekyll
    .pipe(gulp.dest('./_includes/svg'))
    .pipe(notify({ message: 'SVG task complete' }));
});

// Jekyll
gulp.task('jekyll', shell.task([
  'jekyll serve --watch --trace',
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
  gulp.watch('./sass/**/*.{scss,sass}', ['styles']);
  gulp.watch(['js/*.js', 'coffee/*.coffee'], ['scripts']);
  gulp.watch(['js/vendor/*.js'], ['vendor-scripts']);
  gulp.watch(['./svg/*.svg'], ['svg']);
  gulp.watch(['./photos/**/*.{jpg,png}'], ['thumbnails']);
});

gulp.task('default', gulpSequence(
  ['clean', 'clear'],
  ['styles', 'scripts', 'vendor-scripts', 'fonts', 'svg', 'thumbnails'],
  ['jekyll', 'watch']
));

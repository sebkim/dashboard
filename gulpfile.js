var gulp = require('gulp');

// var assetsDev = 'assets/';
// var assetsProd = 'src/';
//
// var appDev = 'dev/';
// var appProd = 'app/';

var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');

/* CSS */
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var cssClean = require('gulp-clean-css');
//
/* JS & TS */
var typescript = require('gulp-typescript');

var tsProject = typescript.createProject('tsconfig.json');
var exec = require('child_process').exec;

//
gulp.task('build-css', function () {
    return gulp.src('assets/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(cssClean({compatibility: 'ie8'}))
        .pipe(gulp.dest('src/css/'));
});


gulp.task('build-ts', function() {
    var tsResult = tsProject.src() // instead of gulp.src(...)
        .pipe(typescript(tsProject));
    return tsResult.js.pipe(gulp.dest('app'));
});

gulp.task('minify-js', function() {
  return gulp.src(['app/**/*.js'])
  .pipe(uglify())
  .pipe(gulp.dest('app'))
});
gulp.task('minify-html', function() {
  return gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest(''))
});

// gulp.task('build-ts', function () {
//     return gulp.src('dev/**/*.ts')
//         .pipe(sourcemaps.init())
//         .pipe(typescript(tsProject))
//         .pipe(sourcemaps.write())
//         //.pipe(jsuglify())
//         .pipe(gulp.dest('app/'));
// });
//

gulp.task('watch', function () {
    gulp.watch('dev/' + '**/*.ts', ['build-ts']);
    gulp.watch('assets/' + 'scss/**/*.scss', ['build-css']);
    gulp.watch('app/**/*.js', ['minify-js'])
});

gulp.task('default', ['watch', 'build-ts', 'build-css']);

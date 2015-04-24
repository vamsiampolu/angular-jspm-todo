var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var gulpFilter = require('gulp-filter');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../config');

gulp.task('sass',function(){
	return gulp.src(config.sass.src)
			   .pipe(plumber({errorHandler:notify.onError('<%= error.message %>')}))
			   .pipe(sourcemaps.init())
			   .pipe(sass())
			   .pipe(autoprefixer(config.autoprefixer))
			   .pipe(sourcemaps.write(config.sourcemapPath,{includeContent:false}))
			   .pipe(gulp.dest(config.sass.dest));
});
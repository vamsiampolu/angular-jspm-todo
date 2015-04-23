var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var config = require('../config').jshint;

gulp.task('jshint',function(){
	gulp.src(config.src)
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));
});
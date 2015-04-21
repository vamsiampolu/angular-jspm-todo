var gulp = require('gulp');
var config = require('../config').watch;
gulp.task('watch',['serve'],function(){
	gulp.watch(config.js);
	gulp.watch(config.html);
});
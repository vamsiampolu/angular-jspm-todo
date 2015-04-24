var gulp = require('gulp');
var config = require('../config').watch;
gulp.task('watch',['serve'],function(){
	gulp.watch(config.jshint,['jshint']);
	gulp.watch(config.sass,['scsslint','sass']);
});
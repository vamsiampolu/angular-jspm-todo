var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('../config').bsync;
console.dir(config);
gulp.task('serve',['jshint','scsslint','sass'],function(){
	browserSync(config);
});
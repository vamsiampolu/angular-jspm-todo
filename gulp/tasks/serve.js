var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('../config').bsync;
console.dir(browserSync,config);
gulp.task('serve',function(){
	browserSync(config);
});
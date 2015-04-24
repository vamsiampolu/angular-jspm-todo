var gulp = require('gulp');
var scsslint = require('gulp-scss-lint');
var config   = require('../config').scsslint;

gulp.task('scsslint',function(){
	return gulp.src(config.src)
			   .pipe(scsslint(config.options))
});
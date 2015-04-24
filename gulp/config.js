var src ="./";
var app = 'app'
var config = {
	bsync:{
		server:{
			baseDir:src
		},
		files:[app+'/*.js',src+'index.html',app+'/templates/*.html']
	},
	watch:{
		js:app+'/*.js',
		html:app+'/templates/*.html'
	},
	jshint:{
			src:app+'/*.js'
		},
		sass: {
	  		src:  app + '/scss/**/*.{sass,scss}',
	  		dest: app + '/css/',
	  		sourcemapPath:app + '/css/sourcemaps',
	  options: {
	    noCache: true,
	    compass: false,
	    sourcemap: true,
	  }
	},
	autoprefixer: {
	  browsers: [
	    'last 2 versions',
	    'safari 5',
	    'ie 8',
	    'ie 9',
	    'opera 12.1',
	    'ios 6',
	    'android 4'
	  ],
	  cascade: true
	},
	scsslint: {
	  src: [
	    app + '/scss/**/*.{sass,scss}',
	    ]
	}
};

module.exports=config;
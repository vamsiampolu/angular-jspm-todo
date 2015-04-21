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
	}
};

module.exports=config;
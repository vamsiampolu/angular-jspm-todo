var src ="./";
var app = 'app'
var config = {
	bsync:{
		server:{
			baseDir:src
		},
		files:[app+'/*.js']
	},
	watch:{
		js:app+'/*.js'
	}
};

module.exports=config;
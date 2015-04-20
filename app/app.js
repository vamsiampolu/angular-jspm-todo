var angular = require("angular");
var $ = require('semantic-ui');
var ngsemanticui = require('angular-semantic-ui');
var app = angular.module("app",['angularify.semantic']);
app.controller("HelloCtrl",function($scope){
	$scope.hello = "Hello World";
	$scope.title="CSS Preprocessors";
	$scope.categories = ["Sass","Less","Stylus","CSS"];
});

app.controller("TodoCtrl",function($scope){
	$scope.todos = [{
		task:"Create a controller",
		done:false
	},{
		task:"Reload set task",
		done:false
	}];
});

module.exports = app;
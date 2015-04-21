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
		id:0,
		task:"Create a controller",
		description:"Create a controller for todos.",
		done:false
	},
	{
		id:1,
		task:"Reload set task",
		description:"Ensure that browser-sync is working correctly",
		done:false
	}];
	$scope.clickDone = function clickDone(id){
		console.log("Inside click done");
		console.log($scope.todos[id]);
		$scope.todos[id].done = !$scope.todos[id].done;
	};
});

module.exports = app;
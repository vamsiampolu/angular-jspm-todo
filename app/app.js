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
		done:false
	},
	{
		id:1,
		task:"Reload set task",
		done:false
	}];
	$scope.clickDone = function clickDone(id){
		console.log("Inside click done");
		console.log($scope.todos[id]);
		var todo = $scope.todos[id];
		todo.done = !todo.done;
	};
});

module.exports = app;
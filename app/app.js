var angular = require("angular");
var $ = require('semantic-ui');
var ngsemanticui = require('angular-semantic-ui');
var app = angular.module("app",['angularify.semantic']);
app.controller("HelloCtrl",function($scope){
	$scope.hello = "Hello World";
	$scope.title="CSS Preprocessors";
	$scope.categories = ["Sass","Less","Stylus","CSS"];
});

app.factory("TodoList",function(){
	var instance = {};
	instance.get = function get(){
		var todos = [{
			id:0,
			btnText:'Done',
			task:"Create a controller",
			description:"Create a controller for todos.",
			done:false
		},
		{
			id:1,
			task:"Reload set task",
			btnText:'Done',
			description:"Ensure that browser-sync is working correctly",
			done:false
		}];

		return todos;	
	};
	return instance;
});

app.controller("TodoCtrl",["$scope","TodoList",function($scope,TodoList){
	$scope.todos = TodoList.get();
	$scope.clickDone = function clickDone(id){
		$scope.todos[id].done = !$scope.todos[id].done;
		if($scope.todos[id].done)
			$scope.todos[id].btnText = 'Reinstate';
		else
			$scope.todos[id].btnText = 'Done';
	};
}]);

module.exports = app;
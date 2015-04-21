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
		},
		{
			id:2,
			task:"Create a service",
			btnText:'Done',
			description:'Build a service with CouchDB as the backend and PouchDB on the frontend'
		},{
			id:3,
			task:'Create a directive using an isolate scope for each todo',
			description:'Each Todo is a unique UI component with a specialized card layout,I might as well put it in a directive',
			btnText:'Done'
		}];

		return todos;	
	};
	return instance;
});

app.directive("todoItem",function(){
	var dirDefObj = {
		restrict:'E',
		templateUrl:'app/templates/todo.html',
		scope:{
			todo:'=value'
		},
		controller:function($scope)
		{
			$scope.clickDone = function clickDone(){
				//two tasks (1)toggle the done value on the todo (2) toggle the btnText on the todo
				$scope.todo.done = !$scope.todo.done;
				$scope.todo.btnText = $scope.todo.done?'Reinstate':'Done';
			};
		},
		replace:true
	};
	return dirDefObj;
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
var angular = require("angular");
var $ = require('semantic-ui');
var ngPouchchDB = require('angular-pouchdb');
var ngsemanticui = require('angular-semantic-ui');
var pouchdb = require('pouchdb');
var app = angular.module("app",['angularify.semantic','pouchdb']);

app.controller("HelloCtrl",function($scope){
	$scope.hello = "Hello World";
	$scope.title="CSS Preprocessors";
	$scope.categories = ["Sass","Less","Stylus","CSS"];
});

app.factory("TodoService",function(){
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

app.directive("todoList",["TodoService",function(TodoService){
	var dirDefObj = {
		restrict:'E',
		templateUrl:'app/templates/todo-list.html',
		controller:function($scope)
		{
			$scope.todos = TodoService.get();
		},
		replace:true
	};
	return dirDefObj;
}]);

app.controller("TodoCtrl",["$scope","TodoService",function($scope,TodoList){
	$scope.todos = TodoList.get();
	$scope.clickDone = function clickDone(id){
		$scope.todos[id].done = !$scope.todos[id].done;
		if($scope.todos[id].done)
			$scope.todos[id].btnText = 'Reinstate';
		else
			$scope.todos[id].btnText = 'Done';
	};
}]);

app.factory('SaveTodo',['$log','pouchDB','$window',function($log,pouchDB,$window){
	$window.PouchDB = pouchdb;
	var db = pouchDB('todos');
	var api = {
		save: function save(todo){
			var isOk = function isOk(response)
			{
				if(response.ok)
					$log.info("The document has  been saved with id ",response._id);
			};

			var uhOh = function uhOh(err)
			{
				$log.error(err);
				$log.error(err.stack);
			};
			
			db.post(todo)
			.then(isOk)
			.catch(uhOh);	
		}
	};
	return api;
}]);

app.controller("CreateCtrl",['$scope','SaveTodo',function($scope,SaveTodo){
	$scope.todo ={
		task:'What do you want to do?',
		description:'Lorem Ipsum Dolar...screw it',
		btnText:'Done',
		done:false
	};
	$scope.show_modal=function show_modal()
	{
		if(!$('.create-modal').modal('is active'))
			$('.create-modal').modal('show');	
	};
	$scope.saveTodo = function saveTodo(){
		SaveTodo.save($scope.todo);	
		$('.create-modal').modal('hide');
	};

	$scope.cancel = function cancel(){
		console.log("Cancel the todo action,currently a no-op");
		$('.create-modal').modal('hide');
	};
}]);

module.exports = app;
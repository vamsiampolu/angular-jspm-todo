var angular = require("angular");
var $ = require('semantic-ui');
var ngPouchchDB = require('angular-pouchdb');
var ngsemanticui = require('angular-semantic-ui');
var pouchdb = require('pouchdb');
//var lodash = require('lodash').noConflict();

var app = angular.module("app",['angularify.semantic','pouchdb']);

app.controller("HelloCtrl",function($scope){
	$scope.hello = "Hello World";
	$scope.title="CSS Preprocessors";
	$scope.categories = ["Sass","Less","Stylus","CSS"];
});

app.factory("TodoService",['$log','pouchDB','$window',function($log,pouchDB,$window){
	$window.PouchDB = pouchdb;
	var db = pouchDB('todos');
	var instance = {};
	instance.get = function get(){
		var res = db.allDocs({include_docs: true, descending: true})
		  .then(function(data){
		  		var pluck = function pluck(data,prop)
		  		{
		  			var res = [];
		  			for(var i=0;i<data.length;i++)
		  			{
		  				res.push(data[i][prop]);
		  			}
		  			return res;	
		  		};
		  		var _res = pluck(data.rows,'doc');
		  		//return data;
		  		//var _res = lodash.pluck(data.rows,'doc');
		  		//$log.info("The result of using pluck operation on data.rows is ",res);
		  		return _res;
		  }).catch(function(err){
		  		$log.error("The error is \n\t",err);
		  		$log.error("The stacktrace is \n\t",err.stack);
		  });
		  return res;
	};
	return instance;
}]);

app.factory('DeleteTodo',['$log','pouchDB','$window',function($log,pouchDB,$window){
	$window.PouchDB = pouchdb;
	var db = pouchDB('todos');
	var res = {
		delete:function(todo){
			$log.info("Inside delete ","todo value is ",todo);
			db.remove(todo);
		}
	};
	return res;
}]);

app.directive("todoItem",["DeleteTodo","$log",function(DeleteTodo,$log){
	var dirDefObj = {
		restrict:'E',
		templateUrl:'app/templates/todo.html',
		scope:{
			todo:'=value'
		},
		controller:function($scope){},
		replace:true
	};
	return dirDefObj;
}]);

app.factory('EditService',['$log','pouchDB','$window',function($log,pouchDB,$window){
	$window.PouchDB = pouchdb;
	var db = pouchDB('todos');
	var res = {
		edit:function(todo)
		{
			var promise = db.put(todo);
			promise.then(function(response){
				$log.info("Successfully updated the todo item\t",response);
			}).catch(function(error){
				$log.error('An error occured when updating todo');
				$log.error(err,"\n",err.stack);
			});
		}
	};
	return res;
}]);

app.directive("todoFormui",function(EditService){
	var dirDefObj = {
		restrict:'E',
		templateUrl:'app/templates/edit-todo.html',
		scope:false,
		controller:function($scope){
			$scope.preview = function(){
				console.log("Inside the edit to preview function");
				$scope.todo.editMode = false;
			};

			$scope.save = function(){
				EditService.edit($scope.todo);
			};

			$scope.discard = function(){
				$scope.todo={
					task:'',
					dscription:'',
					btnText:''
				};
				$scope.todo = $scope.savedState;
			};
		},
		replace:true
	};
	return dirDefObj;
});

app.directive('todoCardui',function(){
	var dirDefObj = {
		restrict:'E',
		templateUrl:'app/templates/display-todo.html',
		scope:false,
		replace:true,
		controller:function($scope)
		{
			$scope.clickDone = function clickDone(){
				//two tasks (1)toggle the done value on the todo (2) toggle the btnText on the todo
				$scope.todo.done = !$scope.todo.done;
				$scope.todo.btnText = $scope.todo.done?'Reinstate':'Done';
			};

			$scope.remove = function remove()
			{
				DeleteTodo.delete($scope.todo);
				$scope.$emit('todo:deleted',$scope.todo);
			};

			$scope.edit = function edit(value)
			{
				$scope.todo.editMode = true;
				$scope.savedState = angular.extend({},$scope.todo);
			};	
		}
	};
	return dirDefObj;
});

app.directive("todoList",["TodoService","$log",function(TodoService,$log){
	var dirDefObj = {
		restrict:'E',
		templateUrl:'app/templates/todo-list.html',
		controller:function($scope)
		{
			var todosPromise = TodoService.get();
			todosPromise
			.then(function(data){
				$scope.todos = data;	
				$log.info("Todo service get data ",$scope.todos);
			})
			.catch(function(){
				$log.error("The error is \n\t",err);
		  		$log.error("The stacktrace is \n\t",err.stack);
			});

			$scope.$on('todo:deleted',function(event,todo){
				for(var i =0;i<$scope.todos.length;i++)
				{
					if(todo._id === $scope.todos[i]._id)
						$scope.todos.splice(i,1);	
				}	
			});	
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
					$log.info("The document has  been saved with id ",response);
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
		$('.create-modal').modal('hide');
	};
}]);

app.directive('modalCreate',['$log','SaveTodo',function($log,SaveTodo){
	var dirDefObj = {
		restrict:'E',
		scope:{},
		templateUrl:'app/templates/create-todo.html',
		controller:function($scope,SaveTodo)
		{
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
				$log.info("Cancel the todo action,currently a no-op");
				$('.create-modal').modal('hide');
			};
		},
		replace:true
	};

	return dirDefObj; 
}]);

module.exports = app;
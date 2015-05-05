var angular = require("angular");
var $ = require('semantic-ui');
var ngPouchchDB = require('angular-pouchdb');
var ngsemanticui = require('angular-semantic-ui');
var pouchdb = require('pouchdb');
//var lodash = require('lodash').noConflict();

var app = angular.module("app",['angularify.semantic','pouchdb']);

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
		  		return _res;
		  }).catch(function(err){
		  		$log.error("The error is \n\t",err);
		  		$log.error("The stacktrace is \n\t",err.stack);
		  });
		  return res;
	};

	instance.edit = function edit(todo)
		{
			var promise = db.put(todo);
			promise.then(function(response){
				$log.info("Successfully updated the todo item\t",response);
			}).catch(function(error){
				$log.error('An error occured when updating todo');
				$log.error(err,"\n",err.stack);
			});
		};

	instance.save = function save(todo){
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
		};

	instance.delete = function(todo){
			$log.info("Inside delete ","todo value is ",todo);
			db.remove(todo);
		};	

	return instance;
}]);

app.directive("todoItem",function($log){
	var dirDefObj = {
		restrict:'E',
		templateUrl:'app/templates/todo.html',
		scope:{
			todo:'=value'
		},
		controller:function($scope){
			$scope.actions = {};
			$scope.uiState = {
				editMode:false,
				btnText:'Done'
			};
		},
		replace:true
	};
	return dirDefObj;
});

app.directive("todoFormui",function(TodoService){
	var dirDefObj = {
		restrict:'E',
		templateUrl:'app/templates/edit-todo.html',
		scope:false,
		controller:function($scope){
						
			//add a seperate model for editor and actions
			$scope.actions.preview = function(){
				console.log("Inside the edit to preview function");
				$scope.uiState.editMode = false;
			};

			$scope.actions.save = function(){
				TodoService.edit($scope.todo);
			};

			$scope.actions.discard = function(){
				$scope.todo={
					task:'',
					dscription:'',
					done:''
				};
				$scope.todo = $scope.savedState;
			};
		},
		replace:true
	};
	return dirDefObj;
});

app.directive('todoCardui',function(TodoService){
	var dirDefObj = {
		restrict:'E',
		templateUrl:'app/templates/display-todo.html',
		scope:false,
		replace:true,
		controller:function($scope)
		{			
			$scope.actions.clickDone = function clickDone(){
				//two tasks (1)toggle the done value on the todo (2) toggle the btnText on the todo
				$scope.todo.done = !$scope.todo.done;
				$scope.uiState.btnText = $scope.todo.done?'Reinstate':'Done';
			};

			$scope.actions.remove = function remove()
			{
				TodoService.delete($scope.todo);
				$scope.$emit('todo:deleted',$scope.todo);
			};

			$scope.actions.edit = function edit(value)
			{
				$scope.uiState.editMode = true;
				console.log($scope.uiState.editMode);
				//$scope.savedState = angular.extend({},$scope.todo);
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

app.controller("CreateCtrl",['$scope','TodoService',function($scope,TodoService){
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
		TodoService.save($scope.todo);	
		$('.create-modal').modal('hide');
	};

	$scope.cancel = function cancel(){
		$('.create-modal').modal('hide');
	};
}]);

app.directive('modalCreate',['$log','TodoService',function($log,TodoService){
	var dirDefObj = {
		restrict:'E',
		scope:{},
		templateUrl:'app/templates/create-todo.html',
		controller:function($scope,TodoService)
		{
			$scope.uiState = {
				btnText:'Done',
				editMode:false
			};
			$scope.actions = {};
			$scope.todo ={
				task:'What do you want to do?',
				description:'Lorem Ipsum Dolar...screw it',
				btnText:'Done',
				done:false
			};
			
			$scope.actions.show_modal=function show_modal()
			{
				if(!$('.create-modal').modal('is active'))
					$('.create-modal').modal('show');	
			};

			$scope.actions.saveTodo = function saveTodo(){
				TodoService.save($scope.todo);	
				$('.create-modal').modal('hide');
			};

			$scope.actions.cancel = function cancel(){
				$log.info("Cancel the todo action,currently a no-op");
				$('.create-modal').modal('hide');
			};
		},
		replace:true
	};

	return dirDefObj; 
}]);

module.exports = app;
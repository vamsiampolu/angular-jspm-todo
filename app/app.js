var angular = require("angular");
var $ = require('semantic-ui');
var ngPouchchDB = require('angular-pouchdb');
var pouchdb = require('pouchdb');
var ngAnimate = require('angular-animate');
var app = angular.module("app",['pouchdb','ngAnimate']);

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

	instance.getOne = function getOne(id){
		var res = db.get(id)
		.then(function(data){
			return data;
		})
		.catch(function(err){
			console.log(err,err.stack);
		});
		return res;
	};

	instance.edit = function edit(todo)
		{
			var promise = db.put(todo);
			promise.then(function(response){
				$log.info("Successfully updated the todo item\t",response);
			}).catch(function(err){
				$log.error('An error occured when updating todo');
				$log.error(err,"\n",err.stack);
			});
		};

	instance.save = function save(todo){
			var isOk = function isOk(response)
			{
				if(response.ok)
					$log.info("The document has  been saved with id ",response);

				return response;
			};

			var uhOh = function uhOh(err)
			{
				$log.error(err);
				$log.error(err.stack);
			};

			var promise = db.post(todo)
			.then(isOk)
			.catch(uhOh);
			return promise;
		};

	instance.deleteItem = function(todo){
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
		scope:{
			hideButtons:"=hideButtons",
			todo:"=todo"
		},
		controller:function($scope){
			//add a seperate model for editor and actions
			$scope.model = {
				todo:$scope.todo
			};
			$scope.uiState = {
				editMode:true,
				btnText:'Done'
			};
			$scope.actions = {};
			$scope.actions.preview = function(){
				console.log("Inside the edit to preview function");
				$scope.uiState.editMode = false;
			};

			$scope.actions.save = function(){
				TodoService.edit($scope.model.todo);
			};

			$scope.actions.discard = function(){
				$scope.model.todo={
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
		scope:{
			"hideButtons":"=hideButtons",
			todo:"=todo"
		},
		replace:true,
		controller:function($scope)
		{	$scope.model = {
				todo:$scope.todo
			};
			$scope.uiState = {
				editMode:false,
				btnText:'Done'
			};
			$scope.actions = {};
			$scope.actions.clickDone = function clickDone(){
				//two tasks (1)toggle the done value on the todo (2) toggle the btnText on the todo
				$scope.model.todo.done = !$scope.model.todo.done;
				$scope.uiState.btnText = $scope.todo.done?'Reinstate':'Done';
			};

			$scope.actions.remove = function remove()
			{
				TodoService.deleteItem($scope.model.todo);
				$scope.$emit('todo:deleted',$scope.model.todo);
			};

			$scope.actions.edit = function edit(value)
			{
				$scope.uiState.editMode = true;
				console.log($scope.uiState.editMode);
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
			$scope.model = {};
			var todosPromise = TodoService.get();
			todosPromise
			.then(function(data){
				$scope.model.todos = data;
				$log.info("Todo service get data ",$scope.todos);
			})
			.catch(function(){
				$log.error("The error is \n\t",err);
		  		$log.error("The stacktrace is \n\t",err.stack);
			});

			$scope.$on('todo:deleted',function(event,todo){
				 $scope.model.todos = $.grep($scope.model.todos, function (todoItem, i) {
				      if (todoItem._id === todo._id) {
				        console.log(i);
				        return false;
				      } else {
				        return true;
				      }
				    });
			});

			$scope.$on('todo:created',function(event,todo){
				$scope.model.todos.push(todo);
			});
		},
		replace:true
	};
	return dirDefObj;
}]);

app.directive('modalCreate',['$log','TodoService',function($log,TodoService){
	var dirDefObj = {
		restrict:'E',
		scope:{},
		templateUrl:'app/templates/create-todo.html',
		controller:function($scope,TodoService)
		{
			console.log($scope);
			$scope.model = {};
			$scope.actions = {};
			$scope.uiState = {};
			$scope.model.todo ={
				task:'What do you want to do?',
				description:'Lorem Ipsum Dolar...screw it',
				done:false

			};
			$scope.uiState.hideButtons = true;
			$scope.actions.show_modal=function show_modal()
			{
				if(!$('.create-modal').modal('is active'))
					$('.create-modal').modal('show');
			};

			$scope.actions.saveTodo = function saveTodo(){
				var promise = TodoService.save($scope.model.todo);
				promise
					.then(function(data){ return data.id; })
					.then(TodoService.getOne)
					.then(function(data){
						$scope.$emit('todo:created',data);
					})
					.catch(function(err){
						console.log(err,err.stack);
					});
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
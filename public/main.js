var requestApp = angular.module('requestApp', ['ngResource', 'ngRoute']);

requestApp.factory('climbRequests', function($resource){
	var model = $resource('/api/:id', {id: '@_id'});
	return{
		model: model,
		items: model.query()
	};
});

requestApp.controller('requestController', function($scope, climbRequests){
	$scope.items = climbRequests.items;

	$scope.addItem = function(){
		console.log(this.newItem.date);
		var newRequest = new climbRequests.model(this.newItem);
		newRequest.$save(function(savedItem){
			climbRequests.items.push(savedItem);
		});
		this.newItem = {};
	};
});

//no camel case
requestApp.directive('climbrequests', function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/climbRequests',
		scope:{
			item: '='
		}
	};
});

 
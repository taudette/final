var requestApp = angular.module('requestApp', ['ngResource', 'ngRoute', 'uiGmapgoogle-maps']);

// requestApp.config(function($routeProvider){
//   //always goes to template home at /
//   $routeProvider
//     .when('/', {
//       templateUrl: '/templates/home',
      
//     });
   
// });

requestApp.factory('climbRequests', function($resource){
	var model = $resource('/api/:id', {id: '@_id'});
	return{
		model: model,
		//first query up to db to get info to pre fill page
		items: model.query()
	};
});

requestApp.controller('requestController', function($scope, climbRequests){
	$scope.items = climbRequests.items;
	$scope.addItem = function(){
		console.log(this);
		var newRequest = new climbRequests.model(this.newItem);
		newRequest.$save(function(savedItem){
			climbRequests.items.push(savedItem);
			
		});
		this.newItem = {};
	};
	$scope.map = { center: { latitude: 39.8282, longitude: -98.5 }, zoom: 4 };

	$scope.marker = {
		id: 0,
		coords: {
			latitude:39.8282,
			longitude: -98.5
		}
	};

	$scope.markerList = [
		{	
			id: 2,
			latitude:39.8282,
			longitude: -97.5
		},
		{	
			id: 3,	
			latitude:39.8282,
			longitude: -99.5
		}	
	];

});

//no camel case
requestApp.directive('climbrequests', function(){
	return{
		//only matches element name(use when creating component that is in control of template, use Attribute when decorating an element with another behavior)
		restrict: 'E',
		templateUrl: '/templates/climbRequests',
		//without isolating the scope the directive could only be used once for each controller. Instead, seperate inside scope then map outer scope into directive
		scope:{
			item: '='
		}
	};
});


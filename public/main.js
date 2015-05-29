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
requestApp.controller('requestController', function($scope, $http, climbRequests){
	
	$scope.items = climbRequests.items;
	$scope.markerList = [{}];

	var showMarkers = function(){
		//sending request to server side endpoint (api)
		$http.get('/api/')
		//data coming in from res.send
		.success(function(data) {
			for (var i = 0; i < data.length; i++) {
				$scope.markerList.push({
					id: data[i]._id,
					latitude: data[i].geo.lat,
					longitude: data[i].geo.long
				});				
			}
		})
		.error(function(data) {
			console.log(data);
		});
	};


	showMarkers();
	$scope.addItem = function(){
		var newRequest = new climbRequests.model($scope.newItem);
		newRequest.$save(function(savedItem){

			climbRequests.items.push(savedItem);

			//markers
			var geocoder = new google.maps.Geocoder();
 			geocoder.geocode( { "address": savedItem.crag + ',' + savedItem.state }, function(results, status) {
	     		if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
	        		var location = results[0].geometry.location;
	        		$scope.latitude = location.A;
	        		$scope.longitude = location.F; 
	        		
	        		$scope.newItem.geo = {id: savedItem._id, lat: location.A, long: location.F};

	        		$http.put('/api/'+ savedItem._id, $scope.newItem.geo)
	        			.success(function(data) {
	        				console.log(data);
	        			})
	        			.error(function(data) {
	        				console.log(data);
	        			});
					$scope.markerList.push({id:savedItem._id, latitude: $scope.latitude, longitude: $scope.longitude});	
		     	}
			});	
		});
	$scope.newItem = {};		
    }; 	
	$scope.removeItem = function(item){
		// console.log($scope.items);
		this.item.$remove(function(){
			var index = $scope.items.indexOf(this.item);
			$scope.items.splice(index, 1);
		});
	};

	//map stuff
	$scope.map = { center: { latitude: 39.8282, longitude: -98.5 }, zoom: 4 };
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


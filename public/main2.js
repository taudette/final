var requestApp = angular.module('requestApp', ['ngResource', 'ngRoute', 'uiGmapgoogle-maps', 'gm.datepickerMultiSelect']);

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
					name: data[i].name,
					state: data[i].state,
					grade: data[i].grade,
					date: data[i].date,
					info: data[i].info,
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
	        			})
	        			.error(function(data) {
	        				console.log(data);
	        			});        		
	        		
		     	}
		     	var marker = new new google.maps.Marker({
	        			id:savedItem._id, 
	        			latitude: $scope.latitude, 
	        			longitude: $scope.longitude,
	        			map: $scope.map,
	        			title:'string of test',
	        			labelContent:'please work',
	        			labelClass:'labels'
	        		});
					// var iw1 = new google.maps.InfoWindow({
					// 	content: "Home For Sale"
					// });
					google.maps.event.addListener(marker, "click", function () { 
						console.log('click');
						// iw1.open(map, this); 
					});
	        		
	        	
					$scope.markerList.push(marker);	
					
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
	
	$scope.map = { center: { latitude: 39.8282, longitude: -98.5 }, zoom: 3, options:{ styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#e66e3b"},{"visibility":"on"}]}]} };


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


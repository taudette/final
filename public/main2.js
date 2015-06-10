var requestApp = angular.module('requestApp', ['ngResource', 'ngRoute', 'uiGmapgoogle-maps', 'gm.datepickerMultiSelect']);

requestApp.config(function($routeProvider) {
    $routeProvider
    .otherwise('/');
    //load page using otherwise to add #/
    
});

requestApp.factory('climbRequests', function($resource){
	var model = $resource('/api/:id', {id: '@_id'});
	return{
		model: model,
		//first query up to db to get info to pre fill page
		items: model.query()
	};
});

requestApp.controller('ScrollController', ['$scope', '$location', '$anchorScroll',
  function ($scope, $location, $anchorScroll) {
    $scope.gotoMap = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('map');

      // call $anchorScroll()
      $anchorScroll();
    };
  }]);
requestApp.controller('requestController', function($scope, $http, $location, $anchorScroll, climbRequests){

	var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
	
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
	$scope.items = climbRequests.items;
	$scope.markerList = [{}];

	var infoWindow = new google.maps.InfoWindow();





	$scope.addItem = function(){
		var newRequest = new climbRequests.model($scope.newItem);
		newRequest.$save(function(savedItem){
			climbRequests.items.push(savedItem);

			//markers
			var createMarker = function(info){	
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
        
        			var marker = new google.maps.Marker({
        				id:savedItem._id, latitude: $scope.latitude, longitude: $scope.longitude
        			});
        		
					marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

					google.maps.event.addListener(marker, 'click', function(){
						infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
						infoWindow.open($scope.map, marker);
					});

				    $scope.markerList.push(marker);	
				}
		     	});
			};
		});


	for (i = 0; i < $scope.markerList.length; i++){
		createMarker($scope.markerList[i]);
	}				
	$scope.newItem = {};		
    }; 	

	$scope.removeItem = function(item){
		// console.log($scope.items);
		this.item.$remove(function(){
			var index = $scope.items.indexOf(this.item);
			$scope.items.splice(index, 1);
		});
	};


	
	//for makers in DB
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
	console.log($scope.markerList);
	

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


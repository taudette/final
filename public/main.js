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

var geocoder;
var map;

function initialize() {
	geocoder = new google.maps.Geocoder();
	var mapCanvas = document.getElementById('map-canvas');
	var mapOptions = {
		zoom: 4,
		center: new google.maps.LatLng(39.8282, -98.5795), // New York
		styles: [{"featureType":"water","elementType":"all","stylers":[{"hue":"#4EACDE"},{"saturation":10},{"lightness":10},{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#FFFFFF"},{"saturation":-100},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[]},{"featureType":"landscape.natural","elementType":"all","stylers":[]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"hue":"#333333"},{"saturation":-100},{"lightness":-69},{"visibility":"simplified"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":0},{"lightness":100},{"visibility":"off"}]},{"featureType":"poi.government","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]}]
	};

	map = new google.maps.Map(mapCanvas, mapOptions);

	// Create the search box and link it to the UI element.
  	var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  	map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
    var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));
 	google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    // sorted list by state on search//////
    var enteredplace = (places[0].formatted_address);
    var locationStrung = String(enteredplace);
    var split = locationStrung.split(',');
    var stateOnly= split[0];
    console.log(places);
  	myLibrary.renderFilter(stateOnly);

    if (places.length === 0) {
      return;
    }
    //search function//
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      bounds.extend(place.geometry.location);
    }
    // Don't zoom in too far on only one marker
    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
       var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 1.5, bounds.getNorthEast().lng() + 1.5);
       var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 1.5, bounds.getNorthEast().lng() - 1.5);
       bounds.extend(extendPoint1);
       bounds.extend(extendPoint2);
    }

    map.fitBounds(bounds);
    console.log(bounds);
  	});
	google.maps.event.addDomListener(window, 'load', initialize);
	google.maps.event.addListenerOnce(map, 'idle', function(){
		myLibrary.renderMarkers(map);
    // do something only the first time the map is loaded
});
}


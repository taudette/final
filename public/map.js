function initialize() {
	geocoder = new google.maps.Geocoder();
	var mapCanvas = document.getElementById('map-canvas');
	var mapOptions = {
		zoom: 4,
		center: new google.maps.LatLng(39.8282, -98.5795), // New York
		styles: [{"featureType":"water","elementType":"all","stylers":[{"hue":"#4EACDE"},{"saturation":10},{"lightness":10},{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#FFFFFF"},{"saturation":-100},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[]},{"featureType":"landscape.natural","elementType":"all","stylers":[]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"hue":"#333333"},{"saturation":-100},{"lightness":-69},{"visibility":"simplified"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":0},{"lightness":100},{"visibility":"off"}]},{"featureType":"poi.government","elementType":"geometry","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]}]
	};

	map = new google.maps.Map(mapCanvas, mapOptions);
      }
      google.maps.event.addDomListener(window, 'load', initialize);
App = Ember.Application.create();
App.GoogleMapsComponent  = Ember.Component.extend({
	insertMap: function() {
		var directionsService = new google.maps.DirectionsService();
    	var map;
    	var westhigh = new google.maps.LatLng(40.774534, -111.900473);
    	var testLoc = new google.maps.LatLng(40.773055, -111.882215);
		var container = this.$(".map-canvas");
		directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions = {
          zoom: 14,
          center: westhigh
        }
        map = new google.maps.Map(container[0], mapOptions);
        var defaultBounds = new google.maps.LatLngBounds(
          westhigh,
          testLoc);
        map.fitBounds(defaultBounds);
        var input =($('#searchbar')[0]);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var searchBox = new google.maps.places.Autocomplete(input);

         google.maps.event.addListener(searchBox, 'place_changed', function() {
          var place = searchBox.getPlace();
          calcRoute(place.geometry.location, "DRIVING", directionsService);
          calcRoute(place.geometry.location, "BICYCLING", directionsService);
        });
        google.maps.event.addListener(map, 'bounds_changed', function() {
          var bounds = map.getBounds();
          searchBox.setBounds(bounds);
        });
	}
})
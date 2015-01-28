      var directionsService = new google.maps.DirectionsService();
      var map;
      var westhigh = new google.maps.LatLng(40.774534, -111.900473);
      var testLoc = new google.maps.LatLng(40.773055, -111.882215);
      function initialize() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions = {
          zoom: 14,
          center: westhigh
        }
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        var defaultBounds = new google.maps.LatLngBounds(
          westhigh,
          testLoc);
        map.fitBounds(defaultBounds);
        var input =($('#searchbar')[0]);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var searchBox = new google.maps.places.Autocomplete(input);

         google.maps.event.addListener(searchBox, 'place_changed', function() {
          var place = searchBox.getPlace();
          calcRoute(place.geometry.location, "DRIVING");
          calcRoute(place.geometry.location, "BICYCLING");
        });
        google.maps.event.addListener(map, 'bounds_changed', function() {
          var bounds = map.getBounds();
          searchBox.setBounds(bounds);
        });
      }
      function calcRoute(place, transType) {
      	var directionsDisplay = new google.maps.DirectionsRenderer();
      	directionsDisplay.setMap(map);
        var request = {
            origin: place,
            destination: westhigh,
            travelMode: google.maps.TravelMode[transType]
        };
        directionsService.route(request, function(response, status) {
        	if(transType === "DRIVING") {
        		console.log("Carbon Emissions of Driving");
        		console.log(response.routes[0].legs[0].distance.value/1609.34*430);

        	}
          
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
      }
      google.maps.event.addDomListener(window, 'load', initialize);
    

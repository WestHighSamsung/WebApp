      var westhigh = new google.maps.LatLng(40.774534, -111.900473);
      function calcRoute(place, transType, directionsServ, map) {
      	var directionsDisplay = new google.maps.DirectionsRenderer();
      	directionsDisplay.setMap(map);
        var request = {
            origin: place,
            destination: westhigh,
            travelMode: google.maps.TravelMode[transType]
        };
        directionsServ.route(request, function(response, status) {
        	if(transType === "DRIVING") {
        		console.log("Carbon Emissions of Driving");
        		console.log(response.routes[0].legs[0].distance.value/1609.34*430);

        	}
          
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
      }
      // google.maps.event.addDomListener(window, 'load', initialize);
    

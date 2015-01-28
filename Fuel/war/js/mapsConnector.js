      var westhigh = new google.maps.LatLng(40.774534, -111.900473);
      function calcRoute(place, transType, directionsServ, map) {
        var carbon;
        var dist;
        var time;
      	var directionsDisplay = new google.maps.DirectionsRenderer();
      	directionsDisplay.setMap(map);
        var request = {
            origin: place,
            destination: westhigh,
            travelMode: google.maps.TravelMode[transType]
        };
        directionsServ.route(request, function(response, status) {
          dist = response.routes[0].legs[0].distance.value;
          time = response.routes[0].legs[0].duration.value;
        	if(transType === "DRIVING") {
            carbon = distance*1609.34*430;
        	} else if(transType === "TRANSIT") {
            carbon = distance*10;//this is currently a wrong value; fix it
          } else {
            carbon = 0;
          }

          console.log(distance + " "+ time + " "+ carbon);
          var retJSON = {
            distance = dist,  
            duration = time, 
            emissions = carbon
          };
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });
        return retJSON;
      }
      // google.maps.event.addDomListener(window, 'load', initialize);
    

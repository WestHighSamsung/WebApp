var westhigh = new google.maps.LatLng(40.774534, -111.900473);


function RouteClass(route) {
  //index->reference|| 0 -> distance, 1 -> duration, 2 -> carbon
  this.values = Array(3);
  this.legs = route.routes[0].legs;
  for(i = 0; i < legs.length; i++){
    var leg = legs[i];
    this.values[0] += leg.distance.value;
    this.values[1] += leg.duration.value;
  }
  if(this.values[0] > route.routes[0].distance- 200 && this.values[0] < routes.routes[0].distance + 200)
  {
    alert("True");
  }
  this.values[2] = this.values[0]/1609.34*430;
}
RouteClass.routes = {};
RouteClass.hasRoutes = false;
RouteClass.transTypes = ['DRIVING','WALKING','BICYCLING', 'TRANSIT'];
//function takes the starting location and transportation type and outputs a route object
function calcRoute(place, transType, directionsService, map){ 
  var request = {
      origin: place,
      destination: westhigh,
      travelMode: google.maps.TravelMode[transType]
  };
  directionsService.route(request, function(response, status) {
    var trans = RouteClass.transTypes;
    RouteClass.hasRoutes = true;        
    RouteClass.routes[transType] = response;
    displayMap(map, response, status);
    //unnecessary stuff
    //only runs successfully onse
    // for(i = 0; i < trans.length; i++) { 
    //   if(transType == trans[i]) { 
    //     RouteClass.hasRoutes = true;        
    //     RouteClass.routes[transType] = response;
    //     break;//doesn't need to keep searching after it has been found.
    //   }
    // }
  });
  //this updates everytime to update the static route storage.

}
function displayMap(map, route, status) {
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  if (status == google.maps.DirectionsStatus.OK) {
    directionsDisplay.setDirections(route);
  }
}

  //commented out for convenient debugging.
  // function calcRoute(place, transType, directionsServ, map) {
 
  // var directionsDisplay = new google.maps.DirectionsRenderer();
  // directionsDisplay.setMap(map);
  // var request = {
  //     origin: place,
  //     destination: westhigh,
  //     travelMode: google.maps.TravelMode[transType]
  // };
  // var retJSON;
  // //may be a good idea to make this its own function.
  // directionsServ.route(request, function(response, status) {
  //   dist = response.routes[0].legs[0].distance.value;
  //   time = response.routes[0].legs[0].duration.value;
  //   if(transType === "DRIVING") {
  //     carbon = distance*1609.34*430;
  //   } else if(transType === "TRANSIT") {
  //     carbon = distance*10;//this is currently a wrong value; fix it
  //   } else {
  //     carbon = 0;
  //   }

  //   console.log(distance + " "+ time + " "+ carbon);
  //   retJSON = {
  //      distance: dist,  
  //      duration: time, 
  //      emissions: carbon, 
  //      route:response
  //   };
  //   if (status == google.maps.DirectionsStatus.OK) {
  //     directionsDisplay.setDirections(response);
  //   }
  // });
  // return retJSON;
//}

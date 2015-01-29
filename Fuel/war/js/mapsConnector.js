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
RouteClass.routes = new Array(4);
RouteClass.hasRoutes = false;
RouteClass.transTypes = ['DRIVING','WALKING','BICYCLING', 'TRANSIT'];
//function takes the starting location and transportation type and outputs a route object
function calcRoute(place, transType){ 
  var request = {
      origin: place,
      destination: westhigh,
      travelMode: google.maps.TravelMode[transType]
  }
  var routeRe;
  //may be a good idea to make this its own function.
  directionsServ.route(request, function(response, status) {
    routeRe = response;
  });
  //this updates everytime to update the static route storage.
  var trans = RouteClass.transTypes;
  for(i = 0; i < trans.length; i++) { 
    if(transType === transTypes[i]) { 
      RouteClass.hasRoutes = true;
      RouteClass.routes[i] = routeRe;
    }
  }
  return routeRe;
}
function displayMap(map, route) {
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  if (status == google.maps.DirectionsStatus.OK) {
    directionsDisplay.setDirections(response);
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

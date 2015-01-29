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
RouteClass.transTypes = ['WALKING','BICYCLING', 'TRANSIT','DRIVING'];
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

//function returns the recommended method/s of transportation
function recommendTransType(place) {
  var recommendedTypes = new Array();
  var durationByType = new Array(4); //0 -> WALKING, 1 -> BICYCLING, 2 -> TRANSIT, 3 -> DRIVING

  for(i = 0; i < RouteClass.transTypes.length; i++) {
    var request = {
      origin: place,
      destination: westhigh,
      travelMode: google.maps.TravelMode[RouteClass.transTypes[i]]
    }

    //get the recommended route
    var routeRe;
    directionsServ.route(request, function(response, status) {
      routeRe = response;
    });

    // routeRe -> routes (Array.<DirectionsRoute>) -> legs (Array.<DirectionsLeg>) -> duration
    var duration = 0;
    for(i = 0; i < routeLegs.length; i++)
      duration += routeRe.routes[0].legs[i].duration;
    duration /= 60; //convert from seconds to minutes

    durationByType[i] = duration;
  }

  //if it is walkable in 15 min, walk
  if(durationByType[0] <= 15)
    recommendedTypes.push('WALKING');
  //if it can't be walked in 10 min and is bikable in under 30 mim, bike
  if(durationByType[1] <= 30 && durationByType[0] > 10)
    recommendedTypes.push('BICYCLING');
  //if it can't be biked in 30 min and is reachable in under 60 min by transit, transit
  //or if it is not bikable in 30 min and transit is within 15 min or faster than driving
  if(durationByType[1] > 30 && durationByType[2] <= 60)
    recommendedTypes.push('TRANSIT');
  else if(durationByType[1] > 30 && durationByType[2] < durationByType[3] + 15)
    recommendedTypes.push('TRANSIT');
  //if it can't be biked in 30 min and driving is at least 15 min faster than transit, carpool
  if(durationByType[1] > 30 && durationByType[2] - durationByType[3] > 15)
    recommendedTypes.push('DRIVING');

  //default value if nothing else is suggested
  if(recommendedTypes.length == 0)
    recommendedTypes.push('DRIVING');

  //in case multiple forms of transportation are recommended equally
  return recommendedTypes;
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

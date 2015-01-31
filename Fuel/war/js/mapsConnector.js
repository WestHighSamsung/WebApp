var westhigh = new google.maps.LatLng(40.774534, -111.900473);


function RouteClass(route, type) {
  //index->reference|| 0 -> distance, 1 -> duration, 2 -> carbon
  this.values = Array(3);
  this.strings = Array(3);
  for(j=0; j < 3; j++){
    this.values[j] = 0;
  }
  this.legs = route.routes[0].legs;
  for(i = 0; i < this.legs.length; i++){
    var leg = this.legs[i];
    this.values[0] += leg.distance.value;
    this.values[1] += leg.duration.value;
  }
  if(this.values[0] > route.routes[0].distance- 200 && this.values[0] < routes.routes[0].distance + 200)
  {
    alert("True");
  }
  this.values[0] /= 1609.34;
  if(type === 'DRIVING'){
    this.values[2] = this.values[0]*430;
  }else if(type === 'TRANSIT'){
    this.values[2] = this.values[0]*300;//update this to match the actual value
  }
  //Format the values to readable strings
  this.strings[0] = ""+format(this.values[0])+" mi.";
  this.strings[1] = timeFormat(this.values[1]);
  this.strings[2] = ""+format(this.values[2])+" grams of CO2";
;}
//formats to have only 1 decimal point
function format(n){
  return n.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}
//input seconds and return time in format: hh hours, mm minutes, ss seconds
function timeFormat(sec){
  var hours = sec/3600;
  var form = "";
  if(hours >= 1) {
    hours -= (sec%3600)/3600;
    sec -= hours*3600;
    form += hours +" hours, ";
  }
  else{
    hours = 0;
  }
  var minutes = sec/60;
  
  if(minutes >= 1) {
    minutes -= (sec%60)/60;
    console.log(minutes);
    sec -= minutes*60;
    form += minutes + " minutes, ";
  }
  else{
    minutes = 0;
  }
  form+= sec+ " seconds";
  return form;

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
    RouteClass.routes[transType] = new RouteClass(response, transType);
    displayMap(map, response, status);
    var tableDiv = $("#table-data");
    tableDiv.show();
    // if(tableDiv.is(":visibile")){
    //   tableDiv.show();
    // }
  });

}

function displayMap(map, route, status) {
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  if (status == google.maps.DirectionsStatus.OK) {
    directionsDisplay.setDirections(route);
  }
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

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
//place must 
function allRoutes(place, directionsService, map, cb){
  var transTypes = RouteClass.transTypes;//ease
  //array for the different modes of travel
  var routes = [];
  //currently saves then displays map.
  for(j = 0; j < transTypes.length; j++){
    calcRoute(place.geometry.location, transTypes[j], directionsService, map,cb);
  }
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
RouteClass.colors = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF'];
var colors = RouteClass.colors;
var directionsDisplay = {};
//initialize directionsDisplay
for(i = 0; i < RouteClass.transTypes.length; i++)
{
  var polylineOptionsReal = new google.maps.Polyline({
    strokeColor: colors[i],
    strokeOpacity: 0.8,
    strokeWeight: 5
    });
  var options = {
    polylineOptions: polylineOptionsReal
  }
  directions = new google.maps.DirectionsRenderer(options);
  directionsDisplay[RouteClass.transTypes[i]] = directions;
}
//function takes the starting location and transportation type and outputs a route object
function calcRoute(place, transType, directionsService, map, cb){ 
  var request = {
      origin: place,
      destination: westhigh,
      travelMode: google.maps.TravelMode[transType]
  };

  if(transType === undefined) 
    console.log(transType);  

  directionsService.route(request, function(response, status) {
    var renderer = directionsDisplay[transType];
    var trans = RouteClass.transTypes;
    RouteClass.hasRoutes = true;
    RouteClass.routes[transType] = new RouteClass(response, transType);
    if (status == google.maps.DirectionsStatus.OK) {
      displayMap(map, response, renderer);
    }
    var tableDiv = $("#table-data");
    tableDiv.show();
    // if(tableDiv.is(":visibile")){
    //   tableDiv.show();
    // }

    cb();
  });

}

//just adds a map, doesn't replace the old one.
//currently not in use 
function addMap(map, route) {
  var curRoutes = directionsDisplay.getDirections();
  var retRoutes;
  if(curRoutes !== undefined && curRoutes.constructor === Array)
  {
    curRoutes.push(route);
    retroutes = curRoutes;
  }
  else if(curRoutes !== undefined)
  {
    retRoutes = [curRoutes, route];
  }
  else {
    retRoutes = [route];
  }
  directionsDisplay.setMap(map);  
  directionsDisplay.setDirections({routes: retRoutes});
}
//Displays a single route
function displayMap(map, route, directionsDisplay) {
  console.log("displayMap()");
  directionsDisplay.setMap(map);  
  directionsDisplay.setDirections(route); 
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
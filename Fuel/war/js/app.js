App = Ember.Application.create();

App.Router.map(function(){
	this.resource('index', {path:'/'}, function(){
		this.route('carbon');
		this.route('carpool');
	});
	this.resource('login');
	this.resource('about')
});

//needs to contain an array of arrays. Each sub array is a different mode.
App.CarbonTableComponent = Ember.Component.extend({
  actions: {
    trap: function() {
      var container = this.$("#table-data");
      var output = "<thead>\n<tr>\n<th>Type</th>\n<th>Distance</th>\n<th>Duration</th>\n<th>Emissions</th>\n</thead>";
      //makes sure to check that it has routes
      if(RouteClass.hasRoutes){

        //this is the routes for different types of transports.
        var routes = RouteClass.routes;
        //this will construct the table
        
        var transTypes = RouteClass.transTypes;
        for(i = 0; i < transTypes.length; i++){
          output += "\n<tr>\n<td><b>"+transTypes[i]+"</b></td>";
          var routeInfo = routes[transTypes[i]];
          for(j = 0; j < routeInfo.strings.length; j++){
            output += "\n<td>"+routeInfo.strings[j]+"</td>";  
          }
          output +="\n</tr>";
        }
        container.html(output);
      } 
    }
  }
});

App.GoogleMapsComponent = Ember.Component.extend({
	insertMap: function() {
		var container = this.$(".map-canvas");
    var table = this.$("#table-data");
		var directionsService = new google.maps.DirectionsService();
  	var westhigh = new google.maps.LatLng(40.774534, -111.900473);
  	var testLoc = new google.maps.LatLng(40.773055, -111.882215);
    var mapOptions = {
      zoom: 14,
      center: westhigh
    }
    var map = new google.maps.Map(container[0], mapOptions);
    var defaultBounds = new google.maps.LatLngBounds(westhigh, testLoc);
    map.fitBounds(defaultBounds);
    var input =($('#searchbar')[0]);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(searchBox, 'place_changed', function() {
      var place = searchBox.getPlace();
      var transTypes = RouteClass.transTypes;//ease
      //array for the different modes of travel
      var routes = [];
      //currently saves then displays map.
      for(j = 0; j < transTypes.length; j++){
        calcRoute(place.geometry.location, transTypes[j], directionsService, map);
      }
      // if(RouteClass.routes.length == transTypes.length){
      //   //this is the routes for different types of transports.
      //   var routes = RouteClass.routes;
      //   //this will construct the table
      //   table.html("hello");
      //   output += "\n<tr>";
        
      //   for(i = 0; i < routes.length; i++){
      //     var routeInfo = routes[i];
      //     for(j = 0; j < routeInfo.values.length; j++){
      //       output += "\n<td>"+routeInfo.values[j]+"</td>";  
      //     }
          
      //   }
      //   output +="\n</tr>";
      //   console.log("uh huh hunny");
      //   table.html(output);
      // } 
    });
    google.maps.event.addListener(map, 'bounds_changed', function() {
      var bounds = map.getBounds();
      searchBox.setBounds(bounds);
    });
	}.on('didInsertElement')
});
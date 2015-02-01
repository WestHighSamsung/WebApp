App = window.App = Ember.Application.createWithMixins(Em.Facebook);
App.set('appId', '1536032630009134');
App.set('title', 'West Connect');
Ember.ENV.RAISE_ON_DEPRECATION = false;
Ember.LOG_STACKTRACE_ON_DEPRECATION = false;

App.Router.map(function(){
	this.resource('index', {path:'/'}, function(){
		this.route('carbon');
		this.route('carpool');
	});
	this.resource('login', {path: '/login'}, function(){
    this.route('register');
  });
	this.resource('about')
});


App.IndexRoute = Ember.Route.extend({
  activate: function(){
    this._super();
    if(App.get('FBUser') == false || App.get('FBUser') == undefined || (App.get('FBUser') != undefined && App.get('FBUser').get('address') == undefined)){
      this.transitionTo('login');
    }
  }.observes('App.FBUser')
});


//Registration and fun shti
App.LoginRoute = Ember.Route.extend({
  beforeModel: function(transition){
      console.log('hello');
      if(App.get('FBUser') != undefined && App.get('FBUser') != false && App.get('FBUser').address != undefined)
        transition.abort();
      else
          return true;
  },
  activate: function(){
    this._super();
    //Let's handle the registration
    if(App.get('FBUser') != false && App.get('FBUser') != undefined){
      var user = App.get('FBUser');
      var _this = this;
      console.log({
        "name": user.name,
        "userID": user.id,
        "accTok": user.accessToken,
        "email": user.email
      });
      //Connect to server
      console.log("help");
      return App.$.getJSON("http://localhost:8888/api/login",
      {
        name: user.name,
        userID: user.id,
        accTok: user.accessToken,
        email: user.email
      },
      function(resp){
        var val = resp.propertyMap;
        console.log(val);
        if(val.address == "null"){
          //Begin the registration
          _this.transitionTo("login.register");
          $("#white").scrollView();
        }
        else{
          user.set('address', resp.propertyMap.address);
          console.log("going to go to the index");
          _this.transitionTo('index');
        }

      }).fail(function(a,s,d){
        console.log(a);
        console.log(s);
        console.log(d);
      });
    }

  }.observes('App.FBUser')
});


App.LoginRegisterRoute = Ember.Route.extend({
  activate: function(){
    this._super();
  },
  actions:{
    doRegister: function(){

      var _this = this;
      var address = $("#radr").val();
      console.log(address);
      var user = App.get('FBUser');
      user.set('address', address);
      $.getJSON("http://localhost:8888/api/update",
      {
        "userID": user.id,
        "address": address
      },
      function(resp){
        _this.transitionTo('index');
      });
    }
  }
});


$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 1000);
    });
}

//needs to contain an array of arrays. Each sub array is a different mode.
App.CarbonTableComponent = Ember.Component.extend({
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
    }.observes('App.GoogleMapsComponent')
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
    });
    google.maps.event.addListener(map, 'bounds_changed', function() {
      var bounds = map.getBounds();
      searchBox.setBounds(bounds);
    });
	}.on('didInsertElement')
});

App.AddressInputComponent = Ember.Component.extend({
  insert: function(){
    var input =($('#radr')[0]);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.Autocomplete(input);
  }.on('didInsertElement')
});
App = window.App = Ember.Application.createWithMixins(Em.Facebook);
App.set('appId', '1536032630009134');
App.set('title', 'West Connect');
Ember.ENV.RAISE_ON_DEPRECATION = false;
Ember.LOG_STACKTRACE_ON_DEPRECATION = false;

App.Router.map(function(){
	this.resource('index', {path:'/'}, function(){
		this.route('carpool');
	});
	this.resource('login', {path: '/login'}, function(){
    this.route('register');
  });
	this.resource('about')
});

App.ApplicationController = Ember.Controller.extend({
  actions:{
    logout: function(){
      App.fbLogout();
    }
  }
});

App.IndexRoute = Ember.Route.extend({
  beforeModel: function(transition){
    console.log('hello');
    if(App.get('FBUser') == false || App.get('FBUser') == undefined || (App.get('FBUser') != undefined && App.get('FBUser').get('address') == undefined)){
      transition.abort();
    }
    else
        return true;
  },
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
      if(App.get('FBUser') != undefined && App.get('FBUser') != false && App.get('FBUser').address != undefined){
        transition.abort();
        console.log('goodbye');
      }
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
      //VALIDATE FIELDS


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

App.IndexCarpoolRoute = Ember.Route.extend({
  model: function(){

    var user = App.get('FBUser');
    if (user != undefined)
    {
      $.getJSON("http://localhost:8888/api/carpool", {
        "userID": user.id 
      },
      function(resp){
        App.set('closest', resp);
        console.log(resp);
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
    



    var geocoder = new google.maps.Geocoder();
    var addy = $('#searchbar').val();
    geocoder.geocode({'address': addy}, function(results, status){
      if (status == google.maps.GeocoderStatus.OK) {
        var place = results[0];
        allRoutes(place, directionsService, map,
          function(){
            var results = [];
            var routes = RouteClass.routes;
            var transTypes = RouteClass.transTypes;
            console.log("lol");
            for(i = 0; i < transTypes.length; i++)
              results.push({
                color: "color: " + colors[i] + ";",
                trans: transTypes[i],
                distance:routes[transTypes[i]].strings[0],
                duration:routes[transTypes[i]].strings[1],
                emissions: routes[transTypes[i]].strings[2]
              });
            App.set('maps', results);
          });
      }
      else{
        alert("invalid address");
      }
    })
    
    google.maps.event.addListener(searchBox, 'place_changed', function() {
      var place = searchBox.getPlace();
      allRoutes(place, directionsService, map);
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

//RADIO BUTTONS
Ember.RadioButton = Ember.View.extend({  
    tagName : "input",
    type : "radio",
    attributeBindings : [ "name", "type", "value", "checked:checked:" ],
    click : function() {
        this.set("selection", this.$().val())
    },
    checked : function() {
        console.log(this.get("value"));
        return this.get("value") == this.get("selection");   
    }.property(),

});


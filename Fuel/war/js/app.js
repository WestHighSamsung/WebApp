App = Ember.Application.create();


//Page logic
  $("#search").click(function(){
    var txt = $("#searchbar").val();
    $("#results").html(txt);
  });
  $("#showDirs").click(function(){
    $("#results").show();
  });



///Google maps API
 var directionsDisplay;
    var directionsService = google.maps.DirectionsService();
    var westhigh = new google.maps.LatLng(40.774534, -111.900473);
    var testLoc = new google.maps.LatLng(40.773055, -111.882215);
      
      function initialize() {
        //var markers = [];
       
        directionsDisplay = new google.maps.DirectionsRenderer();
        var map = new google.maps.Map($('#map-canvas')[0], {
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var defaultBounds = new google.maps.LatLngBounds(
          westhigh,
          testLoc);
        map.fitBounds(defaultBounds);

        // Create the search box and link it to the UI element.
        var input =($('#searchbar')[0]);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var searchBox = new google.maps.places.Autocomplete(input);
        directionsDisplay.setMap(map);
        google.maps.event.addListener(searchBox, 'place_changed', function() {
        var place = searchBox.getPlace();

          // if (places.length == 0) {
          //   return;
          // }
          // for (var i = 0, marker; marker = markers[i]; i++) {
          //   marker.setMap(null);
          // }

          // For each place, get the icon, place name, and location.
          // not necessary if we are displayRendering
          // markers = [];
          // var bounds = new google.maps.LatLngBounds();
          
          // var image = {
          //   url: place.icon,
          //   size: new google.maps.Size(71, 71),
          //   origin: new google.maps.Point(0, 0),
          //   anchor: new google.maps.Point(17, 34),
          //   scaledSize: new google.maps.Size(25, 25)
          // };

          // // Create a marker for each place.
          // var marker = new google.maps.Marker({
          //   map: map,
          //   icon: image,
          //   title: place.name,
          //   position: place.geometry.location
          // });
          // pos = place.geometry.location;
          // markers.push(marker);

          // bounds.extend(place.geometry.location);
          // bounds.extend(westhigh);
          // map.fitBounds(bounds);
          var request = {
            origin: place.geometry.location,
            destination: westhigh,
            travelMode: google.maps.TravelMode.DRIVING
          };
          directionsService.route(request, function(response, status) {
            $("#results").html("does display");
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
            }
          })
        });
        // [END region_getplaces]

        // Bias the SearchBox results towards places that are within the bounds of the
        // current map's viewport.
        google.maps.event.addListener(map, 'bounds_changed', function() {
          var bounds = map.getBounds();
          searchBox.setBounds(bounds);
        });
        
      }

      google.maps.event.addDomListener(window, 'load', initialize);
App = Ember.Application.create();


//Page logic
  $("#search").click(function(){
    var txt = $("#searchbar").val();
    $("#results").html(txt);
  });
  $("#showDirs").click(function(){
    $("#results").show();
  });


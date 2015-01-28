App = Ember.Application.create();

App.Router.map(function(){
	this.resource('index', {path:'/'}, function(){
		this.route('carbon');
		this.route('carpool');
	});
	this.resource('login');
	this.resource('about')
});


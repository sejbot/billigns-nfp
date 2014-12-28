Router.map(function() {
	this.route('home', {
		path: '/'
	});
	this.route('calendar', {
		path: '/calendar'
	});
	
	this.route('choiceMade', {
		// get parameter via this.params
		path: '/choices/:choice',
		data: function() {
			templateData = {
				'choice': this.params.choice
			};
			return templateData;
		}
	});
});
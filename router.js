Router.map(function() {
	this.route('home', {
		path: '/',
		onBeforeAction: function (pause) {
			var currentBillingsDate = Session.get("billingsDate");
			if (currentBillingsDate === undefined) {
				Session.set("billingsDate", moment().format("YYYY-MM-DD"));
			}
			else {
				Session.set("billingsDate", currentBillingsDate);
			}
			this.next();
        }
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
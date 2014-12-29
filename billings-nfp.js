Billings = new Mongo.Collection('billings');

if (Meteor.isClient) {
	// counter starts at 0
	Session.setDefault("counter", 0);

	UI.registerHelper('getLocalChoice', function(key) {
		var choices = {
			'dry': 'Torrt',
			'thread': 'Segt, tråddragande',
			'sticky': 'Klibbigt',
			'period': 'Mens',
			'spotty': 'Lite blödning'
		};
		var localChoice = choices[key];
		if (localChoice === undefined) {
			localChoice = key;
		}

		return localChoice;
	});

	UI.registerHelper('date', function() {
		return Session.get('date');
	});

	Template.home.helpers({
		todaysDay: function() {
			return moment(Session.get("billingsDate"), "YYYY-MM-DD").format('D');
		},
		todaysMonth: function() {
			return moment(Session.get("billingsDate"), "YYYY-MM-DD").format('MMMM');
		}
	});

	Template.choiceMade.events({
		'submit .choice-info': function(event) {
			event.preventDefault();
			var choice = $(event.target).find('input:hidden[name=choice]').val();
			var hadSex = $(event.target).find('input:radio[name=haveYouHadSex]:checked').val();
			var comment = $(event.target).find('textarea').val();
			var date = Session.get("billingsDate");
			var existingEntry = Billings.findOne({id: moment().format('YYYYMD')});

			var newEntry = {
				id: date,
				createdAt: new Date(),
				date: date,
				choice: choice,
				hadSex: hadSex,
				comment: comment
			};


			if (existingEntry === undefined) {
				Billings.insert(newEntry);
			}
			else {
				Billings.update(
						{_id: existingEntry._id},
				{
					$set:
							{
								id: newEntry.id,
								createdAt: newEntry.createdAt,
								date: newEntry.date,
								choice: newEntry.choice,
								hadSex: newEntry.hadSex,
								comment: newEntry.comment
							}
				}
				);
			}
			Session.set("billingsDate", moment().format("YYYY-MM-DD"));
			Router.go('/calendar');
			return false;
		}
	});

	Template.calendar.helpers({
		options: function() {
			var billings = Billings.find().fetch();
			var colors = {
				'dry': 'green',
				'thread': 'white',
				'sticky': 'yellow',
				'period': 'red',
				'spotty': 'pink'
			};
			return {
				defaultView: 'month',
				dayRender: function(date, cell) {
					var formattedDate = date.format('YYYY-MM-DD');
					var billingsForDate = _.where(billings, {'date': formattedDate});
					if (billingsForDate.length > 0) {
						var entry = billingsForDate[0];
						color = colors[entry.choice];
						cell.css("background-color", color);
					}
				},
				dayClick: function(date, jsEvent, view) {
					Session.set("billingsDate",date.format("YYYY-MM-DD"));
					Router.go("/");
				}
			};
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function() {
		// code to run on server at startup
	});
}

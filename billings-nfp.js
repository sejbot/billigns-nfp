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

	Template.home.helpers({
		todaysDay: function() {
			return moment().format('D');
		},
		todaysMonth: function() {
			return moment().format('MMMM');
		}
	});

	Template.choiceMade.events({
		'submit .choice-info': function(event) {
			event.preventDefault();
			var choice = $(event.target).find('input:hidden[name=choice]').val();
			var hadSex = $(event.target).find('input:radio[name=haveYouHadSex]:checked').val();
			var comment = $(event.target).find('textarea').val();
			var existingEntry = Billings.findOne({id: moment().format('YYYYMD')});

			var newEntry = {
				id: moment().format('YYYYMD'),
				createdAt: new Date(),
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
								choice: newEntry.choice,
								hadSex: newEntry.hadSex,
								comment: newEntry.comment
							}
				}
				);
			}

			Router.go('/calendar');
			return false;
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function() {
		// code to run on server at startup
	});
}

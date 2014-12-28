Billings = new Mongo.Collection('billings');

Billings.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return true;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return true;
  },
  
});

Billings.deny({
  update: function (userId, docs, fields, modifier) {
    // can't change owners
    return false;
  },
  remove: function (userId, doc) {
    // can't remove locked documents
    return false;
  },
});

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
			console.log(choice);
			var hadSex = $(event.target).find('input:radio[name=haveYouHadSex]:checked').val();
			console.log(hadSex);
			var comment = $(event.target).find('textarea').val();
			console.log(comment);

			Billings.upsert({
				id: moment().format('YYYYMD')
			},
			{
				id: moment().format('YYYYMD'),
				createdAt: new Date(),
				choice: choice,
				hadSex: hadSex,
				comment: comment
			}
			);

			//Router.go('/calendar');
			return false;
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function() {
		// code to run on server at startup
	});
}

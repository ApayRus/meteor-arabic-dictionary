Meteor.startup(() => {
      Meteor.publish('user', function(id) {
        return Meteor.users.find({_id: id}, {username: 1});
    });

      Meteor.publish('users', function() {
        return Meteor.users.find({});
    });    
});
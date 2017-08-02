import {Meteor} from 'meteor/meteor'

Template.UsersList.helpers({
  users() {
    const users = Meteor.users.find({ }, { fields:{createdAt: 1, username: 1}});
    return users
  }, 
}); 
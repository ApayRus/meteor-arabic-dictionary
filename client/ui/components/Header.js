Template.Header.helpers({
  isAdmin() {
    return Meteor.userId() == "ghZegnrrKqnNFaFxb"; //Roles.userIsInRole(loggedInUser, ['admin'])
  }
});

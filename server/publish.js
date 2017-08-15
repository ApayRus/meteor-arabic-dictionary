import { Articles } from '/imports/api/articles.js';
import { Events } from '/imports/api/events.js';

Meteor.startup(() => {
      Meteor.publish('user', function(id) {
        return Meteor.users.find({_id: id}, {username: 1});
    });

      Meteor.publish('users', function() {
        return Meteor.users.find({});
    });
    Meteor.publish('articles', function() {
      return Articles.find();
    });

    Meteor.publish('articleSingle', function(id) {
      return Articles.find({_id: id});
    });
    
    Meteor.publish('articlesSearchResult', function(searchFor) {
      return Articles.find( { 
                            "words.word" : new RegExp(searchFor),
                            deleted: {$ne: true},
                            published: {$ne: false},
                          }, 
      { limit: 50 } );
    });

    Meteor.publish('events.startIndex.endIndex', function(startIndex, endIndex) {
      return Events.find( {}, {skip: startIndex, limit: endIndex, sort: {happenedAt: -1}});
    });



});
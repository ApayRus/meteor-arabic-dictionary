import { Articles } from '/imports/api/articles.js';
import { Events } from '/imports/api/events.js';

Meteor.startup(() => {
      Meteor.publish('user', function(id) {
        return Meteor.users.find({_id: id}, {username: 1});
    });

      Meteor.publish('users', function() {
        return Meteor.users.find({});
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

    Meteor.publish('articles', function(startIndex, endIndex) {

      return Articles.find( { deleted: {$ne: true},
                              published: {$ne: false},
                            }, 
                            { skip: startIndex, 
                              limit: endIndex-startIndex, 
                              sort: { createdAt: 1, _id: 1 } });
    });

    Meteor.publish('articlesWithActiveCorrections', function(startIndex, endIndex) {

      return Articles.find( { 
                              corrections: {$gt: {$size: 0}}
                            }, 
                            { skip: startIndex, 
                              limit: endIndex-startIndex, 
                              sort: { editedAt: 1 } });
    });

    Meteor.publish('events.startIndex.endIndex', function(startIndex, endIndex) {
      return Events.find( {}, {skip: startIndex, limit: endIndex-startIndex, sort: {happenedAt: -1}});
    });



});
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Events = new Mongo.Collection('events');

Meteor.methods({
    'events.insert'(doc) {
        check(doc, Object); 
        Events.insert(doc);
    }
})
import { Events } from '/imports/api/events.js';

Template.EventsBlock.onCreated(function(){
/*    var self = this;
    var id = FlowRouter.getParam('id');
    self.autorun(function(){
        self.subscribe("articleSingle", id);
    });*/
    Meteor.subscribe('events.startIndex.endIndex', 0, 12); 
});

Template.EventsBlock.helpers({
    events() {
        return Events.find({}, {sort: {happenedAt: -1}})
    },
});
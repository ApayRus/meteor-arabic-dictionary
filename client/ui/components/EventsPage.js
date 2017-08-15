import { Events } from '/imports/api/events.js';

Template.EventsPage.onCreated(function(){

    var self = this; 
    self.autorun(function(){
        const startIndex = parseInt(FlowRouter.getParam('startIndex'));
        const endIndex = parseInt(FlowRouter.getParam('endIndex'));
        self.subscribe('events.startIndex.endIndex', startIndex, endIndex);
        
    });
});

Template.EventsPage.helpers({
    events() {
        return Events.find({}, {sort: {happenedAt: -1}})
    },
});
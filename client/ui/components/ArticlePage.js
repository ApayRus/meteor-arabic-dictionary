import { Articles } from '/imports/api/articles.js';

/*Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});*/

Template.ArticlePage.onCreated(function(){
    var self = this;
    var id = FlowRouter.getParam('id');
    self.autorun(function(){
        self.subscribe("articleSingle", id);
    });
    //Meteor.subscribe('articles'); 
});

Template.ArticlePage.helpers({
    article() {
        const id = FlowRouter.getParam('id');
        return Articles.findOne({'_id': id});
    }, 
});

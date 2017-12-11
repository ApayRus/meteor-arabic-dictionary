import { Articles } from "/imports/api/articles.js";

Template.ArticlesPage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    const startIndex = parseInt(FlowRouter.getParam("startIndex"));
    const endIndex = parseInt(FlowRouter.getParam("endIndex"));
    self.subscribe("articles", startIndex, endIndex);
  });
});

Template.ArticlesPage.helpers({
  articles() {
    const articles = Articles.find({});
    return articles;
  }
});

/*Template.ArticlesPage.events({
    'submit'(event, instance){
        event.preventDefault();
        let searchFor = event.target.searchFor.value;  
        FlowRouter.go('search', { searchFor });

    }, 
});*/

import { Articles } from "/imports/api/articles.js";

Template.ArticlesCorrectionsPage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    const startIndex = parseInt(FlowRouter.getParam("startIndex"));
    const endIndex = parseInt(FlowRouter.getParam("endIndex"));
    self.subscribe("articlesWithActiveCorrections", startIndex, endIndex);
  });
});

Template.ArticlesCorrectionsPage.helpers({
  result() {
    const articles = Articles.find({
      $or: [
        { corrections: { $gt: { $size: 0 } }, deleted: { $ne: true } },
        { published: false, deleted: { $ne: true } }
      ]
    });
    console.log("result.articles", articles);
    const count = articles.count();
    return { articles, count };
  }
});

/*Template.ArticlesPage.events({
    'submit'(event, instance){
        event.preventDefault();
        let searchFor = event.target.searchFor.value;  
        FlowRouter.go('search', { searchFor });

    }, 
});*/

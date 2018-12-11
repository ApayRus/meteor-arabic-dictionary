import { Articles } from "/imports/api/articles.js";

Template.ArticlesPage.onCreated(function() {
  this.articleIds = new ReactiveVar([]);
});

Template.ArticlesPage.helpers({
  articles() {
    const articleIds = Template.instance().articleIds.get();
    const articles = Articles.find({ _id: { $in: articleIds } }).fetch();

    return articles;
  }
});

Template.ArticlesPage.events({
  "click .showArticles"(event, template) {
    const articleIds = $("#articleIds")
      .val()
      .split("\n")
      .map(elem => elem.trim());
    console.log(articleIds);
    template.articleIds.set(articleIds);
    template.autorun(function() {
      template.subscribe("articlesByIds", articleIds);
    });
  }
});

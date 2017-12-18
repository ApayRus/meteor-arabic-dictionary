import { Articles } from "/imports/api/articles.js";
import { arabicWordToRegExPatern } from "/imports/regexPatterns";

Template.Search.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.searchFor = FlowRouter.getParam("searchFor");
    if (self.searchFor) {
      self.searchFor = arabicWordToRegExPatern(self.searchFor).source;
      self.subscribe("articlesSearchResult", self.searchFor);
    }
  });
});

Template.Search.events({
  submit(event, instance) {
    event.preventDefault();
    let searchFor = event.target.searchFor.value.trim();
    FlowRouter.go("search", { searchFor });
  }
});

Template.Search.helpers({
  result() {
    const template = Template.instance();
    const searchFor = new RegExp(template.searchFor);
    const articles = Articles.find({
      "words.word": searchFor,
      deleted: { $ne: true },
      published: { $ne: false }
    });
    const count = articles.count();
    return { articles, count };
  },
  searchFor() {
    return FlowRouter.getParam("searchFor");
  }
});

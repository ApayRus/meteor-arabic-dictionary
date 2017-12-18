import { Articles } from "/imports/api/articles.js";
import { arabicWordToRegExPatern } from "/imports/regexPatterns";

Template.rootTag.onCreated(function() {
  var self = this;
  this.rootTag = new ReactiveVar("xyz");
  self.autorun(function() {
    /*     if (this.searchFor) {
      //const regexp_searchFor = arabicWordToRegExPatern(searchFor);
      //self.subscribe("articlesSearchResult", regexp_searchFor.source);
      //   self.subscribe("articlesSearchResult", searchFor);
    } */
  });
});

Template.rootTag.helpers({
  roots() {
    const template = Template.instance();
    const searchFor = new RegExp(template.rootTag.get());
    const articles = Articles.find(
      {
        "words.word": searchFor,
        deleted: { $ne: true },
        published: { $ne: false }
      },
      { limit: 5 }
    );
    /*     const count = articles.count();
    console.log("template.rootTag", template.rootTag.get());
    console.log("articles", articles); */
    return articles;
  }
});

Template.rootTag.events({
  "keydown #rootTag"(event, template) {
    setTimeout(() => {
      template.rootTag.set(arabicWordToRegExPatern(event.target.value).source);
      Meteor.subscribe("articlesSearchResult", template.rootTag.get());
      //   console.log("template.searchFor", template.searchFor);
    }, 100);
  }
});

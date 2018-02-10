import { Articles } from "/imports/api/articles.js";
import { arabicWordToRegExPatern } from "/imports/regexPatterns";

Template.rootTag.onCreated(function() {
  var self = this;
  this.rootResults = new ReactiveVar([]);
  this.rootInput = new ReactiveVar("xyz");
  this.rootId = new ReactiveVar(this.data.rootId);
  //   console.log('this.data.rootId',this.data.rootId)
  this.isEditMode = new ReactiveVar(false);
});

Template.rootTag.helpers({
  roots() {
    const template = Template.instance();
    let searchFor = template.rootInput.get();
    // if (!searchFor.trim()) return [];
    searchFor = new RegExp(template.rootInput.get());
    const articles = Articles.find(
      {
        "words.word": searchFor,
        deleted: { $ne: true },
        published: { $ne: false }
      },
      { limit: 5 }
    );

    return articles;
  },
  root() {
    const template = Template.instance();
    const id = template.rootId.get();
    const article = Articles.findOne({ _id: id });
    return { id, article };
  },
  isEditMode() {
    return Template.instance().isEditMode.get();
  }
});

Template.rootTag.events({
  "keydown #rootInput"(event, template) {
    template.isEditMode.set(true);
    setTimeout(() => {
      template.rootInput.set(
        arabicWordToRegExPatern(event.target.value).source
      );
      Meteor.subscribe("articlesSearchResult", template.rootInput.get());
      //console.log("template.rootInput.get()", template.rootInput.get());
    }, 100);
  },
  "blur #rootInput"(event, template) {
    setTimeout(() => template.isEditMode.set(false), 200);
  },
  "click .rootTagsList li"(event, template) {
    // console.log("click rootTagsList li", event.target.dataset.id);
    template.data.rootId = event.currentTarget.dataset.id;
    template.rootId.set(template.data.rootId);
    template.isEditMode.set(false);
  }
});

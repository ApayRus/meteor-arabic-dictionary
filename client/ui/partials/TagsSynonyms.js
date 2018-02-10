import { Articles } from "/imports/api/articles.js";
//import { Subjects } from "/imports/api/subjects.js";
import { arabicWordToRegExPatern } from "/imports/regexPatterns";

Template.TagsSynonyms.onCreated(function() {
  this.tagInput = new ReactiveVar("xyz");
  if (this.data.synonyms == undefined) this.data.synonyms = [];
  this.tagIds = new ReactiveVar(this.data.synonyms);
  this.isEditMode = new ReactiveVar(false);
});

Template.TagsSynonyms.helpers({
  tagsAutocomplete() {
    const template = Template.instance();
    let searchFor = template.tagInput.get();
    const selectedTagIds = template.tagIds.get();
    searchFor = new RegExp(template.tagInput.get());
    const tagsAutocomplete = Articles.find(
      {
        "words.word": searchFor,
        deleted: { $ne: true },
        published: { $ne: false }
      },
      { limit: 5 }
    );

    return tagsAutocomplete;
  },
  tags() {
    const template = Template.instance();
    const ids = template.tagIds.get();
    const tags = [];
    let tagsUnordered = Articles.find({ _id: { $in: ids } }).fetch();
    // эта шляпа выше возвращает массив в смешанном порядке, поэтому их надо заново упорядочить
    ids.forEach(tagId => {
      tags.push(
        tagsUnordered.filter(elem => {
          return elem._id == tagId;
        })[0]
      );
    });
    return tags;
  },
  isEditMode() {
    return Template.instance().isEditMode.get();
  }
});

Template.TagsSynonyms.events({
  "keydown .synonyms .tagInput"(event, template) {
    template.isEditMode.set(true);
    setTimeout(() => {
      template.tagInput.set(arabicWordToRegExPatern(event.target.value).source);
      Meteor.subscribe("articlesSearchResult", template.tagInput.get());
      console.log("template.tagInput.get()", template.tagInput.get());
    }, 100);
  },
  "blur .synonyms .tagInput"(event, template) {
    setTimeout(() => template.isEditMode.set(false), 200);
  },
  "click .tagsList .existingTag"(event, template) {
    let tagId = event.currentTarget.dataset.id;
    addTag(tagId, template);
  },
  /*   "click .tagsList #createTag"(event, template) {
    Meteor.call(
      "subjects.insert",
      {
        title: template.tagInput.get()
      },
      (error, result) => {
        if (error) console.log("не получилось создать тэг", error);
        let tagId = result;
        addTag(tagId, template);
      }
    );
  }, */
  "click .tag .-remove"(event, template) {
    const tagId = +event.currentTarget.dataset.tagid;
    template.data.synonyms.splice(tagId, 1);
    template.tagIds.set(template.data.synonyms);
  }
});

function addTag(tagId, template) {
  template.data.synonyms.push(tagId);
  template.tagIds.set(template.data.synonyms);
  template.isEditMode.set(false);
}

import { Articles } from "/imports/api/articles.js";
import { arabicWordToRegExPattern } from "/imports/regexPatterns";

Template.TagsRoots.onCreated(function() {
  this.tagInput = new ReactiveVar("xyz");
  if (this.data.roots == undefined) this.data.roots = [];
  this.tagIds = new ReactiveVar(this.data.roots);
  this.isEditMode = new ReactiveVar(false);
});

Template.TagsRoots.helpers({
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

Template.TagsRoots.events({
  "keydown .roots .tagInput"(event, template) {
    template.isEditMode.set(true);
    setTimeout(() => {
      template.tagInput.set(arabicWordToRegExPattern(event.target.value).source);
      Meteor.subscribe("articlesSearchResult", template.tagInput.get());
    }, 100);
  },
  "blur .roots .tagInput"(event, template) {
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
    template.data.roots.splice(tagId, 1);
    template.tagIds.set(template.data.roots);
  }
});

function addTag(tagId, template) {
  template.data.roots.push(tagId);
  template.tagIds.set(template.data.roots);
  template.isEditMode.set(false);
}

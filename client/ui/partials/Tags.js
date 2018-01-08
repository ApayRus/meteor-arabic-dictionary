import { Articles } from "/imports/api/articles.js";
import { Subjects } from "/imports/api/subjects.js";

Template.Tag.onCreated(function() {
  var self = this;
  this.tagResults = new ReactiveVar([]);
  this.tagInput = new ReactiveVar("xyz");
  if (this.data.subjects == undefined) this.data.subjects = [];
  // this.data.subjects = this.data.subjects != undefined ? this.data.subjects : [];
  this.tagIds = new ReactiveVar(this.data.subjects);
  //   console.log('this.data.rootId',this.data.rootId)
  this.isEditMode = new ReactiveVar(false);
});

Template.Tag.helpers({
  tagsAutocomplete() {
    const template = Template.instance();
    let searchFor = template.tagInput.get();
    // if (!searchFor.trim()) return [];
    searchFor = new RegExp(template.tagInput.get(), "i");
    const tagsAutocomplete = Subjects.find(
      {
        title: searchFor,
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
    let tagsUnordered = Subjects.find({ _id: { $in: ids } }).fetch(); // эта шляпа возвращает массив в смешанном порядке, поэтому их надо заново упорядочить
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

Template.Tag.events({
  "keydown #tagInput"(event, template) {
    template.isEditMode.set(true);
    setTimeout(() => {
      template.tagInput.set(event.target.value);
      Meteor.subscribe("subjects");
      console.log("template", template);
    }, 100);
  },
  "blur #tagInput"(event, template) {
    setTimeout(() => template.isEditMode.set(false), 200);
  },
  "click .tagsList li"(event, template) {
    // console.log("click rootTagsList li", event.target.dataset.id);
    template.data.subjects.push(event.currentTarget.dataset.id);
    console.log("template.data.subjects:", template.data.subjects);
    template.tagIds.set(template.data.subjects);
    console.log("template.tagIds:", template.tagIds.get());
    template.isEditMode.set(false);
  },
  "click .tag .-remove"(event, template) {
    // console.log("tagId for delete", event.currentTarget.dataset.tagid);
    const tagId = +event.currentTarget.dataset.tagid;
    template.data.subjects.splice(tagId, 1);
    template.tagIds.set(template.data.subjects);
  }
});

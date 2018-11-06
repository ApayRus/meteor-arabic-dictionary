import { Subjects } from "/imports/api/subjects.js";

Template.TagsSubjects.onCreated(function() {
  this.tagInput = new ReactiveVar("xyz");
  // this.data.elementName = "translations.5.translation"
  //name="translations.6.examples.0"
  const elemNameArray = this.data.elementName.split(".");
  const translationId = elemNameArray[1];

  const templateData = this.data.parentTemplateInstance.data; //ссылка на объект статьи, куда мы будем записывать изменения subjects
  this.subjects = [];
  if (elemNameArray.length == 3) {
    this.subjects = templateData.translations[translationId].subjects;
  } else if (elemNameArray.length == 4) {
    const exampleId = elemNameArray[3];
    this.subjects = templateData.translations[translationId].examples[exampleId].subjects;
  }
  this.tagIds = new ReactiveVar(this.subjects);
  this.isEditMode = new ReactiveVar(false);
});

Template.TagsSubjects.helpers({
  tagsAutocomplete() {
    const template = Template.instance();
    let searchFor = template.tagInput.get();
    const selectedTagIds = template.tagIds.get();
    searchFor = new RegExp(template.tagInput.get(), "i");
    const tagsAutocomplete = Subjects.find(
      {
        title: searchFor,
        deleted: { $ne: true },
        published: { $ne: false },
        _id: { $nin: selectedTagIds }
      },
      { limit: 5 }
    );

    return tagsAutocomplete;
  },
  tags() {
    const template = Template.instance();
    const ids = template.tagIds.get();
    const tags = [];
    let tagsUnordered = Subjects.find({ _id: { $in: ids } }).fetch();
    // эта шляпа возвращает массив в смешанном порядке, а нам нужен порядок, как их вводили
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

Template.TagsSubjects.events({
  "keydown .subjects .tagInput"(event, template) {
    template.isEditMode.set(true);
    setTimeout(() => {
      template.tagInput.set(event.target.value);
    }, 100);
  },
  "blur .subjects .tagInput"(event, template) {
    setTimeout(() => template.isEditMode.set(false), 200);
  },
  "click .subjects .tagsList .existingTag"(event, template) {
    let tagId = event.currentTarget.dataset.id;
    addTag(tagId, template);
  },
  "click .subjects .tagsList .createTag"(event, template) {
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
  },
  "click .subjects .tag .-remove"(event, template) {
    const tagId = +event.currentTarget.dataset.tagid;
    template.subjects.splice(tagId, 1);
    template.tagIds.set(template.subjects);
  }
});

function addTag(tagId, template) {
  template.subjects.push(tagId);
  template.tagIds.set(template.subjects);
  template.isEditMode.set(false);
}

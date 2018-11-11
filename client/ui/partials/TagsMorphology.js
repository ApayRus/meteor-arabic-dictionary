import { Morphologies } from "/imports/api/morphologies.js";

Template.TagsMorphology.onCreated(function() {
  this.tagInput = new ReactiveVar("xyz");
  // this.data.elementName = "translations.5"
  //name="translations.6.examples.0"
  const templateData = this.data.parentTemplateInstance.data; //ссылка на объект статьи, куда мы будем записывать изменения morphologies
  this.morphologies = templateData.morphologies;
  this.tagIds = new ReactiveVar(this.morphologies);
  this.isEditMode = new ReactiveVar(false);
});

Template.TagsMorphology.helpers({
  tagsAutocomplete() {
    const template = Template.instance();
    let searchFor = template.tagInput.get();
    const selectedTagIds = template.tagIds.get();
    searchFor = new RegExp(template.tagInput.get(), "i");
    const tagsAutocomplete = Morphologies.find(
      {
        title: searchFor,
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
    let tagsUnordered = Morphologies.find({ _id: { $in: ids } }).fetch();
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

Template.TagsMorphology.events({
  "keydown .tagInput"(event, template) {
    template.isEditMode.set(true);
    setTimeout(() => {
      template.tagInput.set(event.target.value);
    }, 100);
  },
  "blur .tagInput"(event, template) {
    setTimeout(() => template.isEditMode.set(false), 200);
  },
  "click .tagsList .existingTag"(event, template) {
    let tagId = event.currentTarget.dataset.id;
    addTag(tagId, template);
  },
  "click .tag .-remove"(event, template) {
    const tagId = +event.currentTarget.dataset.tagid;
    template.morphologies.splice(tagId, 1);
    template.tagIds.set(template.morphologies);
  }
});

function addTag(tagId, template) {
  template.morphologies.push(tagId);
  template.tagIds.set(template.morphologies);
  template.isEditMode.set(false);
}

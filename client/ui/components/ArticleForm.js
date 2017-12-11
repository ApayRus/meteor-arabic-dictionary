import { Articles } from "/imports/api/articles.js";

Template.ArticleForm.onCreated(function() {
  this.reactiveForm = new ReactiveDict();
  Session.set("picture", this.data.picture);
});

Template.ArticleForm.helpers({
  article() {
    //newWords, newTranslations - это добавление имен к элементам формы,
    //по которым можно будет отслеживать все изменения в форме
    let newWords = this.words.map((elem, index) => {
      return { note: elem.note, word: elem.word, wordId: `words.${index}` };
    });
    let newTranslations = this.translations
      ? this.translations.map((elem, index) => {
          return {
            translation: elem.translation,
            translationId: `translations.${index}.translation`,
            examples: elem.examples
              ? elem.examples.map((elem2, index2) => {
                  return {
                    example: elem2.example,
                    translation: elem2.translation,
                    exampleId: `translations.${index}.examples.${index2}`
                  };
                })
              : []
          };
        })
      : [];

    this.words = newWords;
    this.translations = newTranslations;
    this.picture = Session.get("picture");
    Template.instance().reactiveForm.set("article", this);
    const article = Template.instance().reactiveForm.get("article");
    return article;
  },
  deleted() {
    return this.deleted ? "checked" : "";
  },
  showMiddleHarakat(speachPart, index) {
    return speachPart == "глагол, I порода" && index == 0;
  },
  picture() {
    return Session.get("picture");
  }
});

Template.ArticleForm.events({
  "click .add-word"(event, template) {
    event.preventDefault();
    addWord(template);
  },
  "click .add-translation"(event, template) {
    event.preventDefault();
    addTranslation(template);
  },
  "click .add-example"(event, template) {
    event.preventDefault();
    addExample(event, template);
  },
  "change .editField input"(event, template) {
    changeTemplateData(event, template);
  },
  "click .remove-word"(event, template) {
    removeWord(event, template);
  },
  "click .remove-translation"(event, template) {
    removeTranslation(event, template);
  },
  "click .remove-example"(event, template) {
    removeExample(event, template);
  },
  "click .article-save"(event, template) {
    event.preventDefault();
    const doc = { _id: "", modifier: { $set: {} } };
    doc._id = template.data._id;
    //we call ArticleSchema.clean - for set AutoValues like editedBy, editedAt etc
    template.data = ArticleSchema.clean(template.data);
    delete template.data["corrections"];
    //console.log('template.data', template.data)
    doc.modifier.$set = template.data;

    //doc.modifier.$set delete
    Meteor.call("articles.update", doc);
    Session.set("showEditFormForArticle", ""); // after saving we hide the edit form
  },
  "click .article-edit-cancel"(event, template) {
    event.preventDefault();
    Session.set("showEditFormForArticle", ""); // after saving we hide the edit form
  }
  /*     'change select'(event, template){
        console.log('change select', event.target)
    }     */
});

/* Template.SpeachParts.events({
    'change .speachPart': function(event, template){
        console.log('change select', event.target)
    }
}) */

function changeTemplateData(event, template) {
  //all possible events names:
  //words.0.note
  //words.0.word
  //translations.0.translation
  //translations.0.examples.0.example
  //translations.0.examples.0.translation
  const eventArray = event.target.name.split(".");
  if (eventArray.length == 3) {
    template.data[eventArray[0]][parseInt(eventArray[1])][eventArray[2]] =
      event.target.value;
  } else if (eventArray.length == 5) {
    template.data[eventArray[0]][parseInt(eventArray[1])][eventArray[2]][
      parseInt(eventArray[3])
    ][eventArray[4]] =
      event.target.value;
  }
  template.reactiveForm.set("article", template.data);
}

function addTranslation(template) {
  template.data.translations.push({ translation: "", examples: [] });
  template.reactiveForm.set("article", template.data);
}

function addWord(template) {
  template.data.words.push({ note: "", word: "" });
  template.reactiveForm.set("article", template.data);
}

function addExample(event, template) {
  //event.target.id: addExampleFor.translations.0.translation
  const eventArray = event.target.id.split(".");
  const translationIndex = parseInt(eventArray[2]);
  //console.log("template.data.before", template.data)
  template.data.translations[translationIndex].examples.push({
    example: "",
    translation: ""
  });
  template.reactiveForm.set("article", template.data);
  //console.log("template.data", template.data)
}

function removeWord(event, template) {
  //id="remove.words.0"
  const eventArray = event.target.id.split(".");
  const wordIndex = parseInt(eventArray[2]);
  template.data.words.splice(wordIndex, 1);
  template.reactiveForm.set("article", template.data);
}

function removeTranslation(event, template) {
  //id="remove.translations.0.translation"
  const eventArray = event.target.id.split(".");
  const translationIndex = parseInt(eventArray[2]);
  template.data.translations.splice(translationIndex, 1);
  template.reactiveForm.set("article", template.data);
}

function removeExample(event, template) {
  //id="remove.translations.3.examples.0"
  const eventArray = event.target.id.split(".");
  const translationIndex = parseInt(eventArray[2]);
  const exampleIndex = parseInt(eventArray[4]);
  template.data.translations[translationIndex].examples.splice(exampleIndex, 1);
  template.reactiveForm.set("article", template.data);
}

import { Articles } from "/imports/api/articles.js";

Template.ArticleForm.onCreated(function() {
  this.reactiveForm = new ReactiveDict();
  Session.set("picture", this.data.picture);
});

Template.ArticleForm.helpers({
  article() {
    //сами данные статьи передаются ей как контекст.
    //newWords, newTranslations - это добавление имен к элементам формы,
    //по которым можно будет отслеживать все изменения в форме
    let newWords = this.words.map((elem, index) => {
      return { note: elem.note, word: elem.word, wordId: `words.${index}` };
    });
    let newTranslations = this.translations
      ? this.translations.map((elem, index) => {
          return {
            translation: elem.translation,
            id: `translations.${index}`,
            examples: elem.examples
              ? elem.examples.map((elem2, index2) => {
                  return {
                    example: elem2.example,
                    translation: elem2.translation,
                    id: `translations.${index}.examples.${index2}`,
                    subjects: elem2.subjects || [],
                    images: elem2.images
                      ? elem2.images.map((elem3, index3) => {
                          return {
                            image: elem3.image,
                            imageId: `translations.${index}.examples.${index2}.images.${index3}`
                          };
                        })
                      : []
                  };
                })
              : [],
            images: elem.images
              ? elem.images.map((elem4, index4) => {
                  return {
                    image: elem4.image,
                    imageId: `translations.${index}.images.${index4}`
                  };
                })
              : [],
            subjects: elem.subjects || []
          };
        })
      : [];

    this.words = newWords;
    this.translations = newTranslations;
    this.morphologies = this.morphologies || [];
    //this.picture = Session.get("picture");
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
  templateInstance() {
    //we'll pass it to Tags template
    return Template.instance();
  }
});

Template.TranslationItem.helpers({
  replaceDot(string) {
    const output = string.replace(/\./g, "-");
    console.log("replaceDot", output);
    return output;
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
  "click .add-image"(event, template) {
    event.preventDefault();
    addImage(event, template);
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
  "click .remove-image"(event, template) {
    event.preventDefault();
    removeImage(event, template);
  },
  "click .article-save"(event, template) {
    event.preventDefault();
    const doc = { _id: "", modifier: { $set: {} } };
    doc._id = template.data._id;
    //we call ArticleSchema.clean - for set AutoValues like editedBy, editedAt etc
    template.data = ArticleSchema.clean(template.data);
    delete template.data["corrections"];

    doc.modifier.$set = template.data;
    console.log("template PARENT", template);

    //if this is updating of existing doc
    if (doc._id) Meteor.call("articles.update", doc);
    else {
      Meteor.call("articles.insert", doc, function(err, newDocId) {
        $("#modalAddArticle").modal("hide");
      });
    }

    Session.set("showEditFormForArticle", ""); // after saving we hide the edit form
    template.find("form").reset();
  },
  "click .article-edit-cancel"(event, template) {
    event.preventDefault();
    Session.set("showEditFormForArticle", ""); // after saving we hide the edit form
    template.find("form").reset();
  }
});

function changeTemplateData(event, template) {
  //all possible events names:
  //words.0.note
  //words.0.word
  //translations.0.translation
  //translations.0.examples.0.example
  //translations.0.examples.0.translation
  //translations.0.examples.1.images.2.image
  const eventArray = event.target.name.split(".");
  if (eventArray.length == 3) {
    template.data[eventArray[0]][parseInt(eventArray[1])][eventArray[2]] = event.target.value;
  } else if (eventArray.length == 5) {
    template.data[eventArray[0]][parseInt(eventArray[1])][eventArray[2]][parseInt(eventArray[3])][
      eventArray[4]
    ] = event.target.value;
  } else if (eventArray.length == 7) {
    template.data[eventArray[0]][eventArray[1]][eventArray[2]][eventArray[3]][eventArray[4]][
      eventArray[5]
    ][eventArray[6]] = event.target.value;
  }
  console.log("changeTemplateData", template.data);
  template.reactiveForm.set("article", template.data);
  console.log("template.data", template.data);
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
  const eventArray = event.target.id.split(".");
  const translationIndex = parseInt(eventArray[2]);
  template.data.translations[translationIndex].examples.push({
    example: "",
    translation: ""
  });
  template.reactiveForm.set("article", template.data);
}

function addImage(event, template) {
  console.log("event.target", event.target);
  console.log("template", template);

  //id="addImageFor.translations.0.examples.0"
  //id="addImageFor.translations.0
  const eventArray = event.target.id.split(".");
  const translationIndex = +eventArray[2];
  if (eventArray.length == 3) {
    template.data.translations[translationIndex].images.push({ image: "" });
  } else if (eventArray.length == 5) {
    const exampleIndex = +eventArray[4];
    template.data.translations[translationIndex].examples[exampleIndex].images.push({ image: "" });
  }
  template.reactiveForm.set("article", template.data);
}

function removeWord(event, template) {
  //id="remove.words.0"
  const eventArray = event.target.id.split(".");
  const wordIndex = parseInt(eventArray[2]);
  template.data.words.splice(wordIndex, 1);
  template.reactiveForm.set("article", template.data);
}

function removeTranslation(event, template) {
  //this handler is for both: remove translation and example
  //id="remove.translations.0"
  //id ="remove.translations.0.examples.6"
  const eventArray = event.target.id.split(".");
  if (eventArray.length == 3) {
    const translationIndex = parseInt(eventArray[2]);
    template.data.translations.splice(translationIndex, 1);
    template.reactiveForm.set("article", template.data);
  }
  if (eventArray.length == 5) {
    const translationIndex = parseInt(eventArray[2]);
    const exampleIndex = parseInt(eventArray[4]);
    template.data.translations[translationIndex].examples.splice(exampleIndex, 1);
    template.reactiveForm.set("article", template.data);
  }
}

/* function removeExample(event, template) {
  //id="remove.translations.3.examples.0"
  const eventArray = event.target.id.split(".");
  const translationIndex = parseInt(eventArray[2]);
  const exampleIndex = parseInt(eventArray[4]);
  template.data.translations[translationIndex].examples.splice(exampleIndex, 1);
  template.reactiveForm.set("article", template.data);
} */

function removeImage(event, template) {
  //id=remove.translations.0.images.0 //length==5
  //id=remove.translations.0.examples.0.images.0 //length==7
  const eventArray = event.target.id.split(".");
  const translationIndex = +eventArray[2];
  if (eventArray.length == 5) {
    const imageIndex = eventArray[4];
    template.data.translations[translationIndex].images.splice(imageIndex, 1);
  } else if (eventArray.length == 7) {
    const exampleIndex = eventArray[4];
    const imageIndex = eventArray[6];
    template.data.translations[translationIndex].examples[exampleIndex].images.splice(
      imageIndex,
      1
    );
  }
  template.reactiveForm.set("article", template.data);
}

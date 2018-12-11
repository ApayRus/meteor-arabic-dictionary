import {
  preformatArticle1,
  preformatArticle2,
  preformatArticle3
} from "../../../imports/parseOldArticle";

Template.ArticleMenu.onCreated(function() {
  this.preformatStep = new ReactiveVar(0);
  //this.preformatTextOfArticle = new ReactiveVar(this.data.plainTextOfArticle); //считали текст статьи, чтобы дальше менять его
});

Template.ArticleMenu.helpers({
  correctionsCount() {
    if (this.corrections)
      if (this.corrections.length > 0) return "Правки: " + this.corrections.length;
      else return "";
  },
  isAdmin() {
    return Meteor.userId() == "ghZegnrrKqnNFaFxb";
  },
  //we show autoCorrection button only if article have only 1 field with translation
  //and haven't examples
  showAutoCorrection() {
    const isExamplesEmpty = () => {
      if (!this.translations[0].examples) return true;
      else {
        if (this.translations[0].examples.length == 0) return true;
      }
    };
    return this.translations.length == 1 && isExamplesEmpty();
  },
  showPreformatStep() {
    return Session.get("showArticleInTextarea") == this._id;
  },
  preformatStep() {
    return Template.instance().preformatStep.get();
  },
  preformatStepInfo() {
    switch (Template.instance().preformatStep.get()) {
      case 1:
        return `
        Проверьте: 
        1) Между переводами - пустая строка. 
        2) Каждый пример на новой строке. 
        3) В арабских примерах нет русских символов. 
        `;
      case 2:
        return `
        Проверьте: 
        1) Каждая строка примеров начинается с اا символов. 
        2) Тильда ~ заменилась на основное слово.
        3) Знаки препинания стоят корректно. 
        `;
      default:
        return "";
    }
  }
});

Template.ArticleMenu.events({
  "click .delete"() {
    Meteor.call("articles.remove", this._id);
  },
  "click .edit"(event) {
    event.preventDefault();
    Session.set("showEditFormForArticle", this._id);
  },
  "click .plainText"(event, template) {
    event.preventDefault();
    Session.get("showArticleInTextarea")
      ? Session.set("showArticleInTextarea", "")
      : Session.set("showArticleInTextarea", this._id);
    template.preformatStep.set(0);
  },
  "click .preformatArticleStep"(event, template) {
    event.preventDefault();
    const step = template.preformatStep;
    step.set(step.get() + 1);
    //template.data. = step.get() + template.preformatTextOfArticle.get();
    const plainTextOfArticle = $("#plainTextForArticle-" + this._id).val();
    currentStep = step.get();
    const word = template.data.words[0].word;
    if (currentStep == 1) var preformatedText = preformatArticle1(plainTextOfArticle);
    if (currentStep == 2) var preformatedText = preformatArticle2(plainTextOfArticle, word);
    if (currentStep == 3) {
      var translationsObject = preformatArticle3(plainTextOfArticle);
      Meteor.call("article.autoCorrection", this._id, translationsObject, this.words);
    }
    $("#plainTextForArticle-" + this._id).val(preformatedText);
    //console.log("preformatedText", preformatedText);
  }
});

Template.ArticleCorrectionMenu.events({
  "click .edit-correction"(event) {
    event.preventDefault();
    Session.set("showEditFormForArticle", this._id);
    // console.log("correction edit button clicked: this", this);
  }
});

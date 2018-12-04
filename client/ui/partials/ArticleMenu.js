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
  }
});

Template.ArticleMenu.events({
  "click .delete"() {
    Meteor.call("articles.remove", this._id);
  },
  "click .autoCorrection"() {
    Meteor.call("article.autoCorrection", this._id, this.translations[0].translation, this.words);
  },
  "click .edit"(event) {
    event.preventDefault();
    Session.set("showEditFormForArticle", this._id);
  },
  "click .plainText"(event) {
    event.preventDefault();
    Session.get("showArticleInTextarea")
      ? Session.set("showArticleInTextarea", "")
      : Session.set("showArticleInTextarea", this._id);
  }
});

Template.ArticleCorrectionMenu.events({
  "click .edit-correction"(event) {
    event.preventDefault();
    Session.set("showEditFormForArticle", this._id);
    // console.log("correction edit button clicked: this", this);
  }
});

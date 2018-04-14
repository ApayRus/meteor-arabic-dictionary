Template.ArticlesList.onCreated(function() {
  Session.set("showEditFormForArticle", "");
});

Template.ArticlesList.helpers({
  showEditForm(articleId) {
    return articleId == Session.get("showEditFormForArticle");
  },
  corrections() {
    if (this.corrections)
      return this.corrections.map(elem => {
        return { ...elem, _id: elem._id + "-by-" + elem.editedByUserName };
      });
    else [];
  }
});

Template.ArticlesList.events({
  "click .correction .btn-success"() {
    let doc_id = this._id.split("-")[0];
    Meteor.call("articles.accept_correction", doc_id, this);
  },
  "click .correction .btn-danger"() {
    let doc_id = this._id.split("-")[0];
    Meteor.call("articles.reject_correction", doc_id, this);
  },
  "click .main-article .btn-success"() {
    let doc_id = this._id.split("-")[0];
    Meteor.call("articles.accept", doc_id, this);
  },
  "click .main-article .btn-danger"() {
    let doc_id = this._id.split("-")[0];
    Meteor.call("articles.reject", doc_id, this);
  }
});

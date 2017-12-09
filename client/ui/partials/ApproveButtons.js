Template.ApproveButtons.events({
  "click .btn-success"() {
    let doc_id = this._id.split("-")[0];
    Meteor.call("articles.accept_correction", doc_id, this);
  },
  "click .btn-danger"() {
    let doc_id = this._id.split("-")[0];
    Meteor.call("articles.reject_correction", doc_id, this);
  }
});

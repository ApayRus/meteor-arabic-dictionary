Template.SubjectTags.onCreated(function() {
  var self = this;
  this.subjectResults = new ReactiveVar([]);
  this.subjectInput = new ReactiveVar("xyz");
  this.subjectIds = new ReactiveVar(this.data.subjects);
  //   console.log('this.data.rootId',this.data.rootId)
  this.isEditMode = new ReactiveVar(false);
});

Template.SubjectTags.events({
  "click #addSubject"(event, template) {
    event.preventDefault();
    const title = $("#subjectInput").val();
    Meteor.call("subjects.insert", { title });
    console.log("event.target.subjectInput.value", $("#subjectInput").val());
  }
});

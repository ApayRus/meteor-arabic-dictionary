import { Articles } from "/imports/api/articles.js";
import { Subjects } from "/imports/api/subjects.js";

Template.ArticlesBySubject.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subjectId = FlowRouter.getParam("subjectId");
    self.subscribe("articlesBySubject", self.subjectId);
    self.subscribe("subjects");
  });
});

Template.ArticlesBySubject.helpers({
  result() {
    const subjectId = Template.instance().subjectId;
    const subject = Subjects.findOne({ _id: subjectId });
    console.log("subject", subject);
    //we find subjects in translations and in examples
    const articles = Articles.find({
      $or: [{ "translations.subjects": subjectId }, { "translations.examples.subjects": subjectId }]
    });
    const count = articles.count();
    return { articles, count, subject };
  }
});

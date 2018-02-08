import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";

export const Subjects = new Mongo.Collection("subjects");

export const SubjectSchema = new SimpleSchema({
  title: {
    type: String,
    label: "title"
  },
  createdAt: {
    type: Date,
    label: "Created At",
    optional: true,
    autoValue() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return new Date();
      }
    }
  },
  createdByUserId: {
    type: String,
    optional: true,
    autoValue() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return Meteor.userId() || "anonymous";
      }
    }
  },
  createdByUserName: {
    type: String,
    optional: true,
    autoValue() {
      let username = "anonymous";
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        if (Meteor.user()) username = Meteor.user().username;
        return username;
      }
    }
  }
});

Subjects.attachSchema(SubjectSchema);

Meteor.methods({
  "subjects.upsert"(doc) {
    check(doc, Object);
    Subjects.upsert(doc);
  },
  "subjects.insert"(doc) {
    check(doc, Object);
    const newDocId = Subjects.insert(doc);
    return newDocId;
  }
});

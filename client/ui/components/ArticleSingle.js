import { Articles } from "/imports/api/articles.js";
import { Subjects } from "/imports/api/subjects.js";
import { transcription, isNotDiacritic } from "/imports/transcription.js";

Template.ArticleSingle.onCreated(function() {
  Meteor.subscribe("subjects");
  Meteor.subscribe("articlesByIds", this.data.synonyms);
  Meteor.subscribe("articlesByIds", this.data.roots);
});

Template.ArticleSingle.helpers({
  showApproveButtons() {
    return (
      Meteor.userId() == "ghZegnrrKqnNFaFxb" && //Roles.userIsInRole(loggedInUser, ['admin'])
      this.published === false &&
      this.deleted !== true
    );
  },
  notPublished() {
    return this.published === false;
  },
  isMiddleHarakat(middleHarakat, index) {
    return middleHarakat && index == 0;
  },
  image() {
    const image = Images.findOne({ _id: this.picture });
    return image;
  },
  imageJSON() {
    const image = Images.findOne({ _id: this.picture });
    image0 = JSON.stringify(image.fetch());
    return image0;
  },
  examplesCount(examples) {
    if (examples) return examples.length;
    else return 0;
  },
  transcr: function(text) {
    if (text.trim()) return "[ " + transcription(text) + " ]";
  },
  tagsSubjects() {
    const ids = this.subjects;
    const tags = [];
    if (ids) {
      let tagsUnordered = Subjects.find({ _id: { $in: ids } }).fetch(); // эта шляпа возвращает массив в смешанном порядке, поэтому их надо заново упорядочить
      ids.forEach(tagId => {
        tags.push(
          tagsUnordered.filter(elem => {
            return elem._id == tagId;
          })[0]
        );
      });
    }
    return tags;
  },
  /*   tagsSynonyms() {
    const ids = this.synonyms;
    const tags = [];
    if(ids){

    }
    let tagsUnordered = Articles.find({ _id: { $in: ids } }).fetch();
    // эта шляпа { $in: ids } возвращает массив в смешанном порядке, поэтому их надо заново упорядочить
    ids.forEach(tagId => {
      tags.push(
        tagsUnordered.filter(elem => {
          return elem._id == tagId;
        })[0]
      );
    });
    return tags;
  }, */
  tagsRoots() {
    const ids = this.roots;
    const tags = [];
    if (ids) {
      let tagsUnordered = Articles.find({ _id: { $in: ids } }).fetch();
      // эта шляпа { $in: ids } возвращает массив в смешанном порядке, поэтому их надо заново упорядочить
      ids.forEach(tagId => {
        tags.push(
          tagsUnordered.filter(elem => {
            return elem._id == tagId;
          })[0]
        );
      });
    }
    return tags;
  }
});

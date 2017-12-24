/*import { Meteor} from 'meteor/meteor'; 
import { Template } from 'meteor/templating';
import './ArticleSingle.html'; 
import './ArticleUpdate.js'; */
import { Articles } from "/imports/api/articles.js";
import { transcription, isNotDiacritic } from "/imports/transcription.js";
/*Template.ArticleSingle.onCreated(function(){
    Meteor.subscribe("users"); //надо переделать на подписку на 1го человека, автора статьи
});*/

Template.ArticleSingle.helpers({
  /*    showApproveButtons(){
        //console.log("published", this.published)
        //is Admin and article still not published
        return this.published === false && Meteor.userId() == "ghZegnrrKqnNFaFxb"
    },*/
  showApproveButtons() {
    return (
      Meteor.userId() == "ghZegnrrKqnNFaFxb" &&
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
  rootArticle() {
    Meteor.subscribe("articleSingle", this.rootId);
    return Articles.findOne({ _id: this.rootId });
  },
  image() {
    const image = Images.findOne({ _id: this.picture });
    console.log("image", image);
    return image;
  },
  imageJSON() {
    const image = Images.findOne({ _id: this.picture });
    image0 = JSON.stringify(image.fetch());
    return image0;
  },
  examplesCount: function(examples) {
    return examples.length || 0;
  },
  transcr: function(text) {
    if (text.trim()) return "[ " + transcription(text) + " ]";
  }
});

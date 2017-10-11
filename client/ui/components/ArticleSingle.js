/*import { Meteor} from 'meteor/meteor'; 
import { Template } from 'meteor/templating';
import './ArticleSingle.html'; 
import './ArticleUpdate.js'; */
import { Articles } from '/imports/api/articles.js';
import {transcription, isNotDiacritic} from '/imports/transcription.js';
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
        return Meteor.userId() == "ghZegnrrKqnNFaFxb" && this.published === false && this.deleted !== true
    }, 
    notPublished(){
        return this.published === false
    },
    isMiddleHarakat(middleHarakat, index){
        return middleHarakat && index == 0
    },
    image(){
        const image = Images.findOne({_id: this.picture});
        return image
    }, 
    examplesCount : function(examples){
        return (examples.length || 0);
    }, 
    transcr: function(text){
        if (text.trim())
            return '[ '+transcription(text)+' ]';
    }
});

Template.ArticleMenu.helpers({

    correctionsCount(){
        if(this.corrections.length > 0) 
            return "Правки: "+this.corrections.length
        else 
            return ""
    }, 
    isAdmin(){
        return Meteor.userId() == "ghZegnrrKqnNFaFxb"
    },
    //we show autoCorrection button only if article have only 1 field with translation
    //and haven't examples
    showAutoCorrection(){
        return (
            this.translations.length == 1 && 
            !this.translations[0].examples
        )
    }


});

Template.ArticleMenu.events({ 
    'click .delete'(){
        Meteor.call('articles.remove', this._id);
    },
    'click .autoCorrection'(){
        if(this.translations.length == 1 && !this.translations[0].examples)
         Meteor.call('article.autoCorrection', this._id, this.translations[0].translation, this.words)
        else
            console.log("нельзя применить автоправки, в этой статье уже есть правки")
    }
});
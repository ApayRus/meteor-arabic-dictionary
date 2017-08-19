/*import { Meteor} from 'meteor/meteor'; 
import { Template } from 'meteor/templating';
import './ArticleSingle.html'; 
import './ArticleUpdate.js'; */
import { Articles } from '/imports/api/articles.js';
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
    image(){
        const image = Images.findOne({_id: this.picture});
        return image
    }
});

Template.ArticleMenu.helpers({

    correctionsCount(){
        if(this.corrections) 
            return this.corrections.length
        else 
            return 0
    }, 
    showCorrectionsCount(){
        if(this.corrections)
            return this.corrections.length > 0
    },
    isAdmin(){
        return Meteor.userId() == "ghZegnrrKqnNFaFxb"
    }    

});

Template.ArticleMenu.events({ 
    'click .delete'(){
        Meteor.call('articles.remove', this._id);
    },
});
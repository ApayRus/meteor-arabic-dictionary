/*import { Meteor} from 'meteor/meteor'; 
import { Template } from 'meteor/templating';
import './ArticleSingle.html'; 
import './ArticleUpdate.js'; */
import { Articles } from '/imports/api/articles.js';

Template.ArticleSingle.onCreated(function(){
    Meteor.subscribe("users"); //надо переделать на подписку на 1го человека, автора статьи
});

Template.ArticleSingle.helpers({
    author() { 
        return Meteor.users.findOne({_id:this.createdBy}, { fields:{username:1} }).username;
        
    },
});

Template.ArticleSingle.events({ 
    'click .delete'(){
        Articles.remove(this._id); 
    }, 
});
/*import { Meteor} from 'meteor/meteor'; 
import { Template } from 'meteor/templating';
import './ArticleSingle.html'; 
import './ArticleUpdate.js'; */
import { Articles } from '/imports/api/articles.js';

Template.ArticleSingle.helpers({
    author() {
        const username = Meteor.users.findOne({_id: this.owner}, {username: 1}).username; 
        return username;
    },
});

Template.ArticleSingle.events({ 
    'click .delete'(){
        Articles.remove(this._id); 
    }, 
});
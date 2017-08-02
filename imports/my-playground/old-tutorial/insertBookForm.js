import { Template } from 'meteor/templating';
import { Words } from '../api/articles.js';
import './NewArticle.html';



Template.NewArticle.helpers({
  articles() {
    return Articles;
  }
});
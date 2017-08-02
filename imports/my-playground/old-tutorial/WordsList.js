import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict'; 
import { Words } from '../api/words.js';
import './word.js';
import './WordsList.html'
import './NewWord.js';

Template.WordsList.onCreated( function bodyOnCreated() {
    this.state = new ReactiveDict(); 
}); 

Template.WordsList.helpers({
    words() {
        const instance = Template.instance(); 
        if (instance.state.get("hideUnchecked")) {
            return Words.find( {checked: true} , {sort: {word: 1}});
        }
        return Words.find({}, {sort: {word: 1}});
    },
    checkedWordsCount() {
        return Words.find({checked: true}).count(); 
    }, 
});

Template.WordsList.events({ 
    'change .hide-unchecked input'(event, instance){
        instance.state.set('hideUnchecked', event.target.checked); 
    }
});

/*Template.body.helpers({
  words: [
    { word: 'Word 1', translation: 'translation 1' },
    { word: 'Word 2', translation: 'translation 2' },
    { word: 'Word 3', translation: 'translation 3' },
  ],
});*/
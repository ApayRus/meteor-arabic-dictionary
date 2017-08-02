import { Template } from 'meteor/templating';

import { Words } from '../api/words.js';
import './NewWord.html';

Template.body.events({
    'submit form'(event){
        event.preventDefault(); 

        const word = event.target.word.value; 
        const translation = event.target.translation.value; 

        Words.insert({
            word, 
            translation, 
            createdAt: new Date(),
        }); 

        event.target.word.value = '';
        event.target.translation.value = ''; 
    },
}); 
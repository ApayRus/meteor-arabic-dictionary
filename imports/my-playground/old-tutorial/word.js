import { Template } from 'meteor/templating'; 
import { Words } from '../api/words.js'; 
import './word.html'; 

Template.word.events({

    'click .toggle-checked'(){

        Words.update( this._id, {
            $set: { checked: !this.checked }
        });
    }, 

    'click .delete'(){
        Words.remove(this._id) 
    }, 
})
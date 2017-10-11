import { Articles } from '/imports/api/articles.js';

Template.Search.onCreated(function(){
    var self = this; 
    self.autorun(function(){
        const searchFor = FlowRouter.getParam('searchFor');
        if(searchFor){
            const regexp_searchFor= arabicWordToRegExPatern(searchFor);
            self.subscribe('articlesSearchResult', regexp_searchFor.source);            
        }
    });
});

Template.Search.events({
    'submit'(event, instance){
        event.preventDefault();
        let searchFor = event.target.searchFor.value.trim();  
        FlowRouter.go('search', { searchFor });

    }, 
}); 

Template.Search.helpers({
  result() {
    const articles = Articles.find({});
    console.log('articles', articles)
    const count = articles.count(); 
    return { articles, count }
  },
  searchFor() {
      return FlowRouter.getParam('searchFor');
  }
});

function arabicWordToRegExPatern(word){
    const haracats = ['َ','ِ','ُ','ً','ٍ','ٌ','ْ']; 
    const haracat = '['+ haracats.join('')+']?';
    const tashdid = '['+ 'ّ' + ']?';

    let regexp_template = word.split("").map(function(letter, index){
        
        //if next simbol or current is haracat we don't need to add [haracat] to regexp
        if( (haracats.indexOf(word[index+1])>-1) || (haracats.indexOf(word[index])>-1) ) {
            return letterAlternatives(letter);
        }
        //we add [haracat] only if after this letter going letter too        
        else 
            return letterAlternatives(letter) + tashdid + haracat;  
    }).join("");

    regexp_template = new RegExp('^' + regexp_template + '$');
    
    return regexp_template
}

//some arabic letters may have alternatives, like alif ا : إ أ آ  and we should change it to group of alts
function letterAlternatives(letter) {
    const alifs = ['ا', 'أ', 'إ', 'آ', 'ى']; 
    const alif = '[' + alifs.join('') + ']';

    if(letter == 'ا')
        return alif
    else 
        return letter
}
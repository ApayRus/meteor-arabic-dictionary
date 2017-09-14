import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker'; 
SimpleSchema.extendOptions(['autoform']);
SimpleSchema.setDefaultMessages({
  initialLanguage: 'ru',
  messages: {
    ru: {
      uploadError: '{{value}}', //File-upload
    },
  }
});
import { Images } from '/imports/api/images.js';

import { Events } from '/imports/api/events.js';


export const Articles = new Mongo.Collection('articles');

// SCHEMES 
WordSchema = new SimpleSchema({
    note: {
        type: String,
        optional: true,
        trim: true,
        label: "примечание",
        autoform: {
            label: false,
            placeholder: "schemaLabel", 
            class: "note"
        }
    },
    word: {
        type: String,
        trim: true,
        label: "словоформа",
        autoform: {
            label: false,
            placeholder: "schemaLabel", 
            class: "word"
        }        
    },    
});

ExampleSchema = new SimpleSchema({
    example: {
        type: String,
        optional: true,
        trim: true,
        label: "пример",
        autoform: {
            label: false,
            placeholder: "schemaLabel", 
            class: "example"
        }        
    }, 
    translation: {
        type: String,
        optional: true,
        trim: true,
        label: "перевод примера",
        autoform: {
            label: false,
            placeholder: "schemaLabel", 
            class: "example-translation"
        }        
    },
});

TranslationSchema = new SimpleSchema({
    translation: {
        type: String,
        label: "Перевод",
        optional: true,
        trim: true,
        autoform: {
            label: false,
            placeholder: "schemaLabel",
            class: "translation"
        }        
    }, 
    examples: {
        type: Array, 
        label: "Examples", 
        optional: true,
        autoform: {
            class: "examples"
        }
    }, 
    'examples.$': ExampleSchema,
});

const SpeachParts = [
      {
        optgroup: "имя",
        options: [
          {label: "Существительное", value: "Существительное"},
          {label: "Прилагательное", value: "Прилагательное"},
          {label: "Наречие", value: "Наречие"}
        ]
      },
      {
        optgroup: "глагол",
        options: [
          {label: "порода I", value: "глагол, I порода"},
          {label: "порода II", value: "глагол, II порода"},
          {label: "порода III", value: "глагол, III порода"},
          {label: "порода IV", value: "глагол, IV порода"},
          {label: "порода V", value: "глагол, V порода"},
          {label: "порода VI", value: "глагол, VI порода"},
          {label: "порода VII", value: "глагол, VII порода"},
          {label: "порода VIII", value: "глагол, VIII порода"},
          {label: "порода IX", value: "глагол, IX порода"},
          {label: "порода X", value: "глагол, X порода"},                             
        ]
      },
      {
        optgroup: "частица",
        options: [
          {label: "частица родительного падежа", value: "частица родительного падежа"},
          {label: "частица винительного падежа", value: "частица винительного подежа"},
        ]
      }      
    ];

ArticleSchema = new SimpleSchema({

    speachPart: {
        type: String,
        optional: true,
        label: false,        
        autoform: {
            options: SpeachParts,
            firstOption: "Часть речи",
        },
    },

    words: {
        type: Array,
        optional: true,
        label: "Словоформы",
        autoform: {
            class: "words"
        }
    }, 
    'words.$': WordSchema,
    
    middleHarakat: {
        type: String,
        optional: true,
        trim: true,
        label: 'Срединная гласная',
    },

    translations: {
        type: Array, 
        label: "Переводы", 
        optional: true,
        autoform: {
            afFieldInput: {
                class: "translations"
            }
        }
    }, 
    'translations.$': TranslationSchema,

    createdAt: {
        type: Date, 
        label: "Created At",
        optional: true, 
        autoValue() {
                if (this.isInsert && (!this.isSet || this.value.length === 0)) {
                    return new Date();
                }
        }, 
        autoform: {
            type: "hidden"
        }            
    },

    editedAt: {
        type: Date, 
        label: "Edited At",
        optional: true, 
        autoValue() {
                    return new Date();
        }, 
        autoform: {
            type: "hidden"
        }            
    },    

    createdByUserId: {
        type: String,
        optional: true,
        autoValue() {
                if (this.isInsert && (!this.isSet || this.value.length === 0)) {
                    return Meteor.userId()||"anonymous";
                }
        },
        autoform: {
            type: "hidden",
            label: false,
        },
    },
    createdByUserName: {
        type: String,
        optional: true,
        autoValue() {
                let username = "anonymous"
                if (this.isInsert && (!this.isSet || this.value.length === 0)) {
                    if (Meteor.user())
                        username = Meteor.user().username 
                    return username
                }
        },
        autoform: {
            type: "hidden",
            label: false,
        },
    },    
    editedByUserId: {
        type: String,
        optional: true,
        autoValue() {
                    return Meteor.userId()||"anonymous";
        },
        autoform: {
            type: "hidden",
            label: false,
        },
    },
    editedByUserName: {
        type: String,
        optional: true,
        autoValue() {
                let username = "anonymous"
                if (Meteor.user())
                    username = Meteor.user().username 
                return username
        },
        autoform: {
            type: "hidden",
            label: false,
        },
    },    
    corrections: {
        type: Array,
        optional: true,
        defaultValue: []  
    }, 
    'corrections.$': {
        type: Object,
        optional: true, 
        blackbox: true,
    },
    lastEvent: {
        type: Object, 
        optional: true, 
        blackbox: true,
        defaultValue: {},
    }, 
    deleted: {
        type: Boolean,
        label: 'Удаленная',
        optional:true, 
        defaultValue: false,
    }, 
    published: {
        type: Boolean,
        optional: true, 
        defaultValue: true,
    }, 
    picture: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images',
                previewTemplate: 'myFilePreview'
                }
            }
    },
/*    tags: {
        type: Array, 
        optional: true,
        defaultValue: [],
    }, 
    'tags.$': {
        type: String,
        label: 'Tag',
        autoform: {
            type: 'tagsTypeahead',
            'tag-set': 'default'      //optional. Default is 'default'.
        }        
    }*/
});





Articles.attachSchema(ArticleSchema);

////////////---------METHODS---------------//////////////////
Meteor.methods({

    //this method works in Article Update form/
  'articles.update'(doc) {
    check(doc, Object);
//    Articles.update({_id: doc._id}, doc.modifier );
    const userId = Meteor.userId()||'anonymous';
    let correction = doc.modifier.$set;
    correction._id = doc._id
    correction.lastEvent = {}

    //if user is Admin, we apply he's correction directly to db, 
    if (userId == "ghZegnrrKqnNFaFxb") {
        
        correction.lastEvent.type = "изменил статью"
        //console.log('inside method doc', doc)
        Articles.update({_id: doc._id}, 
                        doc.modifier,
                        {upsert: true},
                    );
    }
    //if user is not Admin - just save it to corrections, to accept or reject in the future by admin
    else {
        correction.published = false
        Articles.update(
            {_id: doc._id},
            { $set: { 
                    lastEvent : {type: "предложил правку" }, 
                    corrections: changedCorrections(doc._id, userId, correction)
             },
         }
         );
    }
  },

  'article.autoCorrection'(doc_id, oldTranslation, words){
    //console.log('addAutoCorrection', doc_id, correction)
    const userId = Meteor.userId()||'anonymous';
    let correction = Articles.findOne({_id: doc_id});
    correction.editedAt = new Date()
    correction.editedByUserId = userId
    if(Meteor.user())
        correction.editedByUserName = Meteor.user().username
    else
        correction.editedByUserName = 'anonymous'
    let word = words[0].word.replace(/[ًٌٍٍَُِّْ]/gi, "") //removes all diacritics 
    correction.translations = parseArticle(oldTranslation, word)
    correction.words = words
    correction.published = false
    console.log(correction)
    Articles.update(
        {_id: doc_id},
        { $set: { 
                lastEvent : {type: "предложил авто правку" }, 
                corrections: changedCorrections(doc_id, userId, correction)
         },
     }
     );
    },

  'articles.accept'(doc_id, correction){
      if (Meteor.userId() == "ghZegnrrKqnNFaFxb") {
            correction.lastEvent = {}
            correction.lastEvent.type = "одобрил статью"
            correction.lastEvent.user2id = correction.editedByUserId
            correction.lastEvent.user2name = correction.editedByUserName
            correction.published = true

            Articles.update({_id: doc_id}, 
                                {$set: correction},
                                {upsert: true});
      }
      else {
          console.log("У вас недостаточно прав одобрять правки"); 
      }
  },
  'articles.reject'(doc_id, correction){
      if (Meteor.userId() == "ghZegnrrKqnNFaFxb") {
            correction.lastEvent = {}
            correction.lastEvent.type = "отклонил статью"
            correction.lastEvent.user2id = correction.editedByUserId
            correction.lastEvent.user2name = correction.editedByUserName
            correction.deleted = true

            Articles.update({_id: doc_id}, 
                                {$set: correction},
                                {upsert: true});
      }
      else {
          console.log("У вас недостаточно прав одобрять правки"); 
      }
  },  
  'articles.accept_correction'(doc_id, correction){
      if (Meteor.userId() == "ghZegnrrKqnNFaFxb") {
            correction.lastEvent = {}
            correction.lastEvent.type = "одобрил правку"
            correction.lastEvent.user2id = correction.editedByUserId
            correction.lastEvent.user2name = correction.editedByUserName
            correction.published = true 

            Articles.update({_id: doc_id}, 
                                {$set: correction, $unset: {corrections: []}},
                                {upsert: true});
      }
      else {
          console.log("У вас недостаточно прав одобрять правки"); 
      }
  },

  'articles.reject_correction'(doc_id, correction){
      if (Meteor.userId() == "ghZegnrrKqnNFaFxb") {
            correction.lastEvent = {}
            correction.lastEvent.type = "отклонил правку"
            correction.lastEvent.user2id = correction.editedByUserId
            correction.lastEvent.user2name = correction.editedByUserName
            Articles.update(
                {_id: doc_id },
                { $set:{lastEvent: correction.lastEvent}, $pull: { corrections : { editedByUserId: correction.editedByUserId } } },
                );
      }
      else {
          console.log("У вас недостаточно прав удалять правки"); 
      }
  },  

  'articles.insert'(doc) {
    check(doc, Object);
    //if user is Admin, he can add new articles directly
    if(Meteor.userId() == "ghZegnrrKqnNFaFxb") {
        doc.modifier.$set.lastEvent = {}
        doc.modifier.$set.lastEvent.type = "создал статью"
        Articles.insert(doc.modifier.$set);
        //function(error, result){}
    }
    //if user is not Admin, he can add draft of article, for approving by Admin
    else {
        doc.modifier.$set.lastEvent = {}
        doc.modifier.$set.lastEvent.type = "предложил статью"
        doc.modifier.$set.published = false
        Articles.insert(doc.modifier.$set);
    }


  },

  'articles.remove'(docId) {
    check(docId, String);
    //if user is admin he can remove articles
    if (Meteor.userId() == "ghZegnrrKqnNFaFxb") {
        Articles.update({_id: docId}, {$set: 
                                        { deleted: true, 
                                        lastEvent: {type: "удалил статью"} },} 
                );
    }
    else {
        console.log("у вас недостаточно прав для удаления статей"); 
    }
  },

}); //end of Meteor.methods

///////////////----HOOKS------/////////////////////
Articles.after.insert(function (userId, doc) {

    Meteor.call('events.insert', lastEvent(doc));

    FlowRouter.go('article',{ id: doc._id});
});

Articles.after.update(function(userId, doc, fieldNames, modifier, options){

        Meteor.call('events.insert', lastEvent(doc));
        if(doc.lastEvent.type != "удалил статью")
            FlowRouter.go('article',{ id: doc._id});
});

function articleTitle(words){
    let title = ""; 

    words.forEach( function(elem) {
        let note = elem.note||"";
        let word = elem.word||"";
        title += `${note} ${word} `
    });
    return title
}

function lastEvent(doc){
    const event = {
            type: doc.lastEvent.type,
            user1id: doc.editedByUserId, 
            user1name: doc.editedByUserName, 
            articleId: doc._id, 
            articleTitle: articleTitle(doc.words), 
            happenedAt:doc.editedAt,
            user2id: doc.lastEvent.user2id,
            user2name : doc.lastEvent.user2name
        };
    return event
}

/* function handleUpdateError(error, result){
        console.log('Error while updating article', error);
        console.log('Success while updateing article', result)
} */

function changedCorrections(docId, userId, correction){
    let corrections = Articles.findOne({'_id': docId}, {fields: {corrections: 1}}).corrections||[];
    let count = 0;
    //console.log('old corrections', corrections); 

    let new_corrections = corrections.map(function(elem){
        if(elem.editedByUserId == userId){
            count++
            return correction
        }
        else
            return elem
    });
    if(count==0)
        new_corrections.push(correction)
    //console.log('corrections', corrections);
    return new_corrections
}

//this function gets old formated article (when all translations was in one field), 
//and parse it to object with separated translations and their examples
function parseArticle( text, word ){
    
        var newTranslations = []
    
        translations0 = text.split(/\d+\s*?\)/g); //raw array with translations
    
        var match = "";
        //\u0621-\u064A - arabic symbols 
        var example_pattern = /;([\s]+?[\!\?\*\~\u0621-\u064A]+?[\s\S]+?)(;|$)/ig

        //в исходной базе словаря тильда стоит "зеркально", 
        //её надо переместить из начала в конец и наоборот и заменить основным словом статьи
        var reverseAndReplaceTilda = function(str, word){
            var strArray = str.split("")
            if(strArray[0] == "~"){
                strArray.shift();
                if(strArray[0]==" ") 
                    strArray.push(" ");
                strArray.push("~");
            }
            else if(strArray[strArray.length-1] == "~"){
                strArray.pop();
                if(strArray[strArray.length-1] == " ")
                    strArray.unshift(" ")
                strArray.unshift("~");
            }
            var result = strArray.join("").replace("~",word).replace(/ـ/g, "")
            return result 
        }
    
        translations0.forEach(function(elem, index){
    
                if(elem.trim()) {
                    var examples = []
                    var translation = ""
                    var examplesBeginnigIndex = elem.search(example_pattern);
                    if(examplesBeginnigIndex > -1)
                        translation = elem.substring(0,examplesBeginnigIndex);
                    else
                        translation = elem.trim()
                    while (match = example_pattern.exec(elem)) {
                        var exampleString = match[1]
                        //\u0400-\u04FF - cyrillic symbols
                        translationBeginningIndex = exampleString.search(/\(?[\u0400-\u04FF]/)
                        var example = exampleString.substring(0, translationBeginningIndex).trim();
                        example = reverseAndReplaceTilda(example, word); 
                        var exTranslation = exampleString.substring(translationBeginningIndex).trim();
                        examples.push({example, translation: exTranslation}); 
                        example_pattern.lastIndex --;
                    }
    
                    newTranslations.push( {translation, examples} )
                }
            });
        return newTranslations
    }
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker'; 
SimpleSchema.extendOptions(['autoform']);

export const Articles = new Mongo.Collection('articles');

// PUBLICATIONS
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('articles', function() {
    return Articles.find();
  });

  Meteor.publish('articleSingle', function(id) {
    return Articles.find({_id: id});
  });
  
  Meteor.publish('articlesSearchResult', function(searchFor) {
    return Articles.find( { "words.word" : new RegExp(searchFor) }, { limit: 50 } );
  });
}

// METHODS
Articles.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    //return !! userId;
    return true
  },
  update: function(userId, doc) {
    // only allow updating if you are owner
    //return doc.createdBy === Meteor.userId();
    return true
  },
  remove: function(userID, doc) {
    //only allow deleting if you are owner
    return doc.createdBy === Meteor.userId();
  }
});

// SCHEMES 
WordSchema = new SimpleSchema({
    note: {
        type: String,
        optional: true,
        trim: true,
        autoform: {
            label: false,
            placeholder: "schemaLabel"
        }        
    }, 
    word: {
        type: String,
        trim: true,
        autoform: {
            label: false,
            placeholder: "schemaLabel"
        }        
    },    
});

ExampleSchema = new SimpleSchema({
    example: {
        type: String,
        optional: true,
        trim: true,
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
        autoform: {
            label: false,
            placeholder: "schemaLabel"
        }        
    }, 
});

TranslationSchema = new SimpleSchema({
    translation: {
        type: String,
        label: "Translation",
        optional: true,
        trim: true,
        autoform: {
            label: false,
            placeholder: "schemaLabel",
        }        
    }, 
    examples: {
        type: Array, 
        label: "Examples", 
        optional: true, 
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

    category: {
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
        label: "Words"
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
        label: "Translations", 
        optional: true,
    }, 
    'translations.$': TranslationSchema,

    createdAt: {
        type: Date, 
        label: "Created At", 
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
        autoValue() {
                    return new Date();
        }, 
        autoform: {
            type: "hidden"
        }            
    },    

    createdBy: {
        type: String,
        optional: true,
        autoValue() {
                if (this.isInsert && (!this.isSet || this.value.length === 0)) {
                    return Meteor.userId()||"somebody";
                }
        },
        autoform: {
            type: "hidden",
            label: false,
        },
    },
}); 



Articles.attachSchema(ArticleSchema);
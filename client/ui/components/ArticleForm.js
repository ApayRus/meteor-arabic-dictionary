import { Articles } from '/imports/api/articles.js';

Template.ArticleForm.onCreated(function(){
/*     var self = this;
    console.log('this', self.data)
    self.autorun(function(){
        self.subscribe("articleSingle", self.data._id);
    }); */
    this.reactiveForm = new ReactiveDict();
    //this.reactiveForm.set('article', this.data)
    /*
    this.reactiveForm.set(this)
    console.log('reactiveDict', this.reactiveForm)
    console.log('this', this) */
});

Template.ArticleForm.helpers({
    article(){
        console.log('this', this)
        let newWords = this.words.map((elem, index) => {
            return {note: elem.note, word: elem.word, wordId: `article.${this._id}.words.${index}`}
        })

        let newTranslations = this.translations.map((elem, index) => {
            return {
                    translation: elem.translation, 
                    translationId: `article.${this._id}.translations.${index}.translation`, 
                    examples: elem.examples.map((elem2, index2)=>{
                        return {
                                example: elem2.example,
                                translation: elem2.translation,
                                exampleId: `article.${this._id}.translations.${index}.examples.${index2}`
                            }
                    })
                }
        })

        //this.words = newWords
        //this.translations = newTranslations
        Template.instance().reactiveForm.set("article", this)
        const article = Template.instance().reactiveForm.get("article"); 
        //console.log('this.reactiveForm', )
        return article
    },
});

//Template.ArticleMenu.inheritsHelpersFrom('ArticlePage');

Template.ArticleForm.events({ 
    'click .add-word'(event, template){
        console.log(template.data.words)
        template.data.words.push({note:"", word:""})
        template.reactiveForm.set('article', template.data)
    }, 
    'change .editField'(event, template){
        template.reactiveForm.set('article', template.data)
        console.log(template.data)
    }
});

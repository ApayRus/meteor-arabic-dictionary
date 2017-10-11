import { Articles } from '/imports/api/articles.js';

Template.ArticleForm.onCreated(function(){
/*     var self = this;
    console.log('this', self.data)
    self.autorun(function(){
        self.subscribe("articleSingle", self.data._id);
    }); */
    this.reactiveForm = new ReactiveDict();
    this.reactiveForm.set('article', this.data)
    /*
    this.reactiveForm.set(this)
    console.log('reactiveDict', this.reactiveForm)
    console.log('this', this) */
});

Template.ArticleForm.helpers({
    article(){
        const article = Template.instance().reactiveForm.get("article"); 
        //console.log('this.reactiveForm', )
        return article
    }
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

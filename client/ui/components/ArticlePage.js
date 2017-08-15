import { Articles } from '/imports/api/articles.js';

/*Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});*/

Template.ArticlePage.onCreated(function(){
    var self = this;
    var id = FlowRouter.getParam('id');
    self.autorun(function(){
        self.subscribe("articleSingle", id);
    });
    //Meteor.subscribe('articles'); 
});

Template.ArticlePage.helpers({
    article() {
        const id = FlowRouter.getParam('id');
        const article = Articles.findOne({'_id': id});
        let published = true; 
        let showCorrections = false;
        const corrections = article.corrections||[]
        if(article.published===false){
            published = false;
        }
        
        if (corrections.length > 0) {
            showCorrections = true
        }

        return { article, corrections, showCorrections, published};
    },
/*    isAdmin() {
        return Meteor.userId() == "ghZegnrrKqnNFaFxb"
    }*/

});

//Template.ArticleMenu.inheritsHelpersFrom('ArticlePage');

Template.ArticlePage.events({ 
    'click .correction .btn-success'(){
        doc_id = FlowRouter.getParam('id');
        Meteor.call('articles.accept_correction', doc_id, this);
    },
    'click .correction .btn-danger'(){
        doc_id = FlowRouter.getParam('id');
        Meteor.call('articles.reject_correction', doc_id, this);
    },
    'click .main-article .btn-success'(){
        doc_id = FlowRouter.getParam('id');
        Meteor.call('articles.accept', doc_id, this);
    },
    'click .main-article .btn-danger'(){
        doc_id = FlowRouter.getParam('id');
        Meteor.call('articles.reject', doc_id, this);
    },    
});

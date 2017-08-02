/*import { Template } from 'meteor/templating'; 
 
import './ArticleUpdate.html'; 
*/
/*Template.NewArticle.events({
    'submit'(event){
        event.preventDefault();
        console.log("autoform submited", event.target); 
    }, 
}); */
import { Articles } from '/imports/api/articles.js';

Template.ArticleUpdate.onCreated(function(){
    var self = this;
    var id = FlowRouter.getParam('id');
    self.autorun(function(){
        self.subscribe("articleSingle", id);
    });
});

Template.ArticleUpdate.helpers({
    articles() {
        return Articles;
    },
    updateArticleId() {
        const id = FlowRouter.getParam('id');
        return id; 
    },
    poroda1() {
    if(AutoForm.getFieldValue('category')=="глагол I-й породы")
        return true
    else 
        return false
    }, 
    mode() {
        const route = FlowRouter.getRouteName(); 
        if (route == "article-add") 
            return {
                type: "insert", 
                doc: null
            }
        if (route == "article-edit" ) {
            const id = FlowRouter.getParam('id');
            const doc = Articles.findOne({'_id': id});
            const type = "update"; 
            return { type, doc }
        }
    }
});

AutoForm.hooks({
  articleForm: {
    after: {
          update: function(error, result){
                if(result)
                  FlowRouter.go('articles',{ id: this.docId });
                else
                    console.log(result, error)
          },
          insert: function(error, result){
                  FlowRouter.go('articles',{ id: result }); 
          }
      }    
  }
});
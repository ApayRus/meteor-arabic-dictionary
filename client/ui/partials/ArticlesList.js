Template.ArticlesList.onCreated(function() {
  Session.set("showEditFormForArticle", "");
});

Template.ArticlesList.helpers({
  showEditForm(articleId) {
    return articleId == Session.get("showEditFormForArticle");
  }
  /*     
  correction(){
        const userId = Meteor.userId()||'anonymous';
        const correction = this.corrections.filter((elem)=>{
            console.log('elem.editedByUserId', elem.editedByUserId, Meteor.userId())
            return elem.editedByUserId == userId;
        })
        //console.log('correction', correction)
        return correction[0];
    } 
    */
});

Template.ArticlesList.events({});

Template.ArticleMenu.helpers({
    
        correctionsCount(){
            if(this.corrections.length > 0) 
                return "Правки: "+this.corrections.length
            else 
                return ""
        }, 
        isAdmin(){
            return Meteor.userId() == "ghZegnrrKqnNFaFxb"
        },
        //we show autoCorrection button only if article have only 1 field with translation
        //and haven't examples
        showAutoCorrection(){
            return (
                this.translations.length == 1 && 
                !this.translations[0].examples
            )
        }
    
    
    });
    
    Template.ArticleMenu.events({ 
        'click .delete'(){
            Meteor.call('articles.remove', this._id);
        },
        'click .autoCorrection'(){
            if(this.translations.length == 1 && !this.translations[0].examples)
             Meteor.call('article.autoCorrection', this._id, this.translations[0].translation, this.words)
            else
                console.log("нельзя применить автоправки, в этой статье уже есть правки")
        }, 
        'click .edit'(event){
            event.preventDefault()
            Session.set('showEditFormForArticle', this._id)
        }
    });
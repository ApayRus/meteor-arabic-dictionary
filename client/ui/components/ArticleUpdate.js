/*import { Template } from 'meteor/templating'; 
 
import './ArticleUpdate.html'; 
*/
/*Template.NewArticle.events({
    'submit'(event){
        event.preventDefault();
        console.log("autoform submited", event.target); 
    }, 
}); */
import { hasRole } from '../../../lib/utils'
import { Articles } from '/imports/api/articles.js'

Template.ArticleUpdate.onCreated(function () {
	var self = this
	var id = FlowRouter.getParam('id')
	self.autorun(function () {
		self.subscribe('articleSingle', id)
	})
})

Template.ArticleUpdate.helpers({
	articles() {
		return Articles
	},
	/*    updateArticleId() {
        const id = FlowRouter.getParam('id');
        return id; 
    },*/
	poroda1() {
		if (AutoForm.getFieldValue('speachPart') == 'глагол, I порода') return true
		else return false
	},
	mode() {
		const route = FlowRouter.getRouteName()

		if (route == 'article-add')
			return {
				method: 'articles.insert',
				doc: null
			}

		if (route == 'article-edit') {
			const id = FlowRouter.getParam('id')
			const method = 'articles.update'
			let doc = {}
			const correctionBy = FlowRouter.getQueryParam('correctionBy')

			//whe should find proper correction for this user
			if (correctionBy) {
				doc = findUserCorrection(id, correctionBy)
			} else doc = Articles.findOne({ _id: id })
			return { method, doc }
		}
	},
	isAdding() {
		return FlowRouter.getRouteName() == 'article-add'
	},
	isEditing() {
		return FlowRouter.getRouteName() == 'article-edit'
	},
	isAdmin() {
		return hasRole('admin')
	}
})

Template.myFilePreview.helpers({
	isAdmin() {
		return hasRole('admin')
	}
})

function findUserCorrection(article_id, user_id) {
	let corrections = Articles.findOne(
		{ _id: article_id },
		{ fields: { corrections: 1 } }
	).corrections
	let correction = corrections.filter(function (elem) {
		return elem.editedByUserId == user_id
	})[0]
	return correction
}

AutoForm.hooks({
	articleForm: {
		after: {
			update: function (error, result) {
				if (result) {
					console.log('currentDoc', this.currentDoc)
					console.log('updateDoc', this.updateDoc)
					FlowRouter.go('articles', { id: this.docId })
				} else console.log(result, error)
			},
			insert: function (error, result) {
				FlowRouter.go('articles', { id: result })
			}
		}
	}
})

Template.ArticleUpdate.events({
	'submit form'(event) {
		event.preventDefault()
		//console.log(event.target)
		/*        const word = event.target.word.value; 
        const translation = event.target.translation.value; 

        Words.insert({
            word, 
            translation, 
            createdAt: new Date(),
        }); 

        event.target.word.value = '';
        event.target.translation.value = ''; */
	}
})

/*Template.ArticleUpdate.onRendered( function(){
  // we're using the template instance scoped jQuery
  $("input.translation").parent().addClass("-width-100");
});*/

import { hasRole } from '../../../lib/utils'
import { Articles } from '/imports/api/articles.js'

Template.ArticlePage.onCreated(function () {
	var self = this
	self.autorun(function () {
		const id = FlowRouter.getParam('id')
		if (id) {
			self.subscribe('articleSingle', id)
		}
	})
})

Template.ArticlePage.helpers({
	articles() {
		const id = FlowRouter.getParam('id')
		return Articles.find({ _id: id })
	},
	isAdmin() {
		return hasRole('admin') //Roles.userIsInRole(loggedInUser, ['admin'])
	}
})

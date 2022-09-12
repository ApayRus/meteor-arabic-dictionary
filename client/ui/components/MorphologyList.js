import { Morphologies } from '../../../imports/api/morphologies'
import { hasRole } from '../../../lib/utils'

Template.MorphologyList.onCreated(function () {
	var self = this
	self.autorun(function () {
		self.subscribe('morphologies')
	})
	Session.set('showMorphologyFormFor', '')
})

Template.MorphologyList.helpers({
	showEditFormFor(morphologyId) {
		return morphologyId == Session.get('showMorphologyFormFor')
	},
	morphologies() {
		return Morphologies.find({})
	},
	isAdmin() {
		return hasRole('admin') //Roles.userIsInRole(loggedInUser, ['admin'])
	}
})

Template.MorphologyItem.helpers({
	isAdmin() {
		return hasRole('admin') //Roles.userIsInRole(loggedInUser, ['admin'])
	}
})
Template.MorphologyList.events({
	'click .addMorphologyButton'(event) {
		event.preventDefault()
		Session.set('showMorphologyFormFor', 'new')
	},
	'click .editMorphologyButton'(event) {
		event.preventDefault()
		const id = event.currentTarget.id.substring(14) //if we use not currentTarget will be fired <icon> , not <button>
		Session.set('showMorphologyFormFor', id)
	},
	'submit .morphologyForm'(event) {
		event.preventDefault()

		//id="forMorphology-id"
		const _id =
			Session.get('showMorphologyFormFor') == 'new'
				? ''
				: Session.get('showMorphologyFormFor')
		const title = event.target.title.value
		const description = event.target.description.value
		Meteor.call(
			'morphologies.upsert',
			{
				_id,
				title,
				description
			},
			(error, result) => {
				if (error) console.log('не получилось создать тэг', error)
				else {
					Session.set('showMorphologyFormFor', '')
					console.log('создан/изменён новый морфологический тэг', result)
				}
			}
		)
	},

	'reset .morphologyForm'(event) {
		event.preventDefault()
		event.target.title.value = ''
		event.target.description = ''
		Session.set('showMorphologyFormFor', '')
	},
	'click .deleteMorphologyButton'(event) {
		event.preventDefault()
		const id = Session.get('showMorphologyFormFor')
		Meteor.call('morphologies.delete', id, (error, result) => {
			if (error) console.log('не получилось удалить морфологический тэг', error)
			else {
				Session.set('showMorphologyFormFor', '')
				console.log('удалён морфологический тэг', result)
			}
		})
	}
})

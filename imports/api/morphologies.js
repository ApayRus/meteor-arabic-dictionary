import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { hasRole } from '../../lib/utils'

export const Morphologies = new Mongo.Collection('morphologies')

export const MorphologySchema = new SimpleSchema({
	title: {
		type: String,
		label: 'title'
	},
	description: {
		type: String,
		label: 'description'
	},
	createdAt: {
		type: Date,
		label: 'Created At',
		optional: true,
		autoValue() {
			if (this.isInsert && (!this.isSet || this.value.length === 0)) {
				return new Date()
			}
		}
	},
	createdByUserId: {
		type: String,
		optional: true,
		autoValue() {
			if (this.isInsert && (!this.isSet || this.value.length === 0)) {
				return Meteor.userId() || 'anonymous'
			}
		}
	},
	createdByUserName: {
		type: String,
		optional: true,
		autoValue() {
			let username = 'anonymous'
			if (this.isInsert && (!this.isSet || this.value.length === 0)) {
				if (Meteor.user()) username = Meteor.user().username
				return username
			}
		}
	}
})

Morphologies.attachSchema(MorphologySchema)

Meteor.methods({
	'morphologies.upsert'(doc) {
		if (hasRole('admin')) {
			check(doc, Object)
			const _id = doc._id
			const newDocId = Morphologies.upsert({ _id }, { $set: { ...doc } })
			return newDocId
		} else {
			console.log('You have not permissions for doing this.')
		}
	},
	'morphologies.insert'(doc) {
		if (hasRole('admin')) {
			check(doc, Object)
			const newDocId = Morphologies.insert(doc)
			return newDocId
		} else {
			console.log('You have not permissions to do this.')
		}
	},
	'morphologies.delete'(_id) {
		if (hasRole('admin')) {
			check(_id, String)
			Morphologies.remove({ _id })
			return _id
		} else {
			console.log('You have not permissions to do this.')
		}
	}
})

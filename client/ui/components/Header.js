import { hasRole } from '../../../lib/utils'

Template.Header.helpers({
	isAdmin() {
		return hasRole('admin') //Roles.userIsInRole(loggedInUser, ['admin'])
	}
})

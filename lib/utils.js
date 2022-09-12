export function hasRole(roleCheck) {
	const { profile: { role = '' } = {} } = Meteor.user() || {}
	return roleCheck === role
}

import { hasRole } from '../../../lib/utils'

Template.uploadedFiles.helpers({
	uploadedFiles: function () {
		return Images.find()
	}
})

Template.uploadForm.onCreated(function () {
	this.currentUpload = new ReactiveVar(false)
	this.uploadedFile = new ReactiveVar(false)
})

Template.uploadForm.helpers({
	currentUpload: function () {
		console.log(Template.instance().currentUpload.get())
		return Template.instance().currentUpload.get()
	},
	isAdmin() {
		return hasRole('admin')
	},
	uploadedFile() {
		return Template.instance().uploadedFile.get()
	}
})

Template.uploadForm.events({
	'change #fileInput': function (e, template) {
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			// We upload only one file, in case
			// there was multiple files selected
			var file = e.currentTarget.files[0]
			if (file) {
				var uploadInstance = Images.insert(
					{
						file: file,
						streams: 'dynamic',
						chunkSize: 'dynamic'
					},
					false
				)

				uploadInstance.on('start', function () {
					template.currentUpload.set(this)
				})

				uploadInstance.on('end', function (error, fileObj) {
					if (error) {
						window.alert('Error during upload: ' + error.reason)
					} else {
						template.uploadedFile.set(fileObj)
						Session.set(
							'picture',
							fileObj.path
								.split('/')[4]
								.replace(RegExp(`.${fileObj.extension}$`), '')
						) //image id in path
						//console.log('template.uploadedFile.get()', template.uploadedFile.get())
						//window.alert('File "' + fileObj.name + '" successfully uploaded');
					}
					template.currentUpload.set(false)
				})

				uploadInstance.start()
			}
		}
	}
})

const mongoose = require('mongoose')
const noteSchema = new mongoose.Schema({
	date: {
		type: String,
		required: true,
		minLength: 10,
	},
	content: {
		type: String,
		required: true,
		minLength: 1,
	},
})

noteSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id.toString()
		delete ret._id
		delete __v
	},
})

module.exports = mongoose.model('Note', noteSchema)

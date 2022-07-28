const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserModel = new Schema({
    nama: String,
	username: String,
	password: String,
	isAdmin : {
		type : Boolean,
		default : false
	},
    created_at: {
		type: Schema.Types.Date,
		default: new Date()
	},
	updated_at: {
		type: Schema.Types.Date,
		default: new Date()
	},
	active: Boolean,
})

module.exports = exports = mongoose.model('UserModel', UserModel, 'users');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SettingModel = new Schema({
    logo : String,
    telp : String,
    email : String,
    alamat : String,
    created_at: {
		type: Schema.Types.Date,
		default: new Date()
	},
	updated_at: {
		type: Schema.Types.Date,
		default: new Date()
	},
})

module.exports = exports = mongoose.model('SettingModel', SettingModel, 'general_setting');
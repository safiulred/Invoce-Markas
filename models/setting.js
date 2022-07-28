module.exports = (mongoose) => {
	const SettingModel = mongoose.model('SettingModel', mongoose.Schema({
		logo : String,
		telp : String,
		email : String,
		alamat : String,
		created_at: {
			type: mongoose.Schema.Types.Date,
			default: new Date()
		},
		updated_at: {
			type: mongoose.Schema.Types.Date,
			default: new Date()
		},
	}), 'general_setting')
	return SettingModel
}
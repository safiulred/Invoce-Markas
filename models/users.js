module.exports = (mongoose) => {
	const UserModel = mongoose.model('UserModel',  mongoose.Schema({
		nama: String,
		username: String,
		password: String,
		isAdmin : {
			type : Boolean,
			default : false
		},
		created_at: {
			type: mongoose.Schema.Types.Date,
			default: new Date()
		},
		updated_at: {
			type: mongoose.Schema.Types.Date,
			default: new Date()
		},
		active: Boolean,
	}),'users')
	return UserModel
}

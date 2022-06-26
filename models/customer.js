const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerModel = new Schema({
    nama : String,
    telp : String,
    email : String,
    alamat : String,
    company_name : String,
    tagihan : Number,
    active : Boolean,
    billing_date : {
        type : Schema.Types.Date
    },
    installation_date : {
        type : Schema.Types.Date
    },
    created_at: {
		type: Schema.Types.Date,
		default: new Date()
	},
	updated_at: {
		type: Schema.Types.Date,
		default: new Date()
	},
})

module.exports = exports = mongoose.model('CustomerModel', CustomerModel, 'customer');
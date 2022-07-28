module.exports = (mongoose) => {
    const CustomerModel = mongoose.model('CustomerModel',  mongoose.Schema({
        nama : String,
        telp : String,
        email : String,
        alamat : String,
        company_name : String,
        tagihan : Number,
        active : Boolean,
        billing_date : {
            type : mongoose.Schema.Types.Date
        },
        date : String,
        pic : {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'UserModel'
        },
        installation_date : {
            type : mongoose.Schema.Types.Date
        },
        created_at: {
            type: mongoose.Schema.Types.Date,
            default: new Date()
        },
        updated_at: {
            type: mongoose.Schema.Types.Date,
            default: new Date()
        },
    }), 'customer')
    return CustomerModel
}
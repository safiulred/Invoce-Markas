const {UserModel, CustomerModel} = require('./models')

async function b (userId) {
    CustomerModel.find()
        .then(customers=>{
            customers.map(async c=>{
                console.log(`${c.nama} replace to kolektor ${userId}`)
                await CustomerModel.updateOne({_id : c._id},{$set : { pic : userId}})
            })
        })
        .catch(err=>{
            console.log(err)
        })
}
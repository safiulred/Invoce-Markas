const {CustomerModel} = require('./models')

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

function t () {
    CustomerModel.find()
        .then(customers=>{
            let totalTagihan = customers.reduce((prev, current)=>{
                return prev+current.tagihan
            }, 0)
            console.log({totalTagihan})
        })
        .catch(err=>{
            console.log(err)
        })
}
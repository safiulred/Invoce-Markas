const env = process.env.NODE_ENV || 'development'
const config = require('../config/db')[env]
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const basename = path.basename(__filename)

let authDB = config.password != "" ? config.username + ":" + config.password + "@" : "";

mongoose.connect(`mongodb://${authDB}${config.host}:${config.port}/${config.db}`,{
    useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex : true,
	autoIndex: false
}).then(db=>{
    console.log(`CONNECTED DB [${config.db}]`);

}).catch(err=>{
    console.log(err)
})

const db = {}

fs.readdirSync(__dirname).filter(file => 
    (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
).map(file => {
    const model = require(path.join(__dirname,file))(mongoose)
    db[model.modelName] = model
})

module.exports = db
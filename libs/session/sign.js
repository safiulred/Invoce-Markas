const moment = require('moment')
const crypto = require('crypto-js')
const {redisClient} = require('./redisClient')
const redisConfig = require('../../config/redis')
const config = redisConfig[process.env.NODE_ENV]

module.exports = async (user, sessionBy) => {
    const strings = JSON.stringify(user)
    const token = crypto.AES.encrypt(strings, config.secret).toString().replace(/\=/g, '').replace(/\+/g, '_').replace(/\//g, '_')

    let sessionByUserId = await new Promise((resolve,reject)=>redisClient.hget(`${sessionBy?sessionBy:config.sessionName}SessionById`,user.id,(err,reply)=>err?reject(err):resolve(JSON.parse(reply)))) 
    // console.log(sessionByUserId)

    const oTokens = sessionByUserId && sessionByUserId.tokens?[...sessionByUserId.tokens,token]:[token]
    let tokens = oTokens
    const data = {
        user,
        tokens,
    }
    redisClient.hset(`${sessionBy?sessionBy:config.sessionName}SessionById`,user.id,JSON.stringify(data))

    return token
}
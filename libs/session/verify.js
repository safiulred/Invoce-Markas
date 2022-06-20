const moment = require('moment')
const crypto = require('crypto-js')
const {redisClient} = require('./redisClient')
const redisConfig = require('../../config/redis')
const config = redisConfig[process.env.NODE_ENV]

module.exports = async (token, callback) => {
    if (token) {
        redisClient.get(`${config.sessionName}SessionById${token}`, (err, reply) => {
            if(err || !reply) {
                callback('Invalid token',null)
            } else {
                const data = JSON.parse(reply)
                console.log(data)
            }
        })
    } else {
        callback('Invalid token',null)
    }
}
const redis = require('redis')
const {promisifyAll, promisify} = require('bluebird')
const redisConfig = require('../../config/redis')
const config = redisConfig[process.env.NODE_ENV]

const redisClient = redis.createClient(config)
promisifyAll(redis)
redisClient.on('error',(err)=>{
    console.log('Redis error:',err)
})
redisClient.on('connect',()=>{
    console.log('Connected to redis')
})

const close = ()=>{
    redisClient.quit()
}
module.exports = {
    redisClient,
    close
}
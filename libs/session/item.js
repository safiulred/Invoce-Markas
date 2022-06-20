const {redisClient} = require('./redisClient')
const redisConfig = require('../../config/redis')
const config = redisConfig[process.env.NODE_ENV]

const setItem = async(key,data,expire,callback,sessionName) => {
    const expTime = expire ? expire : 60*5
    if(expire===false)
        redisClient.set(`${sessionName?sessionName:config.sessionName}Item${key}`,JSON.stringify(data),()=>callback && callback())
    else
        redisClient.setex(`${sessionName?sessionName:config.sessionName}Item${key}`,expTime,JSON.stringify(data),()=>callback && callback())
}

const getItem = async(key,expire,callback,sessionName)=>{
    const data = await new Promise((resolve,reject)=>{
        redisClient.get(`${sessionName?sessionName:config.sessionName}Item${key}`,(err,reply)=>{
            if(err)return reject(err)
            expire && redisClient.expire(`${sessionName?sessionName:config.sessionName}Item${key}`,expire)
            resolve(JSON.parse(reply))
        })
    })
    if(callback)callback(data)
    else return data
}
const removeItem = async(key,callback,sessionName)=>{
    redisClient.del(`${sessionName?sessionName:config.sessionName}Item${key}`,()=>callback && callback())
}

module.exports = {setItem, getItem, removeItem}
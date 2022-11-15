require('dotenv').config()
const env = process.env.NODE_ENV
const nodemon = require('nodemon')
// const {execSync} = require('child_process')
const os = require('os')

nodemon({
    script: 'index.js',
    ext: 'js json'
})
nodemon.on('start',(args)=>{
    console.log('nodemon started')
})
nodemon.on('restart',(files)=>{
    console.log('nodemon restarting...')
    console.log('Files changed : ',files)
})
nodemon.on('crash',(args)=>{
    console.log('nodemon crashed')
    process.exit()
})
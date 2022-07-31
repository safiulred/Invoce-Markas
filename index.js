require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session');
const app = express()
const cors = require('cors');
const path = require('path')
const useragent = require('express-useragent')
const mongoose = require("mongoose");
const redis = require('redis');
const redisStore = require('connect-redis')(session);

const env = process.env.NODE_ENV || 'dev'
const configApp = require('./config/app')[env]
const configDB = require('./config/db')[env]
const configRedis = require('./config/redis')[env]

const routers = require('./routers');

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('x-powered-by', 'Invoice Markas');

// CONNECT REDIS
// var client = redis.createClient(configRedis);
// client.on('connect', () => { console.log('[!] Redis connected')});

// CONFIG SESSION
app.use(session({
	secret : configRedis.secret,
	name : configRedis.sessionName,
	resave : true,
	saveUninitialized : false,
	cookie : {
		secure : false,
		maxAge : Date.now() + 3600000
	},
	// store : new redisStore({
	// 	host : configRedis.host,
	// 	port : configRedis.port,
	// 	db: configRedis.db,
	// 	client : client, ttl : 260
	// })
}));

app.use(useragent.express())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
	res.locals.session = req.user;
	next();
});

routers(app)
app.listen(configApp.port, configApp.host, () =>{
	console.log(`app running on [${env}] environment on port : ${configApp.port}`)
})

process.on('exit',code=>{
    console.log(`Exit code : ${code}`)
})
process.on('uncaughtException',err=>{
    // logger.error(err)
    console.error(err)
})
process.on('unhandledRejection',err=>{
    // logger.error(err)
    console.error(err)
})
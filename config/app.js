module.exports = {
    development: {
        port: process.env.DEV_PORT,
        host: process.env.DEV_HOST,
    },
    production: {
        port: process.env.PORT,
        host: process.env.HOST,
    }
}

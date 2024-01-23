module.exports = {
    development: {
        port: process.env.DEV_MG_PORT,
        host: process.env.DEV_MG_HOST,
        db: process.env.DEV_MG_DATABASE,
        username: process.env.DEV_MG_USERNAME,
        password: process.env.DEV_MG_PASSWORD
    },
    production: {
        port: process.env.MG_PORT,
        host: process.env.MG_HOST,
        db: process.env.MG_DATABASE,
        username: process.env.MG_USERNAME,
        password: process.env.MG_PASSWORD
    }
}

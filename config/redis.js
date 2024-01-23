module.exports = {
    development: {
        secret: process.env.DEV_RD_SECRET,
        sessionName: process.env.DEV_RD_SESSION_NAME,
        host: process.env.DEV_RD_HOST,
        port: process.env.DEV_RD_PORT,
        password: process.env.DEV_RD_PASSWORD
    },
    production: {
        secret: process.env.RD_SECRET,
        sessionName: process.env.RD_SESSION_NAME,
        host: process.env.RD_HOST,
        port: process.env.RD_PORT,
        password: process.env.RD_PASSWORD
    }
}

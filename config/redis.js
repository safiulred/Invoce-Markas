module.exports = {
    development : {
        secret:'markatnett',
        sessionName : 'invoicenet',
        host : 'localhost',
        port : 12315,
        password : '{SHA512}d6+Wcw6WHqSzDR/Xj+kriXUHMorgfZGt7zuj3GusoOUuybLuIezOHwaNCRto7Bicdw8d9ft9HNldlThp0rV60w=='
    },
    production : {
        secret:'markatnett',
        sessionName : 'invoicenet',
        host : 'localhost',
        port : 6379,
        password : ''
    }
}

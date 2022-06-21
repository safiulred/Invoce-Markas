const moment = require('moment')

moment.locale('ID')
module.exports.Home = async (req, res, next) => {
    return res.render('pages/cutomer',{
        title : 'Daftar Pelanggan'
    })
}

module.exports.dataTable = async (req, res, next) => {
    
}
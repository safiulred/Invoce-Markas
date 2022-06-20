
module.exports.index = async (req, res, next) => {
    const user = req.user
    return res.render('layout',{
        title : 'Dashboard'
    })
}

module.exports.Home = async (req, res, next) => {
    return res.send('HOME')
}
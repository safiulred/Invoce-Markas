const ModelSetting = require('../models/setting')

module.exports.Home = (req, res, next) => {
    ModelSetting.findOne({})
        .then((result) => {
            console.log(result)
            return res.render('pages/setting',{
                data : result
            })
        })
        .catch((err) => {
            return next(err)
        })
}
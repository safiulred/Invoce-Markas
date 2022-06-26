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

module.exports.updateData = (req, res, next) => {
    const body = req.body
    try {
        const dataUpdate = {
            ...body
        }

        console.log('[UPDATE SETTING] ', dataUpdate)
    } catch (error) {
        return res.json({status : 402, message : error.message})
    }
}
const {SettingModel} = require('../models')

module.exports.Home = (req, res, next) => {
    SettingModel.findOne({})
        .then((result) => {
            return res.render('pages/setting',{
                data : result,
                isData : result?true:false
            })
        })
        .catch((err) => {
            return next(err)
        })
}

module.exports.updateData = (req, res, next) => {
    const body = req.body
    const file = req.file
    console.log('[BODY] ', body)
    console.log('[FILE] ', req.file)
    try {
        const id = body._id
        const dataUpdate = {
            ...body,
            logo : file&&file.filename?file.filename:null,
        }

        delete dataUpdate._id
        if (id) {
            console.log('[UPDATE SETTING] ', dataUpdate)
            SettingModel.updateOne({_id : id},{
                $set : dataUpdate
            }).then((result) => {
                return res.json({status : 200, message : 'Successfull Updated'})
            }).catch((err) => {
                return res.json({status : 402, message : err.message})
            })
        } else {
            SettingModel.create(dataUpdate)
                .then((result) => {
                    return res.json({status : 200, message : 'Successfull Saved'})
                })
                .catch((err) => {
                    return res.json({status : 402, message : err.message})
                })
        }
    } catch (error) {
        return res.json({status : 402, message : error.message})
    }
}
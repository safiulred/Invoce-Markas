const bcrypt = require ('bcryptjs');
const Session = require('../libs/session')

const {UserModel} = require('../models/')

module.exports.viewAuth = async (req, res, next) => {
    // console.log(req.session)
    if (req.session.user) {
        return res.redirect('/main');
    }

    return res.render('login')
}

module.exports.checkAuth = async (req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user;
        return next()
    } else {
        return res.redirect('/login')
    }
}

module.exports.loginUser = async (req, res, next) => {
    const body = req.body
    try {
        const user = await UserModel.findOne({username : body.username})
        if (!user) {
            return res.json({status : 404, message : 'data user tidak di temukan'})
        }

        if ( !bcrypt.compareSync( body.password , user.password ) ) {
            return res.json({
                status : 403,
                message : 'Password Anda Salah'
            });
        } else {
            const token = await Session.sign(user)
            const payload = {
                status : 200,
                user : user,
                token : token,
            }

            req.session.token = token
            req.session.user = user
            req.session.save();
            return res.status(200).json(payload)
        }
    } catch (error) {
        return res.status(401).json({status : 401, message : error.message})
    }
}

module.exports.logout = async (req, res) => {
    req.session.destroy();
    return res.redirect('/login');
}
const {UserModel} = require('../models')

const {encryptPwd} = require('../libs/generate')
const moment = require('moment')
moment.locale('ID')

module.exports.Home = async (req, res, next) => {
    return res.render('pages/manage/users',{
        title : 'User'
    })
}

module.exports.dataTable = async (req, res, next) => {
    const userLogin = req.user
    try {
        const where = {}
        UserModel.find(where)
            .sort({created_at : 1})
            .skip(parseInt(req.query.start))
            .limit(parseInt(req.query.length))
            .then(async (result) => {
                // console.log(result)
                const output = result.map((r) => {
                    let status = r.active ? `<small class='badge bg-color-greenLight'>Aktif</small>`: `<small class='badge bg-color-red'>Tidak Aktif</small>`;
                    let created_at = `<small class='text text-c-danger'>${moment(r.created_at).utc().add(7, 'hours').format('DD MMMM YYYY HH:mm:ss')}</small>`;
                    let updated_at = `<small class='text text-c-danger'>${moment(r.updated_at).utc().add(7, 'hours').format('DD MMMM YYYY HH:mm:ss')}</small>`;

                    let action = `
                        <div class = 'btn-group'>
                            <button class = 'btn btn-primary dropdown-toggle' data-toggle = 'dropdown' aria-expanded = 'false' id='dropdown-${r.id}'>
                                action
                                <span class = 'caret'></span>
                            </button>

                            <ul class = 'dropdown-menu' aria-labelledby="dropdown-${r.id}">
                                <li>
                                    <a onclick='return getData("${r.id}");' href='javascript:void(0);' title='Edit User'>Edit</a>
                                </li>
                                <li>
                                    <a onclick='return removeData("${r.id}");' href='javascript:void(0);' title='Delete Group'>Delete</a>
                                </li>
                                <li class = 'divider'/>
                                <li>
                                    <a onclick='return resetPwd("${r.id}");' href='javascript:void(0);' title='Reset Password'>Reset Password</a>
                                </li>
                            </ul>
                        </div>
                    `;
                    
                    return {
                        _id : r._id,
                        action : action,
                        nama : r.nama,
                        username : r.username,
                        status : status,
                        created_at : created_at,
                        updated_at : updated_at
                    }
                })

                // console.log('[OUTPUT] ', output)
                UserModel.countDocuments(where).then((total) => {
                    return res.json({
                        draw: req.query.draw,
                        recordsFiltered : total,
                        recordsTotal : total,
                        data : output
                    });
                });
            })
            .catch((err) => {
                console.log('[ERROR DATATABLE] ', err.message);
                return res.json({
                    draw: req.query.draw,
                    recordsFiltered : 0,
                    recordsTotal : 0,
                    data : []
                });
            })
    } catch (error) {
        console.log('[ERROR DATATABLE] ', err.message);
        return res.json({
            draw: req.query.draw,
            recordsFiltered : 0,
            recordsTotal : 0,
            data : []
        });
    }
}

module.exports.createForm = async (req, res, next) => {
    const type = req.params.type;
    const userLogin = req.user;
    let query = req.query;

    let user = await UserModel.findOne({_id : query.id});

    return res.render('pages/manage/formUser',{
        type : type,
        user : user,
    });
}

module.exports.saveUser = async (req, res, next) => {
    const body = req.body
    console.log('[BODY] ', body);

    let password = encryptPwd(body.password);
    let dataInsert = {
        nama : body.nama.toLowerCase(),
        username : body.username,
        password : password,
        isAdmin : body.isAdmin,
        active : body.status,
        created_at : moment().utc().toDate()
    }
    console.log('[INSERT] ', dataInsert)
    UserModel.create(dataInsert)
        .then((result) => {
            return res.json({status : 200, message : 'Successfull Save User'})
        })
        .catch((err) => {
            return res.status(402).json({status : 402, message : err.message})
        })
}

module.exports.updateUser = async (req, res, next) => {
    const body = req.body
    console.log('[BODY] ', body);

    let dataUpdate = {
        nama : body.nama.toLowerCase(),
        active : body.status,
        isAdmin : body.isAdmin,
        updated_at : moment().utc().toDate(),
    }

    console.log('[DATA UPDATE] ', dataUpdate);
    UserModel.updateOne({_id : body.id}, {
        $set : dataUpdate,
    }).then((result) => {
        return res.json({status : 200, message : 'Successfull Update User'})
    }).catch((err) => {
        return res.json({ status : 402, message : 'Internal Server Error'});
    })
}

module.exports.deleteUser = async (req, res, next) => {
    const {id} = req.body
    UserModel.deleteOne({_id : id}).then((result) => {
        return res.json({status : 200, message : 'Successfull Delete User'})
    }).catch((err) => {
        return res.json({ status : 500, message : err.message});
    })
}

module.exports.resetPwd = async (req, res, next) => {
    const body = req.body
    const password = encryptPwd(body.password)

    UserModel.updateOne({_id : body.id}, { $set : { password : password}})
        .then((rows) => {
            return res.json({status : 200, message : 'Successfull Reset Password'});
        })
        .catch((err) => {
            return res.json({ status : 500, message : 'Internal Server Error'});
        });
}
const ModelUser = require('../models/users')

const moment = require('moment')
moment.locale('ID')
module.exports.Home = async (req, res, next) => {
    return res.render('pages/manage/users',{
        title : 'User'
    })
}

module.exports.dataTable = async (req, res, next) => {
    const userLogin = req.user
    console.log('[LIST USER]')
    try {
        const where = {}
        ModelUser.find(where)
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
                ModelUser.countDocuments(where).then((total) => {
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
module.exports.saveUser = async (req, res, next) => {}
module.exports.viewUser = async (req, res, next) => {}
module.exports.upadateUser = async (req, res, next) => {}
module.exports.Delete = async (req, res, next) => {}
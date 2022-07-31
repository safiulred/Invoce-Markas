const {CustomerModel, UserModel, SettingModel} = require('../models')

const {convertToNominal} = require('../libs/generate')
const moment = require('moment')
moment.locale('ID')

module.exports.Home = async (req, res, next) => {
    const user = req.user
    const tgl_awal = moment().startOf("month").format("YYYY-MM-DD");
    const tgl_akhir = moment().endOf('month').format('YYYY-MM-DD');
    const kolektor = await UserModel.find({
        _id : {
            $ne : user._id
        },
        isAdmin : false
    })
    // console.log('[KOLEKTOR] ', kolektor)
    return res.render('pages/customer/view',{
        title : 'Daftar Pelanggan',
        tgl_awal : tgl_awal,
        tgl_akhir : tgl_akhir,
        kolektor : kolektor,
        isAdmin : req.user.isAdmin
    })
}

module.exports.getPrint = async (req, res, next) => {
    const userLogin = req.user;
    const isAdmin = userLogin.isAdmin
    let {tgl_awal, tgl_akhir, status, nama, kolektor} = req.body;
    let filterTanggal = {}
    let month, year
    try {
        let  where = {}

        if (!isAdmin) {
            where['pic'] = userLogin._id
        }
        else {
            if (kolektor!=='all') {
                where['pic'] = kolektor
            }
        }

        if (nama&&nama!=='') {
            where['nama'] = new RegExp(nama.replace(/\\/g, ""), 'gi')
        }

        if (tgl_awal != 'all') {
			filterTanggal.tgl_awal = moment(tgl_awal, "YYYY-MM-DD").startOf("days").toDate()
            // where['date'] = moment.utc(filterTanggal.tgl_awal).format('DD')
            // month = moment.utc(filterTanggal.tgl_awal).format('MMMM')
            // year = moment.utc(filterTanggal.tgl_awal).format('YYYY')
            where['date'] = moment(tgl_awal, 'YYYY-MM-DD').format('DD')
            month = moment(tgl_awal, 'YYYY-MM-DD').format('MMMM')
            year = moment(tgl_awal, 'YYYY-MM-DD').format('YYYY')
		}
        else {
            month = moment().format('MMMM')
            year = moment().format('YYYY')
        }

        if (status != 'all') {
			where['active'] = Number(status)==0?true:false
		}

        const rowsPerPage = req.body.rowsPerPage
        const currentPage = req.body.currentPage
        const totalData = await CustomerModel.countDocuments({
            ...where
        })

        const totalPages = totalData%rowsPerPage===0? parseInt(totalData/rowsPerPage):parseInt(totalData/rowsPerPage)+1
        const offset = rowsPerPage?(currentPage-1) * rowsPerPage:0
        const limit = rowsPerPage
        console.log({where})
        console.log({totalPages, offset, limit, totalData})
        CustomerModel.find(where)
            .sort({nama : 1})
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .then(async (result) => {
                const output = result.map((r) => {
                    const billing_date =  moment(r.billing_date).utc().add(7, 'hours').format('DD MMMM YYYY')
                    const date = moment(billing_date, 'DD MMMM YYYY').format('DD')
                    const periode = `${date} ${month}`
                    return {
                        ...r._doc,
                        periode : periode,
                        tagihan : convertToNominal(r.tagihan),
                        month : month,
                        billing_date : `${date} ${month} ${year}`,
                        installation_date : moment(r.installation_date).utc().add(7, 'hours').format('DD MMMM YYYY'),
                    }
                })

                const setting = await SettingModel.findOne()
                res.status(200).send({output, totalPages, totalData, setting})
            })
            .catch((err)=>{
                res.status(500).send(err.message)
            })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.viewPrint = async (req, res, next) => {
    const setting = await SettingModel.findOne()
    return res.render('pages/customer/preview',{
        setting : setting
    })
}

module.exports.dataTable = async (req, res, next) => {
    const userLogin = req.user;
    const isAdmin = userLogin.isAdmin
    const query = req.query;
    let {tgl_awal, tgl_akhir, status, nama, kolektor} = query;
    let filterTanggal = {}
    let month,year
    try {
        
        let  where = {}
        if (!isAdmin) {
            where['pic'] = userLogin._id
        }
        else {
            if (kolektor!=='all') {
                where['pic'] = kolektor
            }
        }

        if (nama&&nama!=='') {
            where['nama'] = new RegExp(nama.replace(/\\/g, ""), 'gi')
        }

        if (tgl_awal != 'all') {
            filterTanggal.tgl_awal = moment(tgl_awal, "YYYY-MM-DD").startOf("days").toDate()
            // where['date'] = moment.utc(filterTanggal.tgl_awal).format('DD')
            where['date'] = moment(tgl_awal, 'YYYY-MM-DD').format('DD')
            month = moment(tgl_awal, 'YYYY-MM-DD').format('MMMM')
            year = moment(tgl_awal, 'YYYY-MM-DD').format('YYYY')
		}
        else {
            month = moment().format('MMMM')
            year = moment().format('YYYY')
        }

        if (status != 'all') {
			where['active'] = Number(status)==0?true:false
		}

        console.log(where)
        CustomerModel.find(where)
            .sort({billing_date: 1})
            .skip(parseInt(req.query.start))
            .limit(parseInt(req.query.length))
            .then(async (result) => {
                const output = result.map((r) => {
                    let status = r.active ? `<small class='badge bg-color-greenLight'>Aktif</small>`: `<small class='badge bg-color-red'>Tidak Aktif</small>`;
                    let btnChangePic = `
                        <li>
                            <a onclick='return viewPic("${r.id}","${r.pic}");' href='javascript:void(0);' title='Edit'>Edit Kolektor</a>
                        </li>
                    `
                    let btnUpdateTag = `
                        <li>
                            <a onclick='return updateTag("${r.id}","${r.tagihan}");' href='javascript:void(0);' title='Edit Tagihan'>Edit Tagihan</a>
                        </li>
                    `
                    let action = `
						<div class = 'btn-group'>
							<button class = 'btn btn-primary dropdown-toggle' data-toggle = 'dropdown' aria-expanded = 'false' id='dropdown-${r.id}'>
								action
								<span class = 'caret'></span>
							</button>

							<ul class = 'dropdown-menu' aria-labelledby="dropdown-${r.id}">
								<li>
									<a onclick='return getData("${r.id}");' href='javascript:void(0);' title='Edit'>Edit</a>
								</li>
								<li>
									<a onclick='return removeData("${r.id}");' href='javascript:void(0);' title='Delete'>Delete</a>
								</li>
                                ${btnUpdateTag}
                                ${isAdmin? btnChangePic : ''}
							</ul>
						</div>
					`;

                    const billing_date = moment(r.billing_date).utc().add(7, 'hours').format('DD MMMM YYYY')
                    const date = moment(billing_date, 'DD MMMM YYYY').format('DD')
                    return {
                        _id : r._id,
                        action : action,
                        customer : `
                            <small>
                                Nama : <b>${r.nama.toUpperCase()}</b><br/>
                                Telp : ${r.telp}<br/>
                                Email : ${r.email}<br/>
                            </small>
                        `,
                        company_name : `<small>${r.company_name?r.company_name:''}</small>`,
                        alamat : `<small>${r.alamat?r.alamat.toUpperCase():'-'}</small>`,
                        tagihan : isAdmin?`<b>${convertToNominal(r.tagihan)}</b>`:'-',
                        billing_date : `${date} ${month} ${year}`,
                        status : `<center>${status}</center>`,
                    }
                })

                CustomerModel.countDocuments(where).then((total) => {
					return res.json({
						draw: req.query.draw,
						recordsFiltered : total,
						recordsTotal : total,
						data : output
					});
				});
            })
            .catch((err) => {
                console.log(err)
                return res.json({
                    draw: req.query.draw,
                    recordsFiltered : 0,
                    recordsTotal : 0,
                    data : []
                });
            })

    } catch (error) {
        console.log('[ERROR DATATABLE] ', error.message);
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

    let customer = await CustomerModel.findOne({_id : query.id});
    if (customer) {
        customer['tgl_pasang'] = moment(customer.installation_date).utc().add(7, 'hours').format('YYYY-MM-DD')
        customer['tgl_bayar'] = moment(customer.billing_date).utc().add(7, 'hours').format('YYYY-MM-DD')
    }

    // console.log(customer)
    return res.render('pages/customer/form',{
        type : type,
        customer : customer,
    });
}

module.exports.saveCustomer = async (req, res, next) => {
    const body = req.body
    // console.log(body)
    try {
        delete body.id
        const date = moment.utc(moment(body.tgl_bayar, 'YYYY-MM-DD')).format('DD')
        // console.log({month})
        const dataInsert = {
            ...body,
            active: Number(body.status)==0?true:false,
            date : date,
            billing_date : moment.utc(moment(body.tgl_bayar, 'YYYY-MM-DD')).toDate(),
            installation_date : moment.utc(moment(body.tgl_pasang, 'YYYY-MM-DD')).toDate(),
            pic : req.user._id,
            created_at : moment().utc().toDate()
        }

        delete dataInsert.tgl_pasang
        delete dataInsert.tgl_bayar
        console.log('[INSERT] ', dataInsert)
        CustomerModel.create(dataInsert)
            .then((result) => {
                return res.json({status : 200, message : 'Successfull Save Customer'})
            })
            .catch((err) => {
                return res.json({status : 402, message : err.message})
            })
    } catch (error) {
        console.log(error)
        return res.json({status : 402, message : error.message})
    }
}

module.exports.updateCustomer = async (req, res, next) => {
    const body = req.body
    try {
        const id = body.id
        const date = moment.utc(moment(body.tgl_bayar, 'YYYY-MM-DD')).format('DD')
        const dataUpdate = {
            ...body,
            active: Number(body.status)==0?true:false,
            date : date,
            billing_date : moment.utc(moment(body.tgl_bayar, 'YYYY-MM-DD')).toDate(),
            installation_date : moment.utc(moment(body.tgl_pasang, 'YYYY-MM-DD')).toDate(),
            // pic : req.user._id,
            updated_at : moment().utc().toDate()
        }

        delete dataUpdate.id
        delete dataUpdate.tgl_pasang
        delete dataUpdate.tgl_bayar
        console.log('[UPDATE] ', dataUpdate)
        CustomerModel.updateOne({_id : id}, {
            $set : dataUpdate
        }).then((result) => {
            return res.json({status : 200, message : 'Successfull Update Customer'})
        }).catch((err) => {
            return res.json({status : 402, message : err.message})
        })
    } catch (error) {
        return res.json({status : 402, message : error.message})
    }
}

module.exports.removeCustomer = async (req, res, next) => {
    const {id} = req.body
    try {
        CustomerModel.deleteOne({_id : id})
            .then((result) => {
                return res.json({status : 200, message : 'OK'})
            })
            .catch((err) => {
                return res.json({status : 402, message : err.message})
            })
    } catch (error) {
        return res.json({status : 402, message : error.message})
    }
}

module.exports.updateTag = async (req, res, next) => {
    const {id, tagihan} = req.body
    try {
        CustomerModel.updateOne({_id : id},{
            $set : {
                tagihan : tagihan
            }
        }).then((result) => {
            return res.json({status : 200, message : 'Successfull'})
        }).catch((err) => {
            return res.json({status : 402, message : err.message})
        })
    } catch (error) {
        return res.json({status : 402, message : error.message})
    }
}

module.exports.getKolektor = (req, res) => {
    const user = req.user
    UserModel.find({isAdmin:false})
        .sort({nama : 1})
        .then(users=>{
            res.status(200).send(users)
        }) 
        .catch(err=>{
            res.status(500).send([])
        })
}

module.exports.updateKolektor = (req, res, next) => {
    const {id, userId} = req.body
    CustomerModel.updateOne({_id : id},{$set : {pic : userId}})
        .then(result=>{
            res.send({status:200})
        })
        .catch(err=>{
            res.send({status:500})
        })
}
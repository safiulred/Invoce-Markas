module.exports = exports = (app) => {
    const {upload} = require('../libs/upload')

    const Auth = require('./auth')
    const Dashboard = require('./dashboard')
    const Users = require('./users')
    const Customer = require('./customer')
    const Setting = require('./setting')

    const isAdmin = require('./isadmin')

    app.get('/', (req, res) => {
        return res.redirect('/main')
    })
    
    app.get('/login', Auth.viewAuth)
    app.post('/login', Auth.loginUser)
    app.get('/logout', Auth.logout)

    app.use(Auth.checkAuth)

    app.get('/main', Dashboard.index)
    app.get('/dashboard', Dashboard.Home)

    app.get('/users', isAdmin, Users.Home)
    app.get('/users/dataTable', isAdmin, Users.dataTable)
    app.get('/users/createForm/:type', isAdmin, Users.createForm)
    app.post('/users/save', isAdmin, Users.saveUser)
    app.post('/users/update', isAdmin, Users.updateUser)
    app.post('/users/remove', isAdmin, Users.deleteUser)
    app.post('/users/resetPwd', isAdmin, Users.resetPwd)

    app.get('/customer', Customer.Home)
    app.get('/customer/dataTable', Customer.dataTable)
    app.get('/customer/createForm/:type', Customer.createForm)
    app.post('/customer/save', Customer.saveCustomer)
    app.post('/customer/update', Customer.updateCustomer)
    app.post('/customer/remove', Customer.removeCustomer)
    app.post('/customer/update-tagihan', Customer.updateTag)
    app.get('/customer/list-preview', Customer.viewPrint)
    app.post('/customer/list-preview', Customer.getPrint)
    app.post('/customer/kolektor', isAdmin, Customer.getKolektor)
    app.post('/customer/update-kolektor', isAdmin, Customer.updateKolektor)

    app.get('/setting-general', isAdmin, Setting.Home)
    app.post('/setting-general/proses', isAdmin, upload.single('logo'), Setting.updateData)
}
module.exports = exports = (app) => {

    const Auth = require('./auth')
    const Dashboard = require('./dashboard')
    const Users = require('./users')
    const Customer = require('./customer')

    app.get('/', (req, res) => {
        return res.redirect('/main')
    })
    
    app.get('/login', Auth.viewAuth)
    app.post('/login', Auth.loginUser)
    app.get('/logout', Auth.logout)

    app.use(Auth.checkAuth)

    app.get('/main', Dashboard.index)
    app.get('/dashboard', Dashboard.Home)

    app.get('/users', Users.Home)
    app.get('/users/dataTable', Users.dataTable)
    app.get('/users/createForm/:type', Users.createForm)
    app.post('/users/save', Users.saveUser)
    app.post('/users/update', Users.updateUser)
    app.post('/users/remove', Users.deleteUser)
    app.post('/users/resetPwd', Users.resetPwd)

    app.get('/customer', Customer.Home)
}
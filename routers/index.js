module.exports = exports = (app) => {

    const Auth = require('./auth')
    const Dashboard = require('./dashboard')
    const Users = require('./users')

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
}
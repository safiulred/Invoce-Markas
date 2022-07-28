module.exports = (req, res, next) => {
    const user = req.user;
    if (user.isAdmin) {
        next()
    }
    else {
        res.send('SORRY YOU CAN NOT ACCESS THIS PAGE  !!!')
    }
}
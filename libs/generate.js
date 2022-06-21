const bcrypt = require('bcrypt-nodejs');

module.exports.encryptPwd = (pwd) => {
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(pwd,salt);
    return password;
}
const bcrypt = require('bcrypt-nodejs');

module.exports.encryptPwd = (pwd) => {
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(password,salt);
    return password;
}
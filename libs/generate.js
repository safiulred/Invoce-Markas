const bcrypt = require('bcrypt-nodejs');

module.exports.encryptPwd = (pwd) => {
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(pwd,salt);
    return password;
}

module.exports.convertToRupiah = (angka) => {
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
    return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
}

module.exports.convertToNominal = (angka) => {
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
    return rupiah.split('',rupiah.length-1).reverse().join('');
}
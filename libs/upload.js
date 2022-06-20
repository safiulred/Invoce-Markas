const fs = require('fs')
const path = require('path')
const multer = require('multer')
const moment = require('moment');

moment.locale('ID');
const dateNow = moment().format('DDMMYYYY');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + '/../public/uploads');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		let filename = `${uniqueSuffix}-${dateNow}.png`
		cb(null, filename)
	}
});

const deleteFile = async (file_path) => {
	return new Promise (async (resovle , reject) => {
		let target = path.normalize(__dirname+'/..');
		fs.unlink(`${target}/public/uploads/${file_path}`, async (err) => {
			console.log(err);
			if (err) return resovle(false);
			return resovle(true);
		});
	});
}

const upload = multer({ storage: storage });

module.exports = {upload, deleteFile}
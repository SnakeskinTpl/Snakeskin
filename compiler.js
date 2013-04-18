/////////////////////////////////
//// Компиляция
/////////////////////////////////

var fs = require('fs'),
	file, newFile,

	commonjs;

global.Snakeskin = require('./snakeskin');

if (process.argv.length < 3) {
	console.log('Usage: node compiler fname.ss');
} else {
	file = process.argv[2];
	commonjs = process.argv[3] === '--commonjs';
	newFile = process.argv[commonjs ? 4 : 3] || (file + '.js');

	fs.readFile(file, function (err, data) {
		var res;

		if (err) {
			console.log(err);
		} else {
			res = Snakeskin.compile(String(data), commonjs, null, {file: file});
			fs.writeFile(newFile, res, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log('File "' + file + '" has been successfully compiled (' + newFile + ').');
				}
			});
		}
	});
}
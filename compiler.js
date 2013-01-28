/////////////////////////////////
//// Компиляция
/////////////////////////////////

var fs = require('fs'),
	Snakeskin = require('./snakeskin'),
	file, newFile,
	commonjs,
	res;

if (process.argv.length < 3) {
	console.log('Usage: node compiler fname.ss');
} else {
	file = process.argv[2];
	commonjs = process.argv[3] === '--commonjs';
	newFile = process.argv[commonjs ? 4 : 3] || (file + '.js');
	
	fs.readFile(file, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			res = Snakeskin.compile(String(data), commonjs);
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
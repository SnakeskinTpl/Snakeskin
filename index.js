/**!
 * Скрипт для консоли
 */

var fs = require('fs'),
	file, newFile,
	commonJS;

global.Snakeskin = require('./snakeskin');

if (process.argv.length < 3 || process.argv[2] === '-h' || process.argv[2] === '--help') {
	console.log('Usage: node compiler fname.ss [--commonjs | -cjs]');

} else {
	file = process.argv[2];
	commonJS = process.argv[3] === '--commonjs' || process.argv[3] === '-cjs';
	newFile = process.argv[commonJS ? 4 : 3] || (file + '.js');

	fs.readFile(file, function (err, data) {
		var res;

		if (err) {
			console.log(err);

		} else {
			res = Snakeskin.compile(String(data), commonJS, {file: file});

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
var fs = require('fs');
var path = require('path');

(function exec(dirname) {
	fs.readdirSync(dirname).forEach((el) => {
		var src = path.join(dirname, el);
		var stats = fs.statSync(src);

		if (stats.isDirectory()) {
			exec(src);

		} else if (stats.isFile()) {
			let ext = path.extname(el);

			if (ext === '.es6') {
				let file = fs.readFileSync(src);

				fs.writeFileSync(src, file + ' ');
				fs.writeFileSync(src, file);
			}
		}
	});
})(__dirname);
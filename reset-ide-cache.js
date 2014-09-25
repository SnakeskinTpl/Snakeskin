var fs = require('fs'),
	path = require('path');

(function exec(dirname) {
	fs.readdirSync(dirname).forEach(function(el)  {
		var src = path.join(dirname, el);
		var stats = fs.statSync(src);

		if (stats.isDirectory()) {
			exec(src);

		} else if (stats.isFile()) {
			var ext = path.extname(el);

			if (ext === '.es6') {
				var file = fs.readFileSync(src);

				fs.writeFileSync(src, file + ' ');
				fs.writeFileSync(src, file);
			}
		}
	});
})(__dirname);

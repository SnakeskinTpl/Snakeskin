var __NEJS_THIS__ = this;
var fs = require('fs');
var path = require('path');

(function exec(dirname) {
	var __NEJS_THIS__ = this;
	fs.readdirSync(dirname).forEach(function (el) {
		
		var src = path.join(dirname, el);
		var stats = fs.statSync(src);

		if (stats.isDirectory()) {
			exec(src);

		} else if (stats.isFile()) {
			var ext = path.extname(el);

			if (ext === '.jsn') {
				var file = fs.readFileSync(src);

				fs.writeFileSync(src, file + ' ');
				fs.writeFileSync(src, file);
			}
		}
	});
})(__dirname);
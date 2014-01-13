var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

if (typeof window === 'undefined') {
	var fs = require('fs');
	var path = require('path');
	var jossy = require('jossy');

	Snakeskin.compileFile = function (file, params) {
		var __NEJS_THIS__ = this;
		var save = params.output || file + '.js',
			commonJS = typeof params.commonJS === 'undefined' ? true : params.commonJS;

		function action(data) {
			var __NEJS_THIS__ = this;
			fs.writeFileSync(save, Snakeskin.compile(String(data), commonJS, {file: file}));
		}

		if (params.build) {
			jossy.compile(file, null, null, function (err, data) {
				
				if (err) {
					console.log(err);

				} else {
					action(data);
				}
			});

		} else {
			action(fs.readFileSync(file));
		}
	};
}
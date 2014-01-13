var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

var fs = require('fs');
var path = require('path');
var assert = require('assert');

var snakeskin = require('./build/snakeskin');
var testFolder = path.resolve(__dirname, 'tests');

var tpl = {};

snakeskin.compile(
	fs.readFileSync(path.join(__dirname, 'test.ss')),
	{context: tpl}
);

/*
fs.readdirSync(testFolder).forEach((file) => {
	if (path.extname(file) === '.ss') {
		let src = path.join(testFolder, file);
		let txt = String(fs.readFileSync(src)).split('###');

		txt.forEach((el, i) => {
			txt[i] = el.trim();
		});

		let starts = txt[0].split(/[\n\r]+/);
		let results = txt[2].split('***');

		try {
			fs.writeFileSync(src + '.js', snakeskin.compile(txt[1], true));

		} catch (err) {
			console.error('File: ' + file);
			throw err;
		}

		let tpl = require('./tests/' + file + '.js').liveInit('../build/snakeskin.live');

		starts.forEach((el, i) => {
			let params = el.split(' ; ');

			try {
				assert.equal(
					eval(
						'tpl.' + params[0] + '.apply(' +
							'tpl,' +
							'params.slice(1).map(function (el) {' +
								'try {' +
									'return Function("return " + el)();' +

								'} catch (ignore) {' +
									'return el;' +
								'}' +
							'})' +
						').trim()'
					),

					results[i].trim()
				);

			} catch (err) {
				console.error('File: ' + file);
				throw err;
			}
		});
	}
});*/

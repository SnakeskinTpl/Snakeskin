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

var asserts = [];

fs.readdirSync(testFolder).forEach(function (file) {
	
	if (path.extname(file) === '.ss') {
		var src = path.join(testFolder, file);
		var txt = String(fs.readFileSync(src)).split('###');

		txt.forEach(function (el, i) {
			
			txt[i] = el.trim();
		});

		var starts = txt[0].split(/[\n\r]+/);
		var results = txt[2].split('***');

		var obj = {
			tpl: txt[1],
			id: path.basename(file, '.ss'),
			js: []
		};

		asserts.push(obj);

		try {
			fs.writeFileSync(src + '.js', snakeskin.compile(txt[1], true));

		} catch (err) {
			console.error('File: ' + file);
			throw err;
		}

		var tpl = require('./tests/' + file + '.js').init(snakeskin);

		starts.forEach(function (el, i) {
			
			var params = el.split(' ; ');

			try {
				obj.js.push('equal(' + params[0] + '(' + params.slice(1) + ').trim(), \'' + results[i].trim() + '\');');

				assert.equal(
					eval('tpl.' + params[0] + '(' + params.slice(1) + ').trim()'),
					results[i].trim()
				);

			} catch (err) {
				console.error('File: ' + file);
				throw err;
			}
		});
	}
});

console.log(asserts);

fs.writeFileSync(path.join(__dirname, 'tests', 'tests.html'), tpl.test(asserts));
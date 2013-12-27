var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

var fs = require('fs');
var path = require('path');
var assert = require('assert');

var snakeskin = require('./snakeskin');
var testFolder = path.resolve(__dirname, 'tests');

fs.readdirSync(testFolder).forEach(function (el) {
	
	if (path.extname(el) === '.ss') {
		var src = path.join(testFolder, el);
		var txt = String(fs.readFileSync(src)).split('###');

		txt.forEach(function (el, i) {
			
			txt[i] = el.trim();
		});

		var starts = txt[0].split(/[\n\r]+/);
		var results = txt[2].split('***');

		fs.writeFileSync(src + '.js', snakeskin.compile(txt[1], true));

		var tpl = require('./tests/' + el + '.js').liveInit('../snakeskin');

		starts.forEach(function (el, i) {
			
			var params = el.split(' ');

			assert.equal(tpl[params[0]].apply(tpl, params.slice(1)).trim(), results[i].trim());
		});
	}
});
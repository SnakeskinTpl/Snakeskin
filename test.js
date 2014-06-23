var fs = require('fs');
var path = require('path');
var assert = require('assert');

var snakeskin = require('./build/snakeskin.min');
var testFolder = path.resolve(__dirname, 'tests');

var tpls = {};

snakeskin.compile(
	fs.readFileSync(path.join(__dirname, 'test.ss')),
	{context: tpls}
);

/*var asserts = [];

fs.readdirSync(testFolder).forEach((file) => {
	if (path.extname(file) === '.ss') {
		let src = path.join(testFolder, file);
		let txt = String(fs.readFileSync(src)).split('###');

		txt.forEach((el, i) => {
			txt[i] = el.trim();
		});

		let starts = txt[0].split(/[\n\r]+/);
		let results = txt[2].split('***');

		let obj = {
			tpl: txt[1],
			id: path.basename(file, '.ss'),
			js: []
		};

		asserts.push(obj);

		try {
			fs.writeFileSync(`${src}.js`, snakeskin.compile(txt[1], true));

		} catch (err) {
			console.error(`File: ${file}`);
			throw err;
		}

		let tpl = require(`./tests/${file}.js`).init(snakeskin);

		starts.forEach((el, i) => {
			let params = el.split(' ; ');

			try {
				obj.js.push(`equal(${params[0]}(${params.slice(1)}).trim(), '${results[i].trim()}');`);

				assert.equal(
					eval(`tpl.${params[0]}(${params.slice(1)}).trim()`),
					results[i].trim()
				);

			} catch (err) {
				console.error(`File: ${file}`);
				throw err;
			}
		});
	}
});*/

//fs.writeFileSync(path.join(__dirname, 'tests', 'tests.html'), tpls.test(asserts));
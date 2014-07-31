var fs = require('fs');
var path = require('path');
var assert = require('assert');

var snakeskin = require('./build/snakeskin.min');
var testFolder = path.resolve(__dirname, 'tests');

var tpls = {};

global.i18n = function (str) {
	return str;
};

snakeskin.compile(
	fs.readFileSync(path.join(__dirname, 'test.ss')),
	{
		context: tpls,
		prettyPrint: true
	}
);

var errorPath = path.join(__dirname, 'error.txt');
var asserts = [],
	prfx = -1;

function run(params) {
	var options = JSON.stringify(params);
	prfx++;

	fs.readdirSync(testFolder).forEach((file) => {
		if (path.extname(file) === '.ss') {
			let src = path.join(testFolder, file),
				txt = String(fs.readFileSync(src)).split('###');

			txt.forEach((el, i) => {
				txt[i] = el.trim();
			});

			let starts = txt[0].split(/[\n\r]+/),
				results = txt[2].split('***');

			let obj = {
				tpl: txt[1],
				id: path.basename(file, '.ss'),
				js: []
			};

			if (!prfx) {
				asserts.push(obj);
			}

			try {
				let start = Date.now();
				let res = snakeskin.compile(txt[1], params, {
					file: path.join(testFolder, file)
				});

				if (!prfx) {
					console.log(`${file} ${Date.now() - start}ms`);
				}

				fs.writeFileSync(`${src}_${prfx}.js`, res);

			} catch (err) {
				console.error(`File: ${file}`);
				fs.writeFileSync(errorPath, `File: ${file}\n\n${err.message}`);
				throw err;
			}

			let tpl = require(`./tests/${file}_${prfx}.js`).init(snakeskin);

			starts.forEach((el, i) => {
				let params = el.split(' ; '),
					res = '';

				try {
					obj.js.push(`equal(${params[0]}(${params.slice(1)}).trim(), '${results[i].trim()}');`);

					assert.equal(
						(res = eval(`tpl.${params[0]}(${params.slice(1)}).trim()`)),
						results[i].trim()
					);

				} catch (err) {
					console.error(`File: ${file} - ${prfx} (${options}), Tpl: ${params[0]}`);

					fs.writeFileSync(
						errorPath,
						`File: ${file} - ${prfx} (${options}), Tpl: ${params[0]}\n\nResult:\n${res}\n\nExpected:\n${results[i].trim()}\n\nTest:\n${txt[1]}`
					);

					throw err;
				}
			});
		}
	});
}

run({commonJS: true, prettyPrint: true, throws: true});
run({commonJS: true, prettyPrint: true, throws: true});
run({commonJS: true, prettyPrint: true, throws: true, inlineIterators: true});
run({commonJS: true, prettyPrint: true, throws: true, stringBuffer: true});
run({commonJS: true, prettyPrint: true, throws: true, stringBuffer: true, inlineIterators: true});

fs.writeFileSync(path.join(__dirname, 'tests', 'tests.html'), tpls.test(asserts));

if (fs.existsSync(errorPath)) {
	fs.unlinkSync(errorPath);
}
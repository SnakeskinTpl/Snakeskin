var path = require('path');
var fs = require('fs'),
	exists = fs.existsSync || path.existsSync;

var assert = require('assert');
var snakeskin = require('./snakeskin');
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
	var options = JSON.stringify(params),
		debug = params.debug = {};

	prfx++;
	fs.readdirSync(testFolder).forEach(function(file)  {
		if (path.extname(file) === '.ss') {
			var src = path.join(testFolder, file),
				txt = String(fs.readFileSync(src)).split('###');

			txt.forEach(function(el, i)  {
				txt[i] = el.trim();
			});

			var starts = txt[0].split(/[\n\r]+/),
				results = txt[2].split('***');

			var obj = {
				tpl: txt[1],
				id: path.basename(file, '.ss'),
				js: []
			};

			if (!prfx) {
				asserts.push(obj);
			}

			try {
				var start = Date.now();
				var res = snakeskin.compile(txt[1], params, {
					file: path.join(testFolder, file)
				});

				if (!prfx) {
					console.log((("" + file) + (" " + (Date.now() - start)) + "ms"));
				}

				fs.writeFileSync((("" + src) + ("_" + prfx) + ".js"), res);

			} catch (err) {
				fs.writeFileSync(errorPath, (("File: " + file) + ("\n\n" + (err.message)) + ("" + (debug['code'] ? ("\n\nCode:\n\n" + (debug['code'])) : '')) + ""));
				throw err;
			}

			var tpl = require((("./tests/" + file) + ("_" + prfx) + ".js")).init(snakeskin);

			starts.forEach(function(el, i)  {
				var params = el.split(' ; '),
					res = '';

				try {
					obj.js.push((("equal(" + (params[0])) + ("(" + (params.slice(1))) + (").trim(), '" + (results[i].trim())) + "');"));

					// eval нужен чтобы сохранить информацию о типах
					res = eval((("tpl." + (params[0])) + ("(" + (params.slice(1))) + ").trim()"));

					assert.equal(
						res,
						results[i].trim()
					);

				} catch (err) {
					console.error((("File: " + file) + (" - " + prfx) + (" (" + options) + ("), Tpl: " + (params[0])) + ""));

					fs.writeFileSync(
						errorPath,
						(("File: " + file) + (" - " + prfx) + (" (" + options) + ("), Tpl: " + (params[0])) + ("\n\nResult:\n" + res) + ("\n\nExpected:\n" + (results[i].trim())) + ("\n\nTest:\n" + (txt[1])) + ("\n\nCode:\n" + (debug['code'])) + "")
					);

					throw err;
				}
			});
		}
	});
}

run({
	commonJS: true,
	prettyPrint: true,
	throws: true,
	autoReplace: true
});

run({
	commonJS: true,
	prettyPrint: true,
	throws: true,
	autoReplace: true
});

run({
	commonJS: true,
	prettyPrint: true,
	throws: true,
	autoReplace: true,
	inlineIterators: true
});

run({
	commonJS: true,
	prettyPrint: true,
	throws: true,
	autoReplace: true,
	stringBuffer: true
});

run({
	commonJS: true,
	prettyPrint: true,
	throws: true,
	autoReplace: true,
	stringBuffer: true,
	inlineIterators: true
});

fs.writeFileSync(path.join(__dirname, 'tests', 'tests.html'), tpls.test(asserts));

if (exists(errorPath)) {
	fs.unlinkSync(errorPath);
}
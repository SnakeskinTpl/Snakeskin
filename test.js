var fs = require('fs');
var path = require('path');
var assert = require('assert');

var snakeskin = require('./build/snakeskin.min');
var testFolder = path.resolve(__dirname, 'tests');

var tpls = {};

snakeskin.compile(
	fs.readFileSync(path.join(__dirname, 'test.ss')),
	{
		context: tpls,
		prettyPrint: true
	}
);

var asserts = [],
	pref = -1;

function run(params) {
	pref++;
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

			asserts.push(obj);

			try {
				fs.writeFileSync((("" + src) + ("_" + pref) + ".js"), snakeskin.compile(txt[1], params));

			} catch (err) {
				console.error(("File: " + file));
				throw err;
			}

			var tpl = require((("./tests/" + file) + ("_" + pref) + ".js")).init(snakeskin);

			starts.forEach(function(el, i)  {
				var params = el.split(' ; ');

				try {
					obj.js.push((("equal(" + (params[0])) + ("(" + (params.slice(1))) + (").trim(), '" + (results[i].trim())) + "');"));

					assert.equal(
						eval((("tpl." + (params[0])) + ("(" + (params.slice(1))) + ").trim()")),
						results[i].trim()
					);

				} catch (err) {
					console.error((("File: " + file) + (", Tpl: " + (params[0])) + ""));
					throw err;
				}
			});
		}
	});
}

run({commonJS: true, prettyPrint: true});
run({commonJS: true, prettyPrint: true, inlineIterators: true});
run({commonJS: true, prettyPrint: true, stringBuffer: true});
run({commonJS: true, prettyPrint: true, stringBuffer: true, inlineIterators: true});

fs.writeFileSync(path.join(__dirname, 'tests', 'tests.html'), tpls.test(asserts));
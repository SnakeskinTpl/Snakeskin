var path = require('path'),
	fs = require('fs'),
	eol = require('os').EOL;

var assert = require('assert'),
	snakeskin = require('../snakeskin');

snakeskin.importFilters(snakeskin.Filters, 'test.bar');
snakeskin.importFilters({
	'квадрат': function (val) {
		return val * val;
	}
});

global.i18n = function (str) {
	return str;
};

global.returnOne = function () {
	return 1;
};

var testFolder = __dirname,
	buildFolder = path.join(testFolder, 'build');

if (!fs.existsSync(buildFolder)) {
	fs.mkdirSync(buildFolder);
}

global.i18n = function (str) {
	return str;
};

var tpls = snakeskin.compileFile(
	path.join(testFolder, 'test.ss'),
	{
		context: tpls,
		tolerateWhitespace: true
	}
);

var errorPath = path.resolve(testFolder, '../', 'error.txt');
var asserts = [],
	prfx = -1;

function run(params) {
	var options = JSON.stringify(params),
		debug = params.debug = {};

	prfx++;
	fs.readdirSync(testFolder).forEach(function (file) {
		if (path.extname(file) === '.ss') {
			if (file === 'test.ss') {
				return;
			}

			var src = path.join(testFolder, file),
				txt = String(fs.readFileSync(src)).split('###');

			txt.forEach(function (el, i) {
				txt[i] = el.trim();
			});

			var starts = txt[0].split(/[\r\n]+/),
				results = txt[2].split('***');

			var obj = {
				tpl: txt[1],
				id: path.basename(file, '.ss'),
				js: []
			};

			if (!prfx && !/^(?:script|template|include)|_node/.test(file)) {
				asserts.push(obj);
			}

			try {
				var start = Date.now();
				var res = snakeskin.compile(txt[1], params, {
					file: path.join(testFolder, file)
				});

				if (!prfx) {
					console.log(file + ' ' + (Date.now() - start) + 'ms');
				}

				fs.writeFileSync(path.join(path.dirname(src), 'build', path.basename(src) + '_' + prfx + '.js'), res);

			} catch (err) {
				fs.writeFileSync(errorPath, 'File: ' + file + '\n\n' + err.message + (debug['code'] ? '\n\nCode:\n\n' + debug['code'] : ''));
				throw err;
			}

			var tpl = require('./build/' + file + '_' + prfx + '.js').init(snakeskin);

			starts.forEach(function (el, i) {
				var params = el.split(' ; '),
					res = '';

				try {
					results[i] = (results[i] || '').trim();
					obj.js.push('equal(' + params[0] + '(' + params.slice(1) + ').trim(), \'' + results[i].replace(/(\\|')/g, '\\$1') + '\');');

					// eval нужен чтобы сохранить информацию о типах
					res = eval('tpl.' + params[0] + '(' + params.slice(1) + ')');
					res = res != null ? res.trim() : '';

					assert.equal(
						res,
						results[i]
					);

				} catch (err) {
					console.error('File: ' + file + ' - ' + prfx + ' (' + options + '), Tpl: ' + params[0]);

					fs.writeFileSync(
						errorPath,
						'File: ' + file + ' - ' + prfx + ' (' + options + '), Tpl: ' + params[0] + '\n\nResult:\n' + res + '\n\nExpected:\n' + results[i] + '\n\nTest:\n' + txt[1] + '\n\nCode:\n' + debug['code']
					);

					throw err;
				}
			});
		}
	});
}

run({
	prettyPrint: true,
	throws: true,
	autoReplace: true,
	lineSeparator: eol
});

run({
	prettyPrint: true,
	throws: true,
	autoReplace: true,
	lineSeparator: eol
});

run({
	prettyPrint: true,
	throws: true,
	autoReplace: true,
	inlineIterators: true,
	lineSeparator: eol
});

run({
	prettyPrint: true,
	throws: true,
	autoReplace: true,
	renderMode: 'stringBuffer',
	lineSeparator: eol
});

run({
	prettyPrint: true,
	throws: true,
	autoReplace: true,
	renderMode: 'stringBuffer',
	inlineIterators: true,
	lineSeparator: eol
});

fs.writeFileSync(path.join(testFolder, 'test.html'), tpls.test(asserts));

if (fs.existsSync(errorPath)) {
	fs.unlinkSync(errorPath);
}
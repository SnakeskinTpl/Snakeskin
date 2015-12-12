/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	snakeskin = require('../snakeskin');

var
	path = require('path'),
	fs = require('fs'),
	assert = require('assert');

var
	glob = require('glob'),
	mkdirp = require('mkdirp');

var
	from = path.join(__dirname, 'tests'),
	to = path.join(__dirname, 'tmp'),
	error = path.join(__dirname, '../error.txt');

exports.from = from;
exports.to = to;
exports.error = error;

var
	asserts = [],
	prfx = -1;

exports.run = function (params) {
	var
		options = JSON.stringify(params),
		debug = params.debug = {};

	prfx++;
	fs.readdirSync(from).forEach(exec);

	function exec(file) {
		if (path.extname(file) !== '.ss') {
			return;
		}

		var
			src = path.join(from, file),
			txt = String(fs.readFileSync(src))
				.split('###')
				.map(function (el) {
					return el.trim();
				});

		var
			starts = txt[0].split(/[\r\n]+/),
			results = txt[2].split('***');

		var obj = {
			tpl: txt[1],
			id: path.basename(file, '.ss'),
			js: []
		};

		if (!prfx && !/^(?:script|template|include|modules)|_node/.test(file)) {
			asserts.push(obj);
		}

		try {
			var
				start = Date.now(),
				res = snakeskin.compile(txt[1], params, {file: path.join(src, file)});

			if (!prfx) {
				console.log(file + ' ' + (Date.now() - start) + 'ms');
			}

			fs.writeFileSync(path.join(path.dirname(src), 'tmp', path.basename(src) + '_' + prfx + '.js'), res);

		} catch (err) {
			fs.writeFileSync(
				error,
				'File: ' + file + '\n\n' + err.message + (debug['code'] ? '\n\nCode:\n\n' + debug['code'] : '')
			);

			throw err;
		}

		var
			tpl = require('./tmp/' + file + '_' + prfx + '.js').init(snakeskin);

		starts.forEach(function (el, i) {
			var
				p = String(el).split(' ; '),
				res = '';

			try {
				results[i] = (results[i] || '').trim();
				obj.js.push(
					'equal(' + p[0] + '(' + p.slice(1) + ').trim(), \'' + results[i].replace(/(\\|')/g, '\\$1') + '\');'
				);

				res = eval('tpl.' + p[0] + '(' + p.slice(1) + ')');
				res = res != null ? res.trim() : '';
				assert.equal(
					res,
					results[i]
				);

			} catch (err) {
				console.error('File: ' + file + ' - ' + prfx + ' (' + options + '), Tpl: ' + p[0]);
				fs.writeFileSync(
					error,
					'File: ' + file + ' - ' + prfx + ' (' + options + '), Tpl: ' + p[0] +
					'\n\nResult:\n' + res +
					'\n\nExpected:\n' + results[i] +
					'\n\nTest:\n' + txt[1] +
					'\n\nCode:\n' + debug['code']
				);

				throw err;
			}
		});
	}
};

exports.exists = function (src, cb) {
	try {
		fs.statSync(src);

	} catch (err) {
		switch (err.code) {
			case 'ENOENT':
				cb();
				break;

			default:
				throw err;
		}
	}
};

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	snakeskin = global.Snakeskin = require('../snakeskin');

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
	error = path.join(__dirname, '../error.tmp');

exports.from = from;
exports.to = to;
exports.error = error;

var
	asserts = [],
	prfx = -1;

exports.run = function (params) {
	var
		options = JSON.stringify(params, null, 2),
		debug = params.debug = {};

	prfx++;
	glob.sync(path.join(from, '*/*.ss')).forEach(exec);

	function exec(file) {
		try {
			var txt = fs.readFileSync(file, 'utf8')
				.split('###')
				.map(function (el) {
					return el.trim();
				});

			var
				fileName = path.basename(file),
				cat = path.basename(path.dirname(file)),
				chunkSrc = path.join(to, fileName + '_' + prfx + '.' + cat + '.js'),
				relativeSrc = path.relative(process.cwd(), file);

			console.log('\n###### ' + cat + '\n');

			var
				tests = txt[0].split(/[\r\n]+/),
				results = txt[2].split('***');

		} catch (err) {
			log('File: ' + (relativeSrc || file) + '\nError: ' + err.message, 'error');
			return;
		}

		var obj = {
			tpl: txt[1],
			id: path.basename(file, '.ss'),
			js: []
		};

		try {
			var
				start = Date.now(),
				res = snakeskin.compile(txt[1], params, {file: file});

			if (!prfx) {
				log(relativeSrc + ' ' + (Date.now() - start) + 'ms');
			}

			fs.writeFileSync(chunkSrc, res);

			var
				tpl = require(chunkSrc);

		} catch (err) {
			fs.writeFileSync(
				error,
				'File: ' + file + '\n\n' + err.message + (debug['code'] ? '\n\nCode:\n\n' + debug['code'] : '')
			);

			throw err;
		}

		tests.forEach(function (el, i) {
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
				var
					header =
						'File: ' + relativeSrc + ' (' + prfx + ')' +
						'\nOptions:\n\n' + options +
						'\n\nTpl: ' + p[0];

				log(header, 'error');

				var report =
					header +
					'\n\n' + line() +
					'\n\nResult:\n' + res +
					'\n\nExpected:\n' + results[i] +
					'\n\n' + line() +
					'\n\nTest:\n' + txt[1] +
					'\n\nCode:\n' + debug['code'];

				fs.writeFileSync(error, report);
				throw err;
			}
		});
	}

	function log(message, type) {
		type = type || 'log';
		console[type](new Date().toString());
		console[type](message);
		console[type](line());
	}

	function line() {
		return new Array(80).join('~');
	}
};

exports.exists = function (src) {
	try {
		fs.statSync(src);
		return true;

	} catch (err) {
		if (err.code === 'ENOENT') {
			return false;
		}

		throw err;
	}
};

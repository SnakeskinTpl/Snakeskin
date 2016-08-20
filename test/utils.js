'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	$C = require('collection.js/compiled'),
	snakeskin = global.Snakeskin = require('../snakeskin');

const
	path = require('path'),
	fs = require('fs'),
	assert = require('assert'),
	glob = require('glob');

const
	from = path.join(__dirname, 'tests'),
	to = path.join(__dirname, 'tmp'),
	error = path.join(__dirname, '../error.tmp');

exports.from = from;
exports.to = to;
exports.error = error;

let prfx = -1;
exports.run = function (params) {
	const
		options = JSON.stringify(params, null, 2),
		debug = params.debug = {};

	prfx++;
	$C(glob.sync(path.join(from, '*/*.ss'))).forEach(exec);

	function exec(file) {
		let
			txt,
			fileName,
			cat,
			chunkSrc,
			relativeSrc,
			nms;

		let
			results,
			tests;

		try {
			txt = $C(
				fs
					.readFileSync(file, 'utf8')
					.replace(/^\/\*![\s\S]*?\*\//, '')
					.split(/^===.*/m)

			).map((el) => el.trim());

			fileName = path.basename(file);
			cat = path.basename(path.dirname(file));
			chunkSrc = path.join(to, `${fileName}_${prfx}.${cat}.js`);
			relativeSrc = path.relative(process.cwd(), file);
			nms = [cat, path.basename(file, '.ss')];

			console.log(`\n###### ${nms.join('.')} :: ${options}\n`);

			const
				testRgxp = /^\[\[(.*)]]===+$/gm;

			results = txt[0].split(/^\[\[.*]]===+$/m).slice(1);
			tests = [];

			while (testRgxp.exec(txt[0])) {
				tests.push(RegExp.$1);
			}

		} catch (err) {
			log(`File: ${relativeSrc || file}\nError: ${err.message}`, 'error');
			return;
		}

		const obj = {
			tpl: txt[1],
			id: path.basename(file, '.ss'),
			js: []
		};

		/* eslint-disable no-unused-vars */
		let tpl;
		/* eslint-enable no-unused-vars */

		try {
			const
				start = Date.now(),
				res = snakeskin.compile(txt[1], params, {file});

			log(`${relativeSrc} ${Date.now() - start}ms`);
			fs.writeFileSync(chunkSrc, res);
			tpl = $C(require(chunkSrc)).get(nms);

		} catch (err) {
			fs.writeFileSync(
				error,
				`File: ${file}\n\n${err.message + (debug.code ? `\n\nCode:\n\n${debug.code}` : '')}`
			);

			throw err;
		}

		$C(tests).forEach((el, i) => {
			const
				p = String(el).split(' ; ');

			let res = '';
			try {
				results[i] = (results[i] || '').trim();
				obj.js.push(
					`equal(${p[0]}(${p.slice(1)}).trim(), '${results[i].replace(/(\\|')/g, '\\$1')}');`
				);

				res = eval(`tpl["${p[0]}"](${p.slice(1)})`);
				res = res != null ? res.trim() : '';

				assert.equal(
					res,
					results[i]
				);

			} catch (err) {
				/* eslint-disable prefer-template */
				const header =
					`File: ${relativeSrc}  (${prfx})` +
					`\nOptions:\n\n${options}` +
					`\n\nTpl: ${p[0]}`;

				log(header, 'error');
				const report =
					header +
					`\n\n${line()}` +
					`\n\nResult:\n${res}` +
					`\n\nExpected:\n${results[i]}` +
					`\n\n${line()}` +
					`\n\nTest:\n${txt[1]}` +
					`\n\nCode:\n${debug['code']}`;

				/* eslint-enable prefer-template */
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

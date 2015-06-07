/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	path = require('path'),
	fs = require('fs');

exports.getVersion = function () {
	const file = fs.readFileSync(path.join(__dirname, '../lib/core.js'));
	return /VERSION\s*(?::|=)\s*\[(\d+,\s*\d+,\s*\d+)]/.exec(file)[1]
		.split(/\s*,\s*/)
		.join('.');
};

exports.getHead = function (opt_version, opt_key) {
	return '' +
		'/*!\n' +
		' * Snakeskin' + (opt_version ? ' v' + this.getVersion() : '') + (opt_key ? ' (' + opt_key + ')' : '') + '\n' +
		' * https://github.com/SnakeskinTpl/Snakeskin\n' +
		' *\n' +
		' * Released under the MIT license\n' +
		' * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE\n';
};

exports.getBuilds = function () {
	delete require.cache[require.resolve('../builds')];
	return Object(require('../builds'));
};

exports.error = function (cb) {
	return function (err) {
		console.error(err.message);
		cb();
	};
};

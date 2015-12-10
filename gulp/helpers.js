'use strict';

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

module.exports = {
	getBuilds() {
		delete require.cache[require.resolve('../builds')];
		return Object(require('../builds'));
	},

	getVersion() {
		const file = fs.readFileSync(path.join(__dirname, '../src/core.js'));
		return /VERSION\s*(?::|=)\s*\[(\d+,\s*\d+,\s*\d+)]/.exec(file)[1]
			.split(/\s*,\s*/)
			.join('.');
	},

	getHead(opt_version, opt_key) {
		return '' +
			'/*!\n' +
			` * Snakeskin${opt_version ? ` v${this.getVersion()}` : ''}${opt_key ? ` (${opt_key})` : ''}\n` +
			' * https://github.com/SnakeskinTpl/Snakeskin\n' +
			' *\n' +
			' * Released under the MIT license\n' +
			' * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE\n';
	},

	error(cb) {
		return (err) => {
			console.error(err.message);
			cb();
		};
	}
};

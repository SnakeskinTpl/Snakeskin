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
	headRgxp: /(\/\*![\s\S]*?\*\/\n{2})/,

	getBuilds() {
		delete require.cache[require.resolve('../builds')];
		return Object(require('../builds'));
	},

	getHead(opt_version, opt_key) {
		return (
			'/*!\n' +
			` * Snakeskin${opt_version ? ` v${this.getVersion()}` : ''}${opt_key ? ` (${opt_key})` : ''}\n` +
			' * https://github.com/SnakeskinTpl/Snakeskin\n' +
			' *\n' +
			' * Released under the MIT license\n' +
			' * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE\n'
		);
	},

	getVersion() {
		const
			file = fs.readFileSync(path.join(__dirname, '../src/core.js')),
			v = /VERSION\s*[:=]\s*\[(.*?)]/.exec(file)[1].split(/\s*,\s*/);

		return v.slice(0, 3).join('.') + (v[3] ? `-${eval(v[3])}` : '');
	}
};

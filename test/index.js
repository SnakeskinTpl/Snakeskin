'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

require('./filters');
require('./globals');

const
	eol = '\n',
	utils = require('./utils');

const
	fs = require('fs'),
	mkdirp = require('mkdirp');

if (!utils.exists(utils.to)) {
	mkdirp.sync(utils.to);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

utils.run({
	throws: true,
	lineSeparator: eol
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

utils.run({
	renderMode: 'stringBuffer',
	throws: true,
	lineSeparator: eol,
	prettyPrint: true
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (utils.exists(utils.error)) {
	fs.unlinkSync(utils.error);
}

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

var
	fs = require('fs'),
	mkdirp = require('mkdirp');

if (!utils.exists(utils.to)) {
	mkdirp.sync(utils.to);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

utils.run({
	prettyPrint: true,
	throws: true,
	autoReplace: true,
	lineSeparator: eol
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (!utils.exists(utils.error)) {
	mkdirp.sync(utils.error);
}

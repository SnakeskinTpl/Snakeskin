/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	global = new Function('return this')();

export const
	beautify = global.js_beautify || require('js-beautify'),
	esprima = global.esprima || require('esprima'),
	escaper = global.Escaper || require('escaper'),
	$C = global.$C || require('collection.js').$C;

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

let
	beautify,
	globalBeautify = global.js_beautify;

/* istanbul ignore next */
//#include ../../node_modules/js-beautify/js/lib/beautify.js

if (IS_NODE) {
	beautify = exports.js_beautify;
	delete exports.js_beautify;

} else {
	beautify = global.js_beautify;
	global.js_beautify = globalBeautify;
}

let
	esprima,
	globalEsprima = global.esprima;

/* istanbul ignore next */
//#include ../../node_modules/esprima/esprima.js

if (IS_NODE) {
	esprima = exports;
	module.exports =
		exports = root;

} else {
	esprima = global.esprima;
	global.esprima = globalEsprima;
}

let
	Escaper,
	globalEscaper = global.Escaper;

/* istanbul ignore next */
//#include ../../node_modules/escaper/dist/escaper.js

if (IS_NODE) {
	Escaper = module.exports;
	module.exports =
		exports = root;

} else {
	Escaper = global.Escaper;
	global.Escaper = globalEscaper;
}


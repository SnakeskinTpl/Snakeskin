/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

export const beautify = wrap(function (module, exports, define) {
	/* istanbul ignore next */
	////#include ../node_modules/js-beautify/js/lib/beautify.js
	return exports.js_beautify;
});

export const esprima = wrap(function (module, exports, define) {
	/* istanbul ignore next */
	////#include ../node_modules/esprima/esprima.js
	return exports;
});

export const escaper = wrap(function (module, exports, define) {
	/* istanbul ignore next */
	////#include ../node_modules/escaper/dist/escaper.js
	return module.exports;
});

export const $C = wrap(function (module, exports, define) {
	/* istanbul ignore next */
	////#include ../node_modules/collection.js/dist/collection.core.js
	return exports.$C;
});

function wrap(fn) {
	const
		exports = {},
		module = {exports};

	return fn.call(exports, module, exports);
}


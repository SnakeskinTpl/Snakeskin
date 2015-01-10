var beautify,
	globalBeautify = global.js_beautify;

/* istanbul ignore next */
////#include ../node_modules/js-beautify/js/lib/beautify.js

if (IS_NODE) {
	beautify = exports.js_beautify;
	delete exports.js_beautify;

} else {
	beautify = global.js_beautify;
	global.js_beautify = globalBeautify;
}

var esprima,
	globalEsprima = global.esprima;

/* istanbul ignore next */
////#include ../node_modules/esprima/esprima.js

if (IS_NODE) {
	esprima = exports;
	module.exports =
		exports = root;

} else {
	esprima = global.esprima;
	global.esprima = globalEsprima;
}

var Escaper,
	globalEscaper = global.Escaper;

/* istanbul ignore next */
////#include ../node_modules/escaper/dist/escaper.js

if (IS_NODE) {
	Escaper = exports;
	module.exports =
		exports = root;

} else {
	Escaper = global.Escaper;
	global.Escaper = globalEscaper;
}


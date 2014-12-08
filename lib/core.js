//#include ./es5shim.live.js

/** @type {!Object} */
var Snakeskin = {
	/**
	 * Версия Snakeskin
	 *
	 * @expose
	 * @type {!Array}
	 */
	VERSION: [6, 4, 2],

	/**
	 * Пространство имён для директив
	 * @type {!Object}
	 */
	Directions: {},

	/**
	 * Пространство имён для фильтров
	 *
	 * @expose
	 * @type {!Object}
	 */
	Filters: {},

	/**
	 * Пространство имён для суперглобальных переменных
	 *
	 * @expose
	 * @type {!Object}
	 */
	Vars: {},

	/**
	 * Пространство имён для локальных переменных
	 * области декларации шаблонов
	 *
	 * @expose
	 * @type {!Object}
	 */
	LocalVars: {},

	/**
	 * Кеш шаблонов
	 *
	 * @expose
	 * @type {!Object}
	 */
	cache: {}
};

var IS_NODE = false;

try {
	IS_NODE = 'object' === typeof process && Object.prototype.toString.call(process) === '[object process]';

} catch (ignore) {

}

//#include ./live.js
//#include ./filters.js

//#if compiler

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

//#include ./decl.js
//#include ./global.js
//#include ./api.js
//#include ./cache.js
//#include ./compiler.js
//#include ./directions.js
//#include ./include.js

//#endif

if (IS_NODE) {
	module['exports'] = Snakeskin;

} else {
	root['Snakeskin'] = Snakeskin;
}

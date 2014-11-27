//#include ./es5shim.live.js

/** @type {!Object} */
var Snakeskin = {
	/**
	 * Версия Snakeskin
	 *
	 * @expose
	 * @type {!Array}
	 */
	VERSION: [6, 4, 0],

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

//= (function (root) {
	var IS_NODE = false;

	try {
		IS_NODE = 'object' === typeof process && Object.prototype.toString.call(process) === '[object process]';

	} catch (ignore) {

	}

	//#include ./live.js
	//#include ./filters.js

	//#if compiler

	/* istanbul ignore next */

	////#include ../node_modules/js-beautify/js/lib/beautify.js
	var beautify = root.js_beautify;

	/* istanbul ignore next */

	////#include ../node_modules/esprima/esprima.js
	var esprima = root.esprima || root;

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

//= })(this);

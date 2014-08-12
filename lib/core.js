//#include ./es5shim.live.js

/** @type {!Object} */
var Snakeskin = {
	/**
	 * Версия Snakeskin
	 *
	 * @expose
	 * @type {!Array}
	 */
	VERSION: [4, 0, 2],

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

//= (function () {
	var IS_NODE = typeof window === 'undefined' &&
		typeof exports !== 'undefined';

	var root = this;

	//#include ./filters.js
	//#include ./live.js

	//#if compiler

	//#include ../node_modules/js-beautify/js/lib/beautify.js
	var beautify = this.js_beautify;

	//#include ../node_modules/esprima/esprima.js
	var esprima = this.esprima || this;

	//#include ./decl.js
	//#include ./global.js
	//#include ./api.js
	//#include ./args.js
	//#include ./eval.js
	//#include ./escape.js
	//#include ./inherit.js
	//#include ./error.js
	//#include ./compiler.js
	//#include ./adv.js
	//#include ./directions.js
	//#include ./output.js
	//#include ./include.js

	//#endif

	if (IS_NODE) {
		module['exports'] = Snakeskin;

	} else {
		this['Snakeskin'] = Snakeskin;
	}

//= }).call(this);
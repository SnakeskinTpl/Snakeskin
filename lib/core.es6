//#include ./es5shim.live.js

/** @type {!Object} */
var Snakeskin = {
	/**
	 * Версия Snakeskin
	 *
	 * @expose
	 * @type {!Array}
	 */
	VERSION: [3, 4, 0],

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
	 * Кеш шаблонов
	 *
	 * @expose
	 * @type {!Object}
	 */
	cache: {}
};

//= (function () {
	const IS_NODE = typeof window === 'undefined' && typeof exports !== 'undefined';

	//#include ./filters.js
	//#if compiler

	//#include ../node_modules/esprima/esprima.js
	var esprima = this.esprima || this;

	//#include ./global.js
	//#include ./api.js
	//#include ./escape.js
	//#include ./inherit.js
	//#include ./error.js
	//#include ./compiler.js
	//#include ./directions.js
	//#include ./output.js

	//#endif

	if (IS_NODE) {
		module['exports'] = Snakeskin;

	} else {
		this['Snakeskin'] = Snakeskin;
	}

//= }).call(this);
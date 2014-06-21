//#include ./es5shim.live.js

/** @type {!Object} */
var Snakeskin = {
	/**
	 * Версия Snakeskin
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
	 * @type {!Object}
	 */
	cache: {}
};

(function(global, node)  {

	//#include ./filters.js

	//#if compiler

	//#include ./global.js
	//#include ./api.js
	//#include ./escape.js
	//#include ./inherit.js
	//#include ./error.js
	//#include ./compiler.js
	//#include ./directions.js
	//#include ./output.js

	//#endif

	if (node) {
		module.exports = Snakeskin;

	} else {
		global['Snakeskin'] = Snakeskin;
	}

})(this, typeof window === 'undefined' && typeof exports !== 'undefined');
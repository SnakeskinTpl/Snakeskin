var global = this;
//#include ./shim.js

var Snakeskin = {
	/**
	 * Версия Snakeskin
	 * @type {!Array}
	 */
	VERSION: [6, 5, 20],

	/**
	 * Пространство имён для директив
	 * @const
	 */
	Directions: {},

	/**
	 * Пространство имён для фильтров
	 * @const
	 */
	Filters: {},

	/**
	 * Пространство имён для суперглобальных переменных
	 * @const
	 */
	Vars: {},

	/**
	 * Пространство имён для локальных переменных
	 * области декларации шаблонов
	 * @const
	 */
	LocalVars: {},

	/**
	 * Кеш шаблонов
	 * @type {!Object}
	 */
	cache: {}
};

var IS_NODE = false,
	JSON_SUPPORT = false;

try {
	IS_NODE = typeof process === 'object' && Object.prototype.toString.call(process) === '[object process]';
	JSON_SUPPORT = JSON.parse(JSON.stringify({foo: 'bar'})).foo === 'bar';

} catch (ignore) {}

//#include ./init/gcc.js
//#include ./live/*.js

//#if compiler

var globalDefine = global['define'];
global['define'] = undefined;

//#include ./init/dependencies.js
//#include ./init/decl.js
//#include ./init/global.js
//#include ./init/macros.js
//#include ./init/other.js

//#include ./api/*.js
//#include ./compiler.js
//#include ./directives.js

//#endif

global['define'] = globalDefine;
if (typeof define === 'function' && define.amd) {
	define([], function () {
		return Snakeskin;
	});

} else if (IS_NODE) {
	module.exports =
		exports = Snakeskin;

} else {
	global.Snakeskin = Snakeskin;
}

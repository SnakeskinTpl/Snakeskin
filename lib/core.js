var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/** @namespace */
var Snakeskin = {
	/**
	 * Версия движка
	 * @type {string}
	 */
	VERSION: [3, 0, 0],

	/**
	 * Пространство имён для директив
	 * @namespace
	 */
	Directions: {},

	/**
	 * Пространство имён для фильтров
	 * @namespace
	 */
	Filters: {},

	/**
	 * Пространство имён для супер глобальных переменных
	 * @namespace
	 */
	Vars: {},

	/**
	 * Кеш шаблонов
	 * @type {!Object}
	 */
	cache: {}
};

(function (require) {
	

	//#if old.live
		//#include es5shim.live.js
	//#endif

	//#include filters.js

	//#if withCompiler
		//#include global.js
		//#include api.js
		//#include escape.js
		//#include inherit.js
		//#include error.js

		//#include compiler.js
		//#include directions.js
		//#include output.js

		//#include directions/private.js
		//#include directions/space.js
		//#include directions/end.js

		//#include directions/template.js
		//#include directions/return.js

		//#include directions/call.js
		//#include directions/void.js
		//#include directions/var.js

		//#include directions/block.js
		//#include directions/proto.js
		//#include directions/inherit.js

		//#include directions/cycles.js
		//#include directions/iterator.js
		//#include directions/logic.js
		//#include directions/try.js
		//#include directions/scope.js
		//#include directions/const.js

		//#include directions/bem.js
		//#include directions/data.js
	//#endif

	// common.js экспорт
	if (require) {
		module.exports = Snakeskin;
	}

})(typeof window === 'undefined');
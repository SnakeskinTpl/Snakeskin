var Snakeskin = {
		VERSION: '1.5.1',

		Filters: {},
		BEM: {},
		Vars: {},

		write: {},
		cache: {}
	},

	SS = Snakeskin;

(function (require) {
	'use strict';

	//#if old.live
	//#include es5shim.live.js
	//#endif

	//#include live.js
	//#include filters.js

	//#if old
	//#include es5shim.js
	//#endif

	//#if withCompiler
	//#include global.js
	//#include escape.js
	//#include inherit.js
	//#include other.js
	//#include compiler.js
	//#endif

	// common.js экспорт
	var key;
	if (require) {
		for (key in Snakeskin) {
			if (!Snakeskin.hasOwnProperty(key)) { continue; }
			exports[key] = Snakeskin[key];
		}
	}
})(typeof window === 'undefined');
var global = this,
	root = typeof exports === 'object' ? exports : self;

//#include ./shim.js

var Snakeskin = {
	/**
	 * The version of Snakeskin
	 * @type {!Array}
	 */
	VERSION: [6, 5, 29],

	/**
	 * The namespace for directives
	 * @const
	 */
	Directions: {},

	/**
	 * The namespace for filters
	 * @const
	 */
	Filters: {},

	/**
	 * The namespace for super-global variables
	 * @const
	 */
	Vars: {},

	/**
	 * The namespace for local variables
	 * @const
	 */
	LocalVars: {},

	/**
	 * The cache of templates
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

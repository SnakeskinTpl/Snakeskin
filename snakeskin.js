/** @type {Snakeskin} */
var ss = module.exports = exports = global['SNAKESKIN_DEBUG'] || require('./dist/snakeskin.min');

var path = require('path'),
	fs = require('fs'),
	cache = {};

function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

// Declarative export for working autocomplete in editors

/** @see {Snakeskin.VERSION} */
exports.VERSION = ss.VERSION;

/** @see {Snakeskin.Filters} */
exports.Filters = ss.Filters;

/** @see {Snakeskin.Vars} */
exports.Vars = ss.Vars;

/** @see {Snakeskin.importFilters} */
exports.importFilters = ss.importFilters;

/** @see {Snakeskin.compile} */
exports.compile = ss.compile;

/**
 * Returns true, when a template file corresponds to a compiled file
 * by timestamp
 *
 * @param {string} source - a path to the template file
 * @param {string} result - a path to the compiled file
 * @param {(string|boolean|null)=} [opt_key] - a key of compile parameters
 * @param {?boolean=} [opt_includes=false] - if is true, then returns an array of included files
 * @return {(boolean|!Array)}
 */
exports.check = function (source, result, opt_key, opt_includes) {
	var ctx = module.parent ? path.dirname(module.parent.filename) : '';

	source = path.normalize(path.resolve(ctx, source));
	result = path.normalize(path.resolve(ctx, result));

	if (!fs.existsSync(source) || !fs.existsSync(result)) {
		return false;
	}

	var code = fs.readFileSync(result).toString(),
		label = /label <([\d]+)>/.exec(code);

	if (opt_key === null || !label || fs.statSync(source).mtime.valueOf() != label[1]) {
		return false;
	}

	if (opt_key) {
		var key = /key <(.*?)>/.exec(code);

		if (!key || key[1] != opt_key) {
			return false;
		}
	}

	var includes = /includes <(.*?)>/.exec(code);

	if (!includes) {
		return false;
	}

	if (includes[1]) {
		includes = JSON.parse(includes[1]);

		for (var i = 0; i < includes.length; i++) {
			var el = includes[i];

			if (fs.existsSync(el[0])) {
				if (fs.statSync(el[0]).mtime.valueOf() != el[1]) {
					return false;
				}

			} else {
				return false;
			}
		}

		if (opt_includes) {
			return includes.map(function (el) {
				return el[0];
			});
		}
	}

	return opt_includes ? [] : true;
};

/**
 * Compiles a template file and returns a reference to a resulting object
 * or false, if an error occurs during compilation
 *
 * @param {string} src - a path to the template file
 *
 * @see Snakeskin.compile
 * @param {?$$SnakeskinParams=} [opt_params] - additional parameters
 *
 * @return {(!Object|boolean)}
 */
exports.compileFile = function (src, opt_params) {
	src = path.normalize(path.resolve(module.parent ? path.dirname(module.parent.filename) : '', src));

	var p = opt_params || {};
	var cacheEnabled = p.cache !== false;
	var cacheKey = this.compile(null, p, null, {cacheKey: true}),
		fromCache = cacheEnabled &&
			cache[cacheKey] &&
			cache[cacheKey][src];

	if (fromCache) {
		var tmp = fromCache;

		if (p.words) {
			if (!tmp.words) {
				fromCache = false;

			} else {
				p.words = clone(tmp.words);
			}
		}

		if (p.debug) {
			if (!tmp.debug) {
				fromCache = false;

			} else {
				p.debug = clone(tmp.debug);
			}
		}

		if (fromCache) {
			return tmp.tpls;
		}
	}

	var source = fs.readFileSync(src).toString(),
		resSrc = src + '.js';

	var tpls,
		res = true,
		that = this;

	var compile = function () {
		res = that.compile(source, p, {file: src});

		if (res !== false) {
			fs.writeFileSync(resSrc, res);
		}
	};

	if (cacheEnabled) {
		if (!this.check(src, resSrc, cacheKey)) {
			compile();
		}

	} else {
		compile();
	}

	if (res !== false) {
		delete require.cache[require.resolve(resSrc)];
		tpls = require(resSrc);

		if (cacheKey && (cacheEnabled || cache[cacheKey])) {
			cache[cacheKey] = cache[cacheKey] || {};
			cache[cacheKey][src] = {
				tpls: tpls,
				debug: p.debug,
				words: p.words
			};
		}

		if (tpls.init) {
			tpls.init(this);
		}

		return tpls;
	}

	return false;
};

/**
 * Returns a reference to a main template
 *
 * @param {!Object} tpls - a template object
 * @param {?string=} [opt_src] - a path to the template file
 * @param {?string=} [opt_tplName] - a name of the main template
 * @return {Function}
 */
exports.returnMainTpl = function (tpls, opt_src, opt_tplName) {
	var tpl;

	if (opt_tplName) {
		tpl = tpls[opt_tplName];

	} else {
		tpl = opt_src && tpls[path.basename(opt_src, path.extname(opt_src))] ||
			tpls.main ||
			tpls.index ||
			tpls[Object.keys(tpls).sort()[0]];
	}

	return tpl || null;
};

/**
 * Compiles a template file and returns a reference to a main template
 *
 * @param {string} src - a path to the template file
 *
 * @see Snakeskin.compile
 * @param {?$$SnakeskinParams=} [opt_params] - additional parameters
 *
 * @param {?string=} [opt_tplName] - a name of the main template
 * @return {Function}
 */
exports.execFile = function (src, opt_params, opt_tplName) {
	var tpls = this.compileFile(src, opt_params);

	if (!tpls) {
		return null;
	}

	return this.returnMainTpl(tpls, src, opt_tplName);
};

/**
 * Compiles a template text and returns a reference to a main template
 *
 * @param {string} txt - the source text
 *
 * @see Snakeskin.compile
 * @param {?$$SnakeskinParams=} [opt_params] - additional parameters
 *
 * @param {?string=} [opt_tplName] - a name of the main template
 * @return {Function}
 */
exports.exec = function (txt, opt_params, opt_tplName) {
	var tpls = {};

	opt_params = opt_params || {};
	opt_params.context = tpls;

	this.compile(txt, opt_params);
	return this.returnMainTpl(tpls, null, opt_tplName);
};

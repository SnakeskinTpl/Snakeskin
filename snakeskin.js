/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/** @type {Snakeskin} */
module.exports = exports = global['SNAKESKIN_DEBUG'] || require('./dist/snakeskin.min');
require('core-js/es6/object');
require('core-js/es6/promise');

var
	beautify = require('js-beautify'),
	$C = require('collection.js').$C,
	async = require('async');

var
	path = require('path'),
	fs = require('fs'),
	exists = require('exists-sync'),
	cache = {};

/**
 * Returns true if a template file corresponds to a compiled file by a timestamp
 *
 * @param {string} source - path to the template file
 * @param {string} result - path to the compiled file
 * @param {(string|boolean|null)=} [opt_key] - key of compile parameters
 * @param {?boolean=} [opt_includes=false] - if is true, then returns an array of included files
 * @return {(boolean|!Array)}
 */
exports.check = function (source, result, opt_key, opt_includes) {
	var
		ctx = module.parent ? path.dirname(module.parent.filename) : '';

	source = path.normalize(path.resolve(ctx, source));
	result = path.normalize(path.resolve(ctx, result));

	try {
		var sourceStat = fs.statSync(source);

		if (!sourceStat.isFile() || !fs.statSync(result).isFile()) {
			return false;
		}

	} catch (ignore) {
		return false;
	}

	var
		code = fs.readFileSync(result, 'utf8'),
		label = /label <([\d]+)>/.exec(code);

	if (opt_key === null || !label || sourceStat.mtime.valueOf() != label[1]) {
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

	function test(el) {
		if (fs.existsSync(el[0])) {
			if (fs.statSync(el[0]).mtime.valueOf() != el[1]) {
				return true;
			}

		} else {
			return true;
		}
	}

	if (includes[1]) {
		includes = JSON.parse(includes[1]);

		if (includes.some(test)) {
			return false;
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
 * Compiles a template file and returns a reference to the resulting object
 * or false if an error occurs during compilation
 *
 * @param {string} src - path to the template file
 *
 * @see Snakeskin.compile
 * @param {?$$SnakeskinParams=} [opt_params] - additional parameters
 *
 * @return {(!Object|boolean)}
 */
exports.compileFile = function (src, opt_params) {
	var
		ssrc = path.join(process.cwd(), '.snakeskinrc');

	if (!opt_params && exists(ssrc)) {
		opt_params = exports.toObj(ssrc);
	}

	src = path.normalize(path.resolve(module.parent ? path.dirname(module.parent.filename) : '', src));

	var
		p = Object.assign({}, opt_params),
		cacheEnabled = p.cache !== false;

	var
		cacheKey = exports.compile(null, Object.assign({}, p, {getCacheKey: true})),
		fromCache = cacheEnabled && cache[cacheKey] && cache[cacheKey][src];

	function clone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

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

	var
		source = fs.readFileSync(src).toString(),
		resSrc = src + '.js';

	var
		tpls,
		res = true;

	function compile() {
		res = exports.compile(source, p, {file: src});

		if (res !== false) {
			fs.writeFileSync(resSrc, res);
		}
	}

	if (cacheEnabled) {
		if (!exports.check(src, resSrc, cacheKey)) {
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
			tpls.init(exports);
		}

		return tpls;
	}

	return false;
};

/**
 * Returns a reference to the main template
 *
 * @param {!Object} tpls - template object
 * @param {?string=} [opt_src] - path to the template file
 * @param {?string=} [opt_tplName] - name of the main template
 * @return {Function}
 */
exports.getMainTpl = function (tpls, opt_src, opt_tplName) {
	var
		tpl;

	function name(tpls) {
		return opt_src && tpls[path.basename(opt_src, path.extname(opt_src))] ||
			tpls.main ||
			tpls.index ||
			tpls[Object.keys(tpls).sort()[0]];
	}

	if (opt_tplName) {
		tpl = eval('tpls' + (opt_tplName[0] !== '[' ? '.' + opt_tplName : opt_tplName));

		if (tpl && typeof tpls !== 'function') {
			tpls = tpl

		} else {
			return tpl || null;
		}
	}

	tpl = name(tpls);
	while (tpl && typeof tpl !== 'function') {
		tpl = name(tpl);
	}

	return tpl || null;
};

/**
 * Compiles a template file and returns a reference to the main template
 *
 * @param {string} src - path to the template file
 *
 * @see Snakeskin.compile
 * @param {?$$SnakeskinParams=} [opt_params] - additional parameters
 *
 * @param {?string=} [opt_tplName] - name of the main template
 * @return {Function}
 */
exports.execFile = function (src, opt_params, opt_tplName) {
	var tpls = exports.compileFile(src, opt_params);

	if (!tpls) {
		return null;
	}

	return exports.getMainTpl(tpls, src, opt_tplName);
};

/**
 * Compiles a template text and returns a reference to the main template
 *
 * @param {string} txt - source text
 *
 * @see Snakeskin.compile
 * @param {?$$SnakeskinParams=} [opt_params] - additional parameters
 *
 * @param {?string=} [opt_tplName] - name of the main template
 * @return {Function}
 */
exports.exec = function (txt, opt_params, opt_tplName) {
	var tpls = {};

	opt_params = opt_params || {};
	opt_params.context = tpls;

	exports.compile(txt, opt_params);
	return exports.getMainTpl(tpls, null, opt_tplName);
};

function testId(id) {
	try {
		var obj = {};
		eval('obj.' + id + '= true');
		return true;

	} catch (ignore) {
		return false;
	}
}

/**
 * Compiles Snakeskin templates as React JSX
 *
 * @param {string} txt
 * @param {function(!Object): !Object} setParams - adaptor of parameters
 * @param {function(string, string, string, !Object): !Object} adaptor - adaptor of code
 * @param {?$$SnakeskinParams=} [opt_params] - additional parameters
 * @param {?$$SnakeskinInfoParams=} [opt_info] - additional parameters for debug
 * @return {!Promise<(string|boolean|null)>}
 */
exports.adaptor = function (txt, setParams, adaptor, opt_params, opt_info) {
	opt_params = Object.assign({
		adaptorOptions: {},
		renderMode: 'stringConcat',
		module: 'umd',
		moduleId: 'tpls',
		useStrict: true,
		eol: '\n'
	}, opt_params);

	var
		eol = opt_params.eol,
		mod = opt_params.module,
		prettyPrint = opt_params.prettyPrint;

	var
		nRgxp = /\r?\n|\r/g,
		tpls = {};

	var p = Object.assign(setParams(opt_params), {
		context: tpls,
		module: 'cjs',
		prettyPrint: false
	});

	var
		useStrict = p.useStrict ? '"useStrict";' : '',
		res = exports.compile(txt, p, opt_info);

	if (!res) {
		return res;
	}

	function compile(tpls, prop) {
		prop = prop || 'exports';
		var tasks = [];

		$C(tpls).forEach(function (el, key) {
			var
				val,
				validKey = false;

			if (testId(key)) {
				val = prop + '.' + key;
				validKey = true;

			} else {
				val = prop + '["' + key.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"]';
			}

			if (typeof el !== 'function') {
				res +=
					'if (' + val + ' instanceof Object === false) {' +
						val + ' = {};' +
						(validKey && mod === 'native' ? 'export var ' + key + '=' + val + ';' : '') +
					'}'
				;

				tasks.push(function (cb) {
					compile(el, val).then(
						function (res) {
							cb(null, res);
						},

						function (err) {
							console.log(err);
							cb(err);
						}
					)
				});

				return;
			}

			var
				decl = /^(async\s+)?(function)[*]?(\s*.*?\)\s*\{)/.exec(el.toString()),
				text = el(p.data);

			if (text.then) {
				tasks.push(function (cb) {
					text
						.then(function (text) {
							res += adaptor(val, decl[2] + decl[3], text, p.adaptorOptions);
							cb();
						})

						.catch(cb);
				});

			} else {
				if (text.next) {
					var
						iterator = text,
						pos = iterator.next();

					text = pos.value;
					while (!pos.done) {
						pos = iterator.next();
						text += pos.value;
					}
				}

				res += adaptor(val, decl[0], text, p.adaptorOptions);
			}
		});

		return new Promise(function (resolve, reject) {
			async.parallel(tasks, function (err) {
				if (err) {
					return reject(err);
				}

				resolve();
			});
		});
	}

	res = /\/\*[\s\S]*?\*\//.exec(res)[0];
	res = res.replace(
		/key <.*?>/,
		'key <' + exports.compile(null, Object.assign({}, opt_params, {getCacheKey: true})) + '>'
	);

	if (mod === 'native') {
		res +=
			useStrict +
			'import React from "react";' +
			'var exports = {};' +
			'export default exports;'
		;

	} else {
		res +=
			'(function(global, factory) {' +
				(
					{cjs: true, umd: true}[mod] ?
						'if (typeof exports === "object" && typeof module !== "undefined") {' +
							'factory(exports, typeof React === "undefined" ? require("react") : React);' +
							'return;' +
						'}' :
						''
				) +

				(
					{amd: true, umd: true}[mod] ?
						'if (typeof define === "function" && define.amd) {' +
							'define("' + (p.moduleId) + '", ["exports", "react"], factory);' +
							'return;' +
						'}' :
						''
				) +

				(
					{global: true, umd: true}[mod] ?
						'factory(global' + (p.moduleName ? '.' + p.moduleName + '= {}' : '') + ', React);' :
						''
				) +

			'})(this, function (exports, React) {' +
				useStrict
		;
	}

	return new Promise(function (resolve, reject) {
		compile(tpls)
			.then(function () {
				if (mod !== 'native') {
					res += '});';
				}

				if (prettyPrint) {
					res = beautify.js(res);
				}

				resolve(res.replace(nRgxp, eol) + eol);
			})

			.catch(reject);
	});
};

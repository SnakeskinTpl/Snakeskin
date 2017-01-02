'use strict';

/* eslint-disable eqeqeq, prefer-template */

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/** @type {Snakeskin} */
module.exports = exports = global['SNAKESKIN_DEBUG'] || require('./dist/snakeskin.min');
exports['default'] = exports;

const
	$C = require('collection.js/compiled'),
	beautify = require('js-beautify');

const
	path = require('path'),
	fs = require('fs'),
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
	const
		ctx = module.parent ? path.dirname(module.parent.filename) : '';

	source = path.normalize(path.resolve(ctx, source));
	result = path.normalize(path.resolve(ctx, result));

	let sourceStat;
	try {
		sourceStat = fs.statSync(source);

		if (!sourceStat.isFile() || !fs.statSync(result).isFile()) {
			return false;
		}

	} catch (ignore) {
		return false;
	}

	const
		code = fs.readFileSync(result, 'utf8'),
		label = /label <([\d]+)>/.exec(code);

	if (opt_key === null || !label || sourceStat.mtime.valueOf() != label[1]) {
		return false;
	}

	if (opt_key) {
		const
			key = /key <(.*?)>/.exec(code);

		if (!key || key[1] != opt_key) {
			return false;
		}
	}

	let
		includes = /includes <(.*?)>/.exec(code);

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
			return includes.map((el) => el[0]);
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
	const
		ssrc = path.join(process.cwd(), '.snakeskinrc');

	if (!opt_params && fs.existsSync(ssrc)) {
		opt_params = exports.toObj(ssrc);
	}

	src = path.normalize(path.resolve(module.parent ? path.dirname(module.parent.filename) : '', src));

	const
		p = Object.assign({}, opt_params),
		cacheEnabled = p.cache !== false;

	const
		cacheKey = exports.compile(null, Object.assign({}, p, {getCacheKey: true}));

	let
		fromCache = cacheEnabled && cache[cacheKey] && cache[cacheKey][src];

	function clone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	if (fromCache) {
		const
			tmp = fromCache;

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

	const
		source = fs.readFileSync(src).toString(),
		resSrc = `${src}.js`;

	let
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
				tpls,
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
	let tpl;
	function name(tpls) {
		return opt_src && tpls[path.basename(opt_src, path.extname(opt_src))] ||
			tpls.main ||
			tpls.index ||
			tpls[Object.keys(tpls).sort()[0]];
	}

	if (opt_tplName) {
		tpl = eval(`tpls${opt_tplName[0] !== '[' ? `.${opt_tplName}` : opt_tplName}`);

		if (tpl && typeof tpls !== 'function') {
			tpls = tpl;

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
	const
		tpls = exports.compileFile(src, opt_params);

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
	const
		tpls = {};

	opt_params = opt_params || {};
	opt_params.context = tpls;

	exports.compile(txt, opt_params);
	return exports.getMainTpl(tpls, null, opt_tplName);
};

function testId(id) {
	try {
		/* eslint-disable no-unused-vars */
		const obj = {};
		/* eslint-enable no-unused-vars */
		eval(`obj.${id} = true`);
		return true;

	} catch (ignore) {
		return false;
	}
}

/**
 * Executes the specified function and returns the result
 *
 * @param {?} fn - source function
 * @param {?=} [opt_data] - additional parameters
 * @return {Promise}
 */
exports.execTpl = function (fn, opt_data) {
	let
		res = typeof fn === 'function' ? fn(opt_data) : fn;

	if (res && res instanceof Object) {
		if (typeof res === 'function') {
			return exports.execTpl(res);
		}

		if (res.then) {
			return res.then((text) => exports.execTpl(text));
		}

		if (res.next) {
			const
				iterator = res;

			let
				pos = iterator.next();

			res = pos.value;
			while (!pos.done) {
				pos = iterator.next();
				res += pos.value;
			}
		}
	}

	return new Promise((resolve) => resolve(res));
};

/**
 * Compiles Snakeskin templates as React JSX
 *
 * @param {string} txt
 * @param {{setParams, template, local, importNative, importCJS, importAMD, importGlobal, header, footer}} adapter - adapter of code
 * @param {?$$SnakeskinParams=} [opt_params] - additional parameters
 * @param {?$$SnakeskinInfoParams=} [opt_info] - additional parameters for debug
 * @return {!Promise<(string|boolean|null)>}
 */
exports.adapter = function (txt, adapter, opt_params, opt_info) {
	opt_params = Object.assign({
		adapterOptions: {},
		renderMode: 'stringConcat',
		module: 'umd',
		moduleId: 'tpls',
		useStrict: true,
		eol: '\n'
	}, opt_params);

	const
		eol = opt_params.eol,
		mod = opt_params.module,
		prettyPrint = opt_params.prettyPrint;

	const
		nRgxp = /\r?\n|\r/g,
		tpls = {};

	const p = Object.assign(adapter.setParams(opt_params), {
		context: tpls,
		module: 'cjs',
		prettyPrint: false
	});

	const
		useStrict = p.useStrict ? '"useStrict";' : '',
		opts = p.adapterOptions;

	let
		res = exports.compile(txt, p, opt_info);

	if (!res) {
		return res;
	}

	function compile(tpls, prop) {
		prop = prop || 'exports';

		const
			tasks = [];

		$C(tpls).forEach((el, key) => {
			let
				val,
				validKey = false;

			if (testId(key)) {
				val = `${prop}.${key}`;
				validKey = true;

			} else {
				val = `${prop}["${key.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"]`;
			}

			if (typeof el !== 'function') {
				res +=
					`if (${val} instanceof Object === false) {` +
						`${val} = {};` +
						(validKey && mod === 'native' ? `export var ${key} = ${val};` : '') +
					'}'
				;

				return tasks.push(compile(el, val));
			}

			const
				decl = /^(async\s+)?(function)[*]?(\s*.*?\)\s*\{)/.exec(el.toString());

			tasks.push(exports.execTpl(el, p.data).then((text) => {
				res += adapter.template(val, decl[2] + decl[3], text, p.adapterOptions);
			}));
		});

		return Promise.all(tasks);
	}

	res = /\/\*[\s\S]*?\*\//.exec(res)[0];
	res = res.replace(
		/key <.*?>/,
		`key <${exports.compile(null, Object.assign({}, opt_params, {getCacheKey: true}))}>`
	);

	if (opts.header) {
		res += opts.header;
	}

	if (mod === 'native') {
		res += `
			${useStrict}
			${adapter.importNative || ''}
			var exports = {};
			export default exports;
		`;

	} else {
		res +=
			'(function(global, factory) {' +
				(
					{cjs: true, umd: true}[mod] ?
						'if (typeof exports === "object" && typeof module !== "undefined") {' +
							`factory(exports${adapter.importCJS ? `, ${adapter.importCJS}` : ''});` +
							'return;' +
						'}' :
						''
				) +

				(
					{amd: true, umd: true}[mod] ?
						'if (typeof define === "function" && define.amd) {' +
							`define("${p.moduleId}", ["exports"${adapter.importAMD ? `, ${adapter.importAMD}` : ''}], factory);` +
							'return;' +
						'}' :
						''
				) +

				(
					{global: true, umd: true}[mod] ?
						`factory(global${
							(p.moduleName ? `.${p.moduleName} = {}` : '') +
							(adapter.importGlobal ? `, ${adapter.importGlobal}` : '')
						});` :
						''
				) +

			`})(this, function (exports${adapter.local ? `, ${adapter.local}` : ''}) {` +
				useStrict
		;
	}

	return compile(tpls).then(() => {
		if (opts.footer) {
			res += opts.footer;
		}

		if (mod !== 'native') {
			res += '});';
		}

		if (prettyPrint) {
			res = beautify.js(res);
		}

		return res.replace(nRgxp, eol) + eol;
	});
};

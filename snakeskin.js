module.exports = exports = require('./build/snakeskin.min');

var path = require('path');
var fs = require('fs'),
	exists = fs.existsSync || path.existsSync;

var cache = {};

function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

/**
 * Вернуть true, если заданный файл шаблонов соответствует скомпилированному
 * по временной метке
 *
 * @param {string} source - путь к исходному файлу
 * @param {string} result - путь к скомпилированному файлу
 * @param {(string|boolean|null)=} [opt_key] - ключ параметров компиляции
 * @return {boolean}
 */
exports.check = function (source, result, opt_key) {
	if (!exists(result)) {
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

			if (exists(el[0])) {
				if (fs.statSync(el[0]).mtime.valueOf() != el[1]) {
					return false;
				}

			} else {
				return false;
			}
		}
	}

	return true;
};

/**
 * Скомпилировать заданный файл и вернуть ссылку на полученный объект
 * или false, если произошла ошибка при компиляции
 *
 * @param {string} src - путь к файлу шаблонов
 *
 * @param {Object=} [opt_params] - дополнительные параметры компиляции
 * @see Snakeskin.compile
 *
 * @return {(!Object|boolean)}
 */
exports.compileFile = function (src, opt_params) {var this$0 = this;
	var p = opt_params || {};
	p.commonJS = true;

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
		resSrc = (("" + src) + ".js");

	var tpls,
		res = true;

	var compile = function()  {
		res = this$0.compile(source, p, {file: src});

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
 * Скомпилировать заданный файл и вернуть ссылку на главный шаблон (функцию)
 *
 * @param {string} src - путь к файлу шаблонов
 *
 * @param {Object=} [opt_params] - дополнительные параметры компиляции
 * @see Snakeskin.compile
 *
 * @param {?string=} [opt_tplName] - имя главного шаблона
 * @return {Function}
 */
exports.execFile = function (src, opt_params, opt_tplName) {
	var tpls = this.compileFile(src, opt_params),
		tpl;

	if (!tpls) {
		return null;
	}

	if (opt_tplName) {
		tpl = tpls[opt_tplName];

	} else {
		tpl = tpls[path.basename(src, path.extname(src))] || tpls.main || tpls[Object.keys(tpls)[0]];
	}

	return tpl || null;
};

/**
 * Скомпилировать заданный текст и вернуть ссылку на главный шаблон (функцию)
 *
 * @param {string} txt - исходный текст
 *
 * @param {Object=} [opt_params] - дополнительные параметры компиляции
 * @see Snakeskin.compile
 *
 * @param {?string=} [opt_tplName] - имя главного шаблона
 * @return {Function}
 */
exports.exec = function (txt, opt_params, opt_tplName) {
	var tpls = {},
		tpl;

	opt_params = opt_params || {};
	opt_params.context = tpls;

	this.compile(txt, opt_params);

	if (!tpls) {
		return null;
	}

	if (opt_tplName) {
		tpl = tpls[opt_tplName];

	} else {
		tpl = tpls.main || tpls[Object.keys(tpls)[0]];
	}

	return tpl || null;
};
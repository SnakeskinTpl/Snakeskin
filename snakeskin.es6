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
 * @param {?boolean=} [opt_includes=false] - если true, то в случае успешного результата
 *     вернётся массив подключаемых файлов
 *
 * @return {(boolean|!Array)}
 */
exports.check = function (source, result, opt_key, opt_includes) {
	if (!exists(source) || !exists(result)) {
		return false;
	}

	var code = fs.readFileSync(result).toString(),
		label = /label <([\d]+)>/.exec(code);

	if (opt_key === null || !label || fs.statSync(source).mtime.valueOf() != label[1]) {
		return false;
	}

	if (opt_key) {
		let key = /key <(.*?)>/.exec(code);

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

		for (let i = 0; i < includes.length; i++) {
			let el = includes[i];

			if (exists(el[0])) {
				if (fs.statSync(el[0]).mtime.valueOf() != el[1]) {
					return false;
				}

			} else {
				return false;
			}
		}

		if (opt_includes) {
			return includes.map((el) => el[0]);
		}
	}

	return opt_includes ? [] : true;
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
exports.compileFile = function (src, opt_params) {
	src = path.normalize(path.resolve(src));

	var p = opt_params || {};
	p.commonJS = true;

	var cacheEnabled = p.cache !== false;
	var cacheKey = this.compile(null, p, null, {cacheKey: true}),
		fromCache = cacheEnabled &&
			cache[cacheKey] &&
			cache[cacheKey][src];

	if (fromCache) {
		let tmp = fromCache;

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
		resSrc = `${src}.js`;

	var tpls,
		res = true;

	var compile = () => {
		res = this.compile(source, p, {file: src});

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
 * Вернуть ссылку на главный шаблон
 *
 * @param {!Object} tpls - таблица шаблонов
 * @param {?string=} [opt_src] - путь к файлу шаблонов
 * @param {?string=} [opt_tplName] - имя главного шаблона
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
			tpls[Object.keys(tpls)[0]];
	}

	return tpl || null;
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
	var tpls = this.compileFile(src, opt_params);

	if (!tpls) {
		return null;
	}

	return this.returnMainTpl(tpls, src, opt_tplName);
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
	var tpls = {};

	opt_params = opt_params || {};
	opt_params.context = tpls;

	this.compile(txt, opt_params);
	return this.returnMainTpl(tpls, null, opt_tplName);
};

module.exports = exports = require('./build/snakeskin.min');

var fs = require('fs');
var cache = {};

/**
 * Вернуть true, если заданный файл шаблонов соответствует скомпилированному
 * по временной метке
 *
 * @param {string} source - путь к исходному файлу
 * @param {string} result - путь к скомпилированному файлу
 * @return {boolean}
 */
exports.check = function (source, result) {
	if (!fs.existsSync(result)) {
		return false;
	}

	var label = fs.statSync(source).mtime,
		code = fs.readFileSync(result).toString();

	var resLabel = /label <([\d]+)>/.exec(code);

	if (!resLabel) {
		return false;
	}

	return label.valueOf() == resLabel[1];
};

/**
 * Скомпилировать заданный файл и вернуть ссылку на полученный объект
 * или false, если произошла ошибка при компиляции
 *
 * @param {string} src - путь к файлу шаблонов
 * @param {Object=} [opt_params] - дополнительные параметры компиляции
 * @return {(!Object|boolean)}
 */
exports.compileFile = function (src, opt_params) {
	opt_params = opt_params || {};
	opt_params.commonJS = true;

	if (cache[src]) {
		return cache[src];
	}

	var source = fs.readFileSync(src).toString(),
		resSrc = `${src}.js`;

	var tpls,
		res = true;

	if (!this.check(src, resSrc)) {
		res = this.compile(source, opt_params, {file: src});

		if (res !== false) {
			fs.writeFileSync(resSrc, res);
		}
	}

	if (res !== false) {
		cache[src] =
			tpls = require(resSrc);

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
 * @param {Object=} [opt_params] - дополнительные параметры компиляции
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
		tpl = tpls[src.split('.').slice(0, -1).join('.')] || tpls.main || tpls[Object.keys(tpls)[0]];
	}

	return tpl || null;
};

/**
 * Скомпилировать заданный текст и вернуть ссылку на главный шаблон (функцию)
 *
 * @param {string} txt - исходный текст
 * @param {Object=} [opt_params] - дополнительные параметры компиляции
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
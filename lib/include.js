var fsStack = [];

/**
 * Добавить содержимое файла в стек вставок в шаблон по заданному URL
 *
 * @expose
 * @param {string} base - базовый путь к файлу
 * @param {string} url - путь к файлу
 * @param {string} nl - символ перевода строки
 * @param {?string=} [opt_type] - тип рендеринга шаблонов
 * @return {(string|boolean)}
 */
Snakeskin.include = function (base, url, nl, opt_type) {
	if (!IS_NODE) {
		return false;
	}

	var fs = require('fs'),
		path = require('path');

	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	try {
		var extname = path['extname'](url),
			include = Snakeskin.LocalVars.include;

		var src = path['normalize'](path['resolve'](
			path['dirname'](base),
			url + (extname ? '' : '.ss')
		));

		if (!include[src]) {
			include[src] = true;
			var file = fs['readFileSync'](src).toString();

			fsStack.push(
				(("" + s) + ("__setFile__ " + (escapeBackslash(src))) + ("" + e) + "") +

				(opt_type ?
					(("" + s) + ("__setSSFlag__ renderAs '" + opt_type) + ("'" + e) + "") : '') +

				("" + (/^[ \t]*(?:\r\n|\r|\n)/.test(file) ? '' : nl)) +

				file +

				("" + (/(?:\r\n|\r|\n)[ \t]*$/.test(file) ? '' : (("" + nl) + ("" + s) + ("__cutLine__" + e) + ""))) +
				(("" + s) + ("__endSetFile__" + e) + "")
			);
		}

		return true;

	} catch (err) {
		fsStack.push((("" + s) + ("__setError__ " + (err.message)) + ("" + e) + ""));
	}

	return false;
};

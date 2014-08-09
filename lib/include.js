var fsStack = [];

/**
 * Добавить содержимое файла в стек вставок в шаблон по заданному URL
 *
 * @expose
 * @param {string} base - базовый путь к файлу
 * @param {string} url - путь к файлу
 * @return {(string|boolean)}
 */
Snakeskin.include = function (base, url) {
	if (!IS_NODE) {
		return false;
	}

	var fs = require('fs'),
		path = require('path');

	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	try {
		var extname = path['extname'](url);
		var src = path['resolve'](path['dirname'](base), path['normalize'](url) + (extname ? '' : '.ss')),
			include = Snakeskin.LocalVars.include;

		if (!include[src]) {
			include[src] = true;

			fsStack.push((("\
\n				" + s) + ("__setFile__ " + (applyDefEscape(src) + e)) + ("\
\n				" + (fs['readFileSync'](src).toString())) + ("\
\n				" + s) + ("__endSetFile__" + e) + "\
\n			"));
		}

		return true;

	} catch (err) {
		fsStack.push((("" + s) + ("__setError__ " + (err.message + e)) + ""));
	}

	return false;
};
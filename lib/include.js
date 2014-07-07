var fsStack = [];

/**
 * Добавить содержимое файла в стек вставок в шаблон по заданному URL
 *
 * @param {string} base - базовый путь к файлу
 * @param {string} url - путь к файлу
 * @return {(string|boolean)}
 */
Snakeskin['include'] = function (base, url) {
	var fs = require('fs'),
		path = require('path');

	try {
		var src = path.join(path.dirname(base), path.normalize(url));

		fsStack.push((("\
\n			{__setFile__ " + (applyDefEscape(src))) + ("}\
\n			" + (fs.readFileSync(src).toString())) + ("\
\n			{__setFile__ " + (applyDefEscape(base))) + "}\
\n		"));

		return true;

	} catch (ignore) {

	}

	return false;
};
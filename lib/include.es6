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

	try {
		let src = path['resolve'](path.dirname(base), path.normalize(url)),
			include = Snakeskin.LocalVars.include;

		if (!include[src]) {
			include[src] = true;

			fsStack.push(`
				{__setFile__ ${applyDefEscape(src)}}
				${fs['readFileSync'](src).toString()}
				{__setFile__ ${applyDefEscape(base)}}
			`);
		}

		return true;

	} catch (err) {
		fsStack.push(`{__setError__ ${err.message}}`);
	}

	return false;
};
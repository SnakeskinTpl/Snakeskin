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

	var lb = LEFT_BLOCK,
		rb = RIGHT_BLOCK;

	try {
		let extname = path['extname'](url);
		let src = path['resolve'](path['dirname'](base), path['normalize'](url) + (extname ? '' : '.ss')),
			include = Snakeskin.LocalVars.include;

		if (!include[src]) {
			include[src] = true;

			fsStack.push(`
				${lb}__setFile__ ${applyDefEscape(src) + rb}
				${fs['readFileSync'](src).toString()}
				${lb}__endSetFile__${rb}
			`);
		}

		return true;

	} catch (err) {
		fsStack.push(`${lb}__setError__ ${err.message + rb}`);
	}

	return false;
};
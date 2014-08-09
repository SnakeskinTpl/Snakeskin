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
		let extname = path['extname'](url);
		let src = path['resolve'](path['dirname'](base), path['normalize'](url) + (extname ? '' : '.ss')),
			include = Snakeskin.LocalVars.include;

		if (!include[src]) {
			include[src] = true;

			fsStack.push(`
				${s}__setFile__ ${applyDefEscape(src)}${e}
				${fs['readFileSync'](src).toString()}
				${s}__endSetFile__${e}
			`);
		}

		return true;

	} catch (err) {
		fsStack.push(`${s}__setError__ ${err.message}${e}`);
	}

	return false;
};
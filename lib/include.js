var fsStack = [];

/**
 * Добавить содержимое файла в стек вставок в шаблон по заданному URL
 *
 * @param {string} base - базовый путь к файлу
 * @param {string} url - путь к файлу
 * @param {string} nl - символ перевода строки
 * @param {?string=} [opt_type] - тип рендеринга шаблонов
 * @return {(string|boolean)}
 */
Snakeskin.include = function (base, url, nl, opt_type) {
	/* istanbul ignore if */
	if (!IS_NODE) {
		return false;
	}

	var fs = require('fs'),
		path = require('path'),
		glob = require('glob')['sync'];

	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	try {
		let extname = path.extname(url),
			include = Snakeskin.LocalVars.include;

		let src = path.resolve(
			path.dirname(base),
			url + (extname ? '' : '.ss')
		);

		(/\*/.test(src) ? glob(src) : [src]).forEach((src) => {
			src = path.normalize(src);

			if (!include[src]) {
				include[src] = true;
				let file = fs.readFileSync(src).toString();

				fsStack.push(
					`${s}__setFile__ ${src}${e}` +

					(opt_type ?
						`${s}__setSSFlag__ renderAs '${opt_type}'${e}` : '') +

					`${startWhiteSpaceRgxp.test(file) ? '' : nl}` +

					file +

					`${endWhiteSpaceRgxp.test(file) ? '' : `${nl}${s}__cutLine__${e}`}` +
					`${s}__endSetFile__${e}`
				);
			}
		});

		return true;

	} catch (err) {
		fsStack.push(`${s}__setError__ ${err.message}${e}`);
	}

	return false;
};

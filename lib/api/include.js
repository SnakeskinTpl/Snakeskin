const fsStack = [];

/**
 * Adds the contents of a file to a stack
 *
 * @param {string} base - base URL
 * @param {string} url - file URL
 * @param {string} nl - EOL symbol
 * @param {?string=} [opt_type] - a rendering mode of templates
 * @return {(string|boolean)}
 */
Snakeskin.include = function (base, url, nl, opt_type) {
	if (!IS_NODE) {
		return false;
	}

	const
		fs = require('fs'),
		path = require('path'),
		glob = require('glob')['sync'];

	const
		s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	try {
		const
			extname = path.extname(url),
			include = Snakeskin.LocalVars.include;

		const src = path.resolve(
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

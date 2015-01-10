/**
 * Преобразовать заданное значение в объект
 *
 * @param {?} val - объект, строка для парсинга или URL
 * @param {?string=} [opt_base] - базовый URL
 * @param {?function(string)=} [opt_onFileExists] - функция обратного вызова,
 *     если исходный объект - путь к существующему файлу
 *
 * @return {!Object}
 */
Snakeskin.toObj = function (val, opt_base, opt_onFileExists) {
	if (typeof val !== 'string') {
		return val;
	}

	var res;

	if (IS_NODE) {
		let path = require('path'),
			fs = require('fs'),
			old = val;

		try {
			if (opt_base) {
				val = path.resolve(path.dirname(opt_base), val);
			}

			val = path.normalize(path.resolve(val));

			if (fs.existsSync(val)) {
				if (opt_onFileExists) {
					opt_onFileExists(val);
				}

				let content = fs.readFileSync(val).toString();

				try {
					res = JSON.parse(content);

				} catch (ignore) {
					try {
						res = new Function(`return ${content}`)();

					} catch (ignore) {
						delete require['cache'][require['resolve'](val)];
						res = require(val);
					}
				}

				return Object(res || {});

			} else {
				val = old;
			}

		} catch (ignore) {
			val = old;
		}
	}

	try {
		res = JSON.parse(val);

	} catch (ignore) {
		try {
			res = new Function(`return ${val}`)();

		} catch (ignore) {
			res = {};
		}
	}

	return Object(res || {});
};

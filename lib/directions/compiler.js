(() => {
	/**
	 * Преобразовать заданное значение в объект
	 *
	 * @expose
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
					val = path['resolve'](path['dirname'](opt_base), val);
				}

				val = path['normalize'](path['resolve'](val));

				if (fs['existsSync'](val)) {
					if (opt_onFileExists) {
						opt_onFileExists(val);
					}

					let content = fs['readFileSync'](val).toString();

					try {
						res = JSON.parse(content);

					} catch (ignore) {
						try {
							res = eval(`(${content})`);

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
				res = eval(`(${val})`);

			} catch (ignore) {
				res = {};
			}
		}

		return Object(res || {});
	};

	/**
	 * Расширить объект a объектом b
	 * (глубокое расширение)
	 *
	 * @param {!Object} a
	 * @param {!Object} b
	 * @return {!Object}
	 */
	function extend(a, b) {
		forIn(b, (el, key) => {
			if (a[key] instanceof Object && el instanceof Object) {
				extend(a[key], el);

			} else {
				a[key] = el;
			}
		});

		return a;
	}

	/**
	 * Вернуть объект, расширенный с помощью заданных объектов
	 *
	 * @param {!Object} base - базовый расширяющий объект
	 * @param {Object=} [opt_adv] - дополнительный расширяющий объект
	 * @param {Object=} [opt_initial] - объект инициализации
	 * @return {!Object}
	 */
	function mix(base, opt_adv, opt_initial) {
		var obj = opt_initial || {};

		forIn(opt_adv, (el, key) => {
			obj[key] = el;
		});

		return extend(obj, base);
	}

	function setSSFlag(command) {
		this.startInlineDir();

		var file = this.info['file'],
			init = false;

		var root = this.params[0],
			last = this.params[this.params.length - 1],
			params = last;

		var cache,
			parentCache,
			tplName = this.tplName;

		if (tplName) {
			cache =
				outputCache[tplName]['flag'] = outputCache[tplName]['flag'] || {};

			if (this.parentTplName) {
				parentCache = outputCache[this.parentTplName] && outputCache[this.parentTplName]['flag'];
			}
		}

		if (last['@root'] || (file && last['@file'] !== file) || (tplName && last['@tplName'] !== tplName)) {
			init = true;
			params = {
				'@file': file,
				'@tplName': tplName
			};

			let inherit = (obj) => {
				for (let key in obj) {
					/* istanbul ignore if */
					if (!obj.hasOwnProperty(key)) {
						continue;
					}

					if (key.charAt(0) !== '@' && key in root) {
						params[key] =
							this[key] = obj[key];
					}
				}
			};

			inherit(last);

			if (parentCache) {
				inherit(parentCache);
			}

			this.params.push(params);
		}

		var flag,
			value;

		if (Array.isArray(command)) {
			flag = command[0];
			value = command[1];

		} else {
			let parts = command.split(' ');
			flag = parts[0];

			try {
				value = this.returnEvalVal(parts.slice(1).join(' '));

			} catch (err) {
				return this.error(err.message);
			}
		}

		var includeMap = {
			'language': true,
			'macros': true
		};

		if (flag === 'renderAs' && tplName) {
			return this.error('flag "renderAs" can\'t be used in the template declaration');
		}

		if (flag in root) {
			if (includeMap[flag]) {
				value = mix(
					Snakeskin.toObj(value, file, (src) => {
						var root = this.module.root || this.module;
						root.key.push([src, require('fs')['statSync'](src)['mtime'].valueOf()]);
						this.files[src] = true;
					}),

					init ?
						params[flag] : null,

					init ?
						null : params[flag]
				);

				if (flag === 'macros') {
					try {
						value = this.setMacros(value, null, init);

					} catch (err) {
						return this.error(err.message);
					}
				}
			}

			params[flag] =
				this[flag] = value;

			if (cache) {
				cache[flag] = value;
			}

		} else if (flag.charAt(0) !== '@') {
			return this.error(`unknown compiler flag "${flag}"`);
		}
	}

	Snakeskin.addDirective(
		'setSSFlag',

		{
			placement: 'global',
			group: 'define',
			notEmpty: true,
			replacers: {
				'@=': (cmd) => cmd.replace('@=', 'setSSFlag ')
			}
		},

		setSSFlag
	);

	Snakeskin.addDirective(
		'__setSSFlag__',

		{
			group: 'define',
			notEmpty: true,
			replacers: {
				'@=': (cmd) => cmd.replace('@=', 'setSSFlag ')
			}
		},

		setSSFlag
	);
})();

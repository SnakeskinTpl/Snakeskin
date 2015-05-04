/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

(() => {
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

	/**
	 * Extends an object A by an object B
	 * (deep extending)
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
	 * Extends an object and returns it
	 *
	 * @param {!Object} base - the source object
	 * @param {Object=} [opt_adv] - an additional object
	 * @param {Object=} [opt_initial] - an object of initialisation
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

		var file = this.info.file,
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
				forIn(obj, (el, key) => {
					if (key.charAt(0) !== '@' && key in root) {
						params[key] =
							this[key] = el;

						if (cache) {
							cache[key] = el;
						}
					}
				});
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
			return this.error('the flag "renderAs" can\'t be used in the template declaration');
		}

		if (flag in root) {
			if (includeMap[flag]) {
				value = mix(
					Snakeskin.toObj(value, file, (src) => {
						var root = this.module.root || this.module;
						root.key.push([src, require('fs').statSync(src).mtime.valueOf()]);
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
})();

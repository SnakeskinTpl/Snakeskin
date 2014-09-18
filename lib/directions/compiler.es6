/**
 * Преобразовать заданное значение в объект
 *
 * @expose
 * @param {?} val - объект, строка для парсинга или URL
 * @param {?string=} [opt_base] - базовый URL
 * @return {!Object}
 */
Snakeskin.toObj = function (val, opt_base) {
	var path = require('path');
	var fs = require('fs'),
		exists = fs['existsSync'] || path['existsSync'];

	if (typeof val !== 'string') {
		return val;
	}

	var res,
		old = val;

	if (opt_base) {
		val = path['resolve'](path['dirname'](opt_base), path['normalize'](val));
	}

	if (exists(val)) {
		res = require(val);

		if (res) {
			return res;
		}

		val = fs['readFileSync'](val).toString();

	} else {
		val = old;
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

	return res || {};
};

Snakeskin.addDirective(
	'setSSFlag',

	{
		placement: 'global',
		notEmpty: true,
		replacers: {
			'@=': (cmd) => cmd.replace('@=', 'setSSFlag ')
		}
	},

	function (command) {
		this.startInlineDir();

		var root = this.params[0],
			last = this.params[this.params.length - 1],
			params = last;

		if (last['@root'] || (this.info['file'] === void 0 || last['@file'] !== this.info['file'])) {
			params = {
				'@file': this.info['file']
			};

			for (let key in last) {
				if (!last.hasOwnProperty(key)) {
					continue;
				}

				if (key.charAt(0) !== '@' && key in root) {
					params[key] =
						this[key] = last[key];
				}
			}

			this.params.push(params);
		}

		var parts = command.split(' ');
		var flag = parts[0].trim(),
			value = this.evalStr('return ' + this.pasteDangerBlocks(parts.slice(1).join(' ')));

		var includeMap = {
			'language': true,
			'macros': true
		};

		if (flag in root) {
			if (IS_NODE && includeMap[flag]) {
				console.error(value);
				value = parse(value, this.info['file']);
				console.error(value);
			}

			params[flag] = value;
			this[flag] = value;
		}
	}
);
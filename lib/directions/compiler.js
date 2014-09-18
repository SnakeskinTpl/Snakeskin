/**
 * Преобразовать заданное значение в объект
 *
 * @expose
 * @param {?} val - объект, строка для парсинга или URL
 * @param {?string=} [opt_base] - базовый URL
 * @return {!Object}
 */
Snakeskin.toObj = function (val, opt_base) {
	if (typeof val !== 'string') {
		return val;
	}

	var res;

	if (IS_NODE) {
		var path = require('path');
		var fs = require('fs'),
			exists = fs['existsSync'] || path['existsSync'];

		var old = val;
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
	}

	try {
		res = JSON.parse(val);

	} catch (ignore) {
		try {
			res = eval((("(" + val) + ")"));

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
	for (var key in b) {
		if (!b.hasOwnProperty(key)) {
			continue;
		}

		if (a[key] instanceof Object && b[key] instanceof Object) {
			extend(a[key], b[key]);

		} else {
			a[key] = b[key];
		}
	}

	return a;
}

/**
 * Вернуть объект, расширенный с помощью заданных объектов
 *
 * @param {!Object} base - базовый расширяющий объект
 * @param {Object=} opt_adv - дополнительный расширяющий объект
 * @return {!Object}
 */
function mix(base, opt_adv) {
	var obj = {};

	if (opt_adv) {
		for (var key in opt_adv) {
			if (!opt_adv.hasOwnProperty(key)) {
				continue;
			}

			obj[key] = opt_adv[key];
		}
	}

	return extend(obj, base);
}

Snakeskin.addDirective(
	'setSSFlag',

	{
		placement: 'global',
		notEmpty: true,
		replacers: {
			'@=': function(cmd)  {return cmd.replace('@=', 'setSSFlag ')}
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

			for (var key in last) {
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
			if (includeMap[flag]) {
				value = mix(Snakeskin.toObj(value, this.info['file']), params[flag]);
			}

			params[flag] = value;
			this[flag] = value;
		}
	}
);
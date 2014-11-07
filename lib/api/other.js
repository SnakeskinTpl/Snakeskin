/*!
 * Различные вспомогательные методы и функции
 */

/**
 * Вернуть истинное имя директивы
 *
 * @param {?string} name - исходное имя
 * @return {?string}
 */
function getName(name) {
	return aliases[name] || name;
}

/**
 * Разбить строку по пробелам и вернуть массив
 * (учитываются директивы)
 *
 * @param {string} str - исходная строка
 * @return {Array}
 */
function splitBySpace(str) {
	var currentEscape,
		escape = false;

	var res = [''],
		bOpen = 0;

	for (let i = -1; ++i < str.length;) {
		currentEscape = escape;
		let el = str.charAt(i);

		if (el === '\\' || escape) {
			escape = !escape;
		}

		if (!currentEscape) {
			if (el === LEFT_BLOCK) {
				bOpen++;

			} else if (el === RIGHT_BLOCK) {
				bOpen--;
			}
		}

		if (el === ' ' && !bOpen) {
			res.push('');
		}

		if (el !== ' ' || bOpen) {
			res[res.length - 1] += el;
		}
	}

	return res;
}

/**
 * Вернуть имя функции из заданной строки
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.getFnName = function (str) {
	var tmp = /[^(]+/.exec(str),
		val = tmp ? tmp[0].trim() : '';

	if (!val) {
		this.error(`invalid "${this.name}" declaration`);
	}

	return val;
};

/**
 * Вернуть значение разницы длины команды с учётом типа декларации директивы
 *
 * @param {number} length - исходная длина
 * @return {number}
 */
DirObj.prototype.getDiff = function (length) {
	return length + Number(this.needPrfx) + 1;
};

/**
 * Вернуть таблицу названий директивы,
 * которые принадлежат к заданным группам
 *
 * @param {...string} names - название группы
 * @return {!Object}
 */
DirObj.prototype.getGroup = function (/*= names */...names) {
	var map = {},
		ignore = {};

	for (let i = -1; ++i < names.length;) {
		let name = names[i],
			group = groups[name];

		if (name === 'callback' && this.inlineIterators) {
			let inline = groups['inlineIterator'];

			for (let key in inline) {
				/* istanbul ignore if */
				if (!inline.hasOwnProperty(key)) {
					continue;
				}

				ignore[key] = true;
			}
		}

		for (let key in group) {
			if (!group.hasOwnProperty(key) || ignore[key]) {
				continue;
			}

			map[key] = true;
		}
	}

	return map;
};

/**
 * Сбросить слой параметров компиляции
 * @return {!DirObj}
 */
DirObj.prototype.popParams = function () {
	this.params.pop();

	let p = this.params[this.params.length - 1];
	for (let key in p) {
		/* istanbul ignore if */
		if (!p.hasOwnProperty(key)) {
			continue;
		}

		this[key] = p[key];
	}

	return this;
};

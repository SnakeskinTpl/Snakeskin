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
 * Вернуть имя функции из заданной строки
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} [opt_empty=false] - если true, то допускается "пустое" имя
 * @return {string}
 */
DirObj.prototype.getFnName = function (str, opt_empty) {
	var tmp = /^[^(]+/.exec(str),
		val = tmp ? tmp[0].trim() : '';

	if (!opt_empty && !val) {
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
			forIn(groups['inlineIterator'], (el, key) => {
				ignore[key] = true;
			});
		}

		forIn(group, (el, key) => {
			if (ignore[key]) {
				return;
			}

			map[key] = true;
		});
	}

	return map;
};

/**
 * Сбросить слой параметров компиляции
 * @return {!DirObj}
 */
DirObj.prototype.popParams = function () {
	this.params.pop();

	forIn(this.params[this.params.length - 1], (el, key) => {
		this[key] = el;
	});

	return this;
};

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
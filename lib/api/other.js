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
		this.error((("invalid \"" + (this.name)) + "\" declaration"));
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
DirObj.prototype.getGroup = function (/*= names */) {var SLICE$0 = Array.prototype.slice;var names = SLICE$0.call(arguments, 0);
	var map = {},
		ignore = {};

	for (var i = -1; ++i < names.length;) {
		var name = names[i],
			group = groups[name];

		if (name === 'callback' && this.inlineIterators) {
			var inline = groups['inlineIterator'];

			for (var key = void 0 in inline) {
				if (!inline.hasOwnProperty(key)) {
					continue;
				}

				ignore[key] = true;
			}
		}

		for (var key$0 = void 0 in group) {
			if (!group.hasOwnProperty(key$0) || ignore[key$0]) {
				continue;
			}

			map[key$0] = true;
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

	var p = this.params[this.params.length - 1];
	for (var key in p) {
		if (!p.hasOwnProperty(key)) {
			continue;
		}

		this[key] = p[key];
	}

	return this;
};
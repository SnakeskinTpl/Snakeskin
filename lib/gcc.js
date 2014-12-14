/**
 * Экспортировать свойство объекта для GCC
 *
 * @param {?} a - вариант 1
 * @param {?} b - вариант 2
 * @param {?=} [opt_c] - вариант 3
 * @return {?}
 */
function _(a, b, opt_c) {
	if (a !== void 0) {
		return a;
	}

	if (opt_c !== void 0) {
		return b === void 0 ?
			opt_c : b;
	}

	return b;
}

/**
 * Вернуть заданный объект с указанием произвольного типа
 * (для приведения типа в GCC)
 *
 * @param {?} val - исходное значение
 * @return {?}
 */
function Any(val) {
	return val;
}

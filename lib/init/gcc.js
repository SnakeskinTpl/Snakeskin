/**
 * Экспортировать свойство объекта для GCC
 *
 * @param {?} a - вариант 1
 * @param {?} b - вариант 2
 * @return {?}
 */
function _(a, b) {
	if (a !== undefined) {
		return a;
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
_.any = function (val) {
	return val;
};

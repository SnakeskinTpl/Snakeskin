/**
 * Клонировать заданный объект
 *
 * @param {?} obj - исходный объект
 * @return {?}
 */
function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

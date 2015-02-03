/**
 * Clones an object
 *
 * @param {?} obj - the source object
 * @return {?}
 */
function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

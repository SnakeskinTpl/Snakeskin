var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Вывести дополнительную информацию об ошибке
 *
 * @param {Object} obj - дополнительная информация
 * @return {string}
 */
DirObj.prototype.genErrorAdvInfo = function (obj) {
	var __NEJS_THIS__ = this;
	var str = '';
	for (var key in obj) {
		if (!obj.hasOwnProperty(key)) { continue; }

		if (!obj[key].innerHTML) {
			str += key + ': ' + obj[key] + ', ';

		} else {
			str += key + ': (class: ' + (obj[key].className || 'undefined') + ', id: ' +
				(obj[key].id || 'undefined') + '), ';
		}
	}

	return str.replace(/, $/, '');
};

/**
 * Генерировать ошибку
 *
 * @param {string} msg - сообщение ошибки
 * @return {!Error}
 */
DirObj.prototype.error = function (msg) {
	var __NEJS_THIS__ = this;
	var error = new Error(msg);
	error.name = 'Snakeskin Error';
	return error;
};
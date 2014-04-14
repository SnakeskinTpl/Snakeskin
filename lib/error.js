var __NEJS_THIS__ = this;
/**
 * Вывести дополнительную информацию об ошибке
 *
 * @param {Object=} [opt_obj] - дополнительная информация
 * @return {string}
 */
DirObj.prototype.genErrorAdvInfo = function (opt_obj) {
	var __NEJS_THIS__ = this;
	opt_obj = opt_obj || this.info;
	var str = '';

	if (!opt_obj) {
		return str;
	}

	for (var key in opt_obj) {
		if (!opt_obj.hasOwnProperty(key)) {
			continue;
		}

		if (!opt_obj[key].innerHTML) {
			str += key + ': ' + opt_obj[key] + ', ';

		} else {
			str += key + ': (class: ' + (opt_obj[key].className || 'undefined') + ', id: ' +
				(opt_obj[key].id || 'undefined') + '), ';
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
	var error = new Error(msg + ', ' + this.genErrorAdvInfo());
	error.name = 'Snakeskin Error';
	return error;
};
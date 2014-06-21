/**
 * Вывести дополнительную информацию об ошибке
 *
 * @param {Object=} [opt_obj] - дополнительная информация
 * @return {string}
 */
DirObj.prototype.genErrorAdvInfo = function (opt_obj) {
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
			str += (("" + key) + (": " + (opt_obj[key])) + ", ");

		} else {
			str += (("\
\n				" + key) + (": (\
\n					class: " + (opt_obj[key].className || 'undefined')) + (",\
\n					id: " + (opt_obj[key].id || 'undefined')) + "\
\n				), ");
		}
	}

	return str.replace(/, $/, '');
};

/**
 * Генерировать заданную ошибку
 *
 * @param {string} msg - сообщение ошибки
 * @return {!Error}
 */
DirObj.prototype.error = function (msg) {
	var error = new Error((("" + msg) + (", " + (this.genErrorAdvInfo())) + ""));
	error.name = 'Snakeskin Error';
	return error;
};
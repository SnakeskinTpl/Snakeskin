/**
 * Вывести дополнительную информацию об ошибке
 * @return {string}
 */
DirObj.prototype.genErrorAdvInfo = function () {
	var info = this.info;
	var str = '';

	if (!info) {
		return str;
	}

	for (var key in info) {
		if (!info.hasOwnProperty(key) || info[key] == null) {
			continue;
		}

		if (!info[key].innerHTML) {
			str += (("" + key) + (": " + (info[key])) + ", ");

		} else {
			str += (("" + key) + (": (class: " + (info[key].className || 'undefined')) + (", id: " + (info[key].id || 'undefined')) + "), ");
		}
	}

	return str.replace(/, $/, '');
};

/**
 * Генерировать заданную ошибку
 * @param {string} msg - сообщение ошибки
 */
DirObj.prototype.error = function (msg) {
	var report = (("" + msg) + (", " + (this.genErrorAdvInfo())) + ""),
		error = new Error(report);

	error.name = 'SnakeskinError';
	this.brk = true;

	if (this.onError) {
		this.onError(error);

	} else {
		if (typeof console === 'undefined' || 'log' in console === false || this.throws) {
			throw error;
		}

		console.error(report);
	}
};
/**
 * Вывести дополнительную информацию об ошибке
 * @return {string}
 */
DirObj.prototype.genErrorAdvInfo = function () {
	var info = this.info,
		str = '';

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

	str = str.replace(/, $/, '');
	var line = info['line'];

	var cutRgxp = /\/\*!!= (.*?) =\*\//g,
		styleRgxp = /\t|[ ]{4}/g;

	if (line) {
		var prfx = '',
			max = 0;

		for (var i = 8; i--;) {
			var pos = line - i - 2,
				prev = this.lines[pos];

			var space = new Array(String(line - 1).length - String(pos).length + 1)
				.join(' ');

			if (prev != null) {
				prev = prev
					.replace(styleRgxp, '  ')
					.replace(cutRgxp, '$1');

				var part = void 0;

				if (prev.trim()) {
					part = (("\n  " + (pos + 1)) + (" " + space) + ("" + prev) + "");

				} else {
					part = '\n  ...';
				}

				prfx += part;
				if (max < part.length) {
					max = part.length;
				}
			}
		}

		var current = this.lines[line - 1]
			.replace(styleRgxp, '  ')
			.replace(cutRgxp, '$1');

		var part$0 = (("> " + line) + (" " + current) + "");
		var sep = new Array(
			Math.max(max, part$0.length) || 5
		).join('-');

		str += (("\n" + sep) + ("" + prfx) + ("\n" + part$0) + ("\n" + sep) + "");
	}

	return str;
};

/**
 * @private
 * @type {?boolean}
 */
DirObj.prototype._error = null;

/**
 * Генерировать заданную ошибку
 * @param {string} msg - сообщение ошибки
 */
DirObj.prototype.error = function (msg) {
	if (this._error) {
		return;
	}

	this._error = true;
	var report = (("" + msg) + (", " + (this.genErrorAdvInfo())) + ""),
		error = new Error(report);

	error.name = 'SnakeskinError';
	this.brk = true;

	if (this.proto) {
		this.parent.brk = true;
	}

	if (this.onError) {
		this.onError(error);

	} else {
		if (typeof console === 'undefined' || typeof console.error !== 'function' || this.throws) {
			throw error;
		}

		console.error(("SnakeskinError: " + report));
	}
};
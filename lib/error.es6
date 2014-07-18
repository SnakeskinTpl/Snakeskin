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

	for (let key in info) {
		if (!info.hasOwnProperty(key) || info[key] == null) {
			continue;
		}

		if (!info[key].innerHTML) {
			str += `${key}: ${info[key]}, `;

		} else {
			str += `${key}: (class: ${info[key].className || 'undefined'}, id: ${info[key].id || 'undefined'}), `;
		}
	}

	str = str.replace(/, $/, '');
	var line = info['line'];

	if (line) {
		let prfx = '',
			max = 0;

		for (let i = 4; i--;) {
			let pos = line - i - 2,
				prev = this.lines[pos];

			if (prev != null) {
				prev = prev.trim();
				let part;

				if (prev) {
					part = `\n  ${pos} ${prev}`;

				} else {
					part = '\n  ...';
				}

				prfx += part;
				if (max < part.length) {
					max = part.length;
				}
			}
		}

		let current = this.lines[line - 1].trim(),
			part = `> ${line} ${current}`;

		let sep = new Array(
			Math.max(max, part.length) || 5
		).join('-');

		str += `\n${sep}${prfx}\n${part}\n${sep}`;
	}

	return str;
};

/**
 * Генерировать заданную ошибку
 * @param {string} msg - сообщение ошибки
 */
DirObj.prototype.error = function (msg) {
	var report = `${msg}, ${this.genErrorAdvInfo()}`,
		error = new Error(report);

	error.name = 'SnakeskinError';
	this.brk = true;

	if (this.onError) {
		this.onError(error);

	} else {
		if (typeof console === 'undefined' || typeof console.error !== 'function' || this.throws) {
			throw error;
		}

		console.error(`SnakeskinError: ${report}`);
	}
};
/*!
 * API для организации микрошаблонов внутри директивы
 */

/**
 * Разбить строку по пробелам и вернуть массив
 * (учитываются директивы)
 *
 * @param {string} str - исходная строка
 * @return {Array}
 */
function splitBySpace(str) {
	var escape = false;
	var res = [''],
		bOpen = 0,
		bStart = false;

	for (let i = -1; ++i < str.length;) {
		let currentEscape = escape;
		let el = str.charAt(i),
			part = str.substr(i, includeDirLength);

		if (el === '\\' || escape) {
			escape = !escape;
		}

		if (!currentEscape && includeDirMap[part]) {
			i += includeDirLength - 1;
			res[res.length - 1] += part;

			bStart = true;
			bOpen++;

			continue;
		}

		if (bStart) {
			if (el === LEFT_BLOCK) {
				bOpen++;

			} else if (el === RIGHT_BLOCK) {
				bOpen--;
			}
		}

		if (el === ' ' && !bOpen) {
			res.push('');
		}

		if (el !== ' ' || bOpen) {
			res[res.length - 1] += el;
		}
	}

	return res;
}

/**
 * Заменить ${ ... } или #{ ... } в указанной строке на значение вывода
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} [opt_sys=false] - если true, то запуск функции считается системным вызовом
 * @param {?boolean=} [opt_replace=false] - если true, то директивы экранируются (заменяются на __SNAKESKIN__\d+_)
 * @return {string}
 */
DirObj.prototype.replaceTplVars = function (str, opt_sys, opt_replace) {
	str = this.pasteDangerBlocks(str);

	var start = 0;
	var begin = 0,
		dir = '',
		res = '';

	var escape = false,
		comment = false;

	var bOpen = false,
		bEnd = true,
		bEscape = false;

	var part = '',
		rPart = '';

	var nextLineMap = {
		'n': '\n',
		'r': '\r'
	};

	for (let i = -1; ++i < str.length;) {
		let currentEscape = escape,
			pos = i;

		let el = str.charAt(i),
			next = str.charAt(i + 1);

		if (str.substr(i, 2) === '\r\n') {
			continue;
		}

		if (begin) {
			if (!bOpen) {
				if ((el === '\\' && strongSysEscapeMap[next]) || escape) {
					escape = !escape;
				}

				if (escape) {
					continue;
				}

				if (el === '\\' && nextLineMap[next]) {
					el = nextLineMap[next];
					i++;
				}

				// Обработка комментариев
				if (!currentEscape) {
					let commentType = returnComment(str, pos);

					if (commentType) {
						if (!comment) {
							comment = commentType;
							i += commentType.length - 1;

						} else if (commentType === MULT_COMMENT_END && comment === MULT_COMMENT_START) {
							comment = false;
							i += commentType.length - 1;
							continue;
						}

					} else if (nextLineRgxp.test(el) && comment === SINGLE_COMMENT) {
						comment = false;
					}
				}

				if (comment) {
					continue;
				}

				if (escapeEndMap[el] || escapeEndWordMap[rPart]) {
					bEnd = true;

				} else if (bEndRgxp.test(el)) {
					bEnd = false;
				}

				if (partRgxp.test(el)) {
					part += el;

				} else {
					rPart = part;
					part = '';
				}

				if (el === LEFT_BLOCK) {
					begin++;

				} else if (el === RIGHT_BLOCK) {
					begin--;
				}
			}

			if (escapeMap[el] && (el !== '/' || bEnd) && !bOpen) {
				bOpen = el;

			} else if (bOpen && (el === '\\' || bEscape)) {
				bEscape = !bEscape;

			} else if (escapeMap[el] && bOpen === el && !bEscape) {
				bOpen = false;
				bEnd = false;
			}

			if (begin) {
				dir += el;

			} else {
				escape = false;

				let tmp = '\' + ' +
					this.prepareOutput(this.replaceDangerBlocks(dir).trim() || '\'\'', opt_sys) +
					' + \'';

				if (opt_replace) {
					res += `__SNAKESKIN__${this.dirContent.length}_`;
					this.dirContent.push(tmp);

				} else {
					res += tmp;
				}
			}

		} else {
			if (el === '\\' && includeSysEscapeMap[next] || escape) {
				escape = !escape;
			}

			if (escape) {
				continue;
			}

			if (!currentEscape && includeDirMap[str.substr(pos, includeDirLength)]) {
				begin++;
				dir = '';

				start = i;
				i += includeDirLength - 1;

				escape = false;
				continue;
			}

			res += el !== '\\' || currentEscape ?
				applyDefEscape(el) : escapeSingleQuote(el);
		}
	}

	return res;
};

/*!
 * API для организации микрошаблонов внутри директивы
 */


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
		'r': '\r',
		'v': '\v'
	};

	for (var i = -1; ++i < str.length;) {
		var currentEscape = escape;
		var el = str.charAt(i),
			next = str.charAt(i + 1),
			next2str = el + next;

		if (next2str === '\r\n') {
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
					var next3str = next2str + str.charAt(i + 2);
					if (el === SINGLE_COMMENT.charAt(0) || el === MULT_COMMENT_START.charAt(0)) {
						if (!comment) {
							if (next3str === SINGLE_COMMENT) {
								comment = next3str;
								i += 2;

							} else if (next2str === MULT_COMMENT_START) {
								comment = next2str;
								i++;
							}

						} else if (str.charAt(i - 1) === MULT_COMMENT_END.charAt(0) && comment === MULT_COMMENT_START) {
							comment = false;
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
			}

			if (escapeMap[el] && (el === '/' ? bEnd : true) && !bOpen) {
				bOpen = el;

			} else if (bOpen && (el === '\\' || bEscape)) {
				bEscape = !bEscape;

			} else if (escapeMap[el] && bOpen === el && !bEscape) {
				bOpen = false;
				bEnd = false;
			}

			if (!bOpen) {
				if (el === LEFT_BLOCK) {
					begin++;

				} else if (el === RIGHT_BLOCK) {
					begin--;
				}
			}

			if (begin) {
				dir += el;

			} else {
				escape = false;

				var tmp = '\' + ' +
					this.prepareOutput(this.replaceDangerBlocks(dir), opt_sys) +
					' + \'';

				if (opt_replace) {
					res += (("__SNAKESKIN__" + (this.dirContent.length)) + "_");
					this.dirContent.push(tmp);

				} else {
					res += tmp;
				}
			}

		} else {
			if ((el === '\\' && includeSysEscapeMap[next]) || escape) {
				escape = !escape;
			}

			if (escape) {
				continue;
			}

			if (!currentEscape && includeDirMap[next2str]) {
				begin++;
				dir = '';

				start = i;
				i++;

				escape = false;
				continue;
			}

			res += el !== '\\' || currentEscape ?
				applyDefEscape(el) : escapeSingleQuote(el);
		}
	}

	return res;
};

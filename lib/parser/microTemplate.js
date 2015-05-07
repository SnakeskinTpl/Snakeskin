/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * Split string by a space, and returns an array
 * (with directives)
 *
 * @param {string} str - the source string
 * @return {!Array}
 */
function splitBySpace(str) {
	const
		res = [''];

	let
		escape = false,
		bOpen = 0,
		bStart = false;

	for (let i = -1; ++i < str.length;) {
		const
			currentEscape = escape,
			el = str.charAt(i),
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
 * Replaces found matches ${ ... } or #{ ... }
 * from a string to SS calls
 *
 * @param {string} str - the source string
 * @param {?boolean=} [opt_sys=false] - if is true, then call is considered as system
 * @param {?boolean=} [opt_replace=false] - if is true, then matches will be replaced to __SNAKESKIN__\d+_
 * @return {string}
 */
DirObj.prototype.replaceTplVars = function (str, opt_sys, opt_replace) {
	str = this.pasteDangerBlocks(str);

	let
		start = 0,
		begin = 0,
		dir = '',
		res = '';

	let
		escape = false,
		comment = false;

	let
		bOpen = false,
		bEnd = true,
		bEscape = false;

	let
		part = '',
		rPart = '';

	const nextLineMap = {
		'n': '\n',
		'r': '\r'
	};

	for (let i = -1; ++i < str.length;) {
		const
			currentEscape = escape,
			pos = i;

		let
			el = str.charAt(i),
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

				if (escapeEndMap[el] || escapeEndWords[rPart]) {
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

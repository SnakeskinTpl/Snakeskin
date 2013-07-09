/**
 * Стандартное экранирование
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.defEscape = function (str) {
	return str.replace(/\\/gm, '\\\\').replace(/'/gm, '\\\'');
};

/**
 * Заметить блоки вида ' ... ', " ... ", / ... / на
 * __SNAKESKIN_QUOT__номер
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceDangerBlocks = function (str) {
	var begin,
		escape,
		end = true,

		selectionStart,
		lastCutLength = 0,

		block = false;

	var stack = this.quotContent;
	return str.split('').reduce(function (res, el, i) {
		if (!begin) {
			if (escapeEndMap[el]) {
				end = true;

			} else if (/[^\s\/]/.test(el)) {
				end = false;
			}
		}

		if (begin === '/' && !escape) {
			if (el === '[') {
				block = true;

			} else if (el === ']') {
				block = false;
			}
		}

		if (escapeMap[el] && (el === '/' ? end : true) && !begin) {
			begin = el;
			selectionStart = i;

		} else if (begin && (el === '\\' || escape)) {
			escape = !escape;

		} else if (escapeMap[el] && begin === el && !escape) {
			begin = false;
			var cut = str.substring(selectionStart, i + 1),
				label = '__SNAKESKIN_QUOT__' + stack.length;

			stack.push(cut);
			res = res.substring(0, selectionStart - lastCutLength) + label + res.substring(i + 1 - lastCutLength);
			lastCutLength += cut.length - label.length;

		}

		return res;
	}, str);
};

/**
 * Заметить __SNAKESKIN_QUOT__номер в строке на реальное содержимое
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.pasteDangerBlocks = function (str) {
	var stack = this.quotContent;
	return str.replace(/__SNAKESKIN_QUOT__(\d+)/gm, function (sstr, pos) {
		return stack[pos];
	});
};
/**
 * Заметить блоки вида ' ... ', " ... ", / ... / на
 * __SNAKESKIN_QUOT__номер
 *
 * @param {string} str - исходная строка
 * @param {Array=} [opt_stack] - массив для подстрок
 * @return {string}
 */
DirObj.prototype.replaceDangerBlocks = function (str, opt_stack) {
	var begin,
		escape,
		end = true,
		selectionStart,
		lastCutLength = 0;

	return str.split('').reduce(function (res, el, i) {
		if (!begin) {
			if (escapeEndMap[el]) {
				end = true;

			} else if (/[^\s\/]/.test(el)) {
				end = false;
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
				label = '__SNAKESKIN_QUOT__' + (opt_stack ? opt_stack.length : '_');

			if (opt_stack) {
				opt_stack.push(cut);
			}

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
 * @param {!Array} stack - массив c подстроками
 * @return {string}
 */
DirObj.prototype.pasteDangerBlocks = function (str, stack) {
	return str.replace(/__SNAKESKIN_QUOT__(\d+)/g, function (sstr, pos) {
		return stack[pos];
	});
};
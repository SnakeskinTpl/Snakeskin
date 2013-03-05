/*!
 * Экранирование
 */

/**
 * Заметить кавычки с содержимом в строке на ссылку:
 * __SNAKESKIN_QUOT__номер
 *
 * @private
 * @param {string} str - исходная строка
 * @param {Array=} [opt_stack] - массив для подстрок
 * @return {string}
 */
Snakeskin._escape = function (str, opt_stack) {
	return str.replace(/(["']).*?[^\\]\1/g, function (sstr) {
		opt_stack && opt_stack.push(sstr);
		return '__SNAKESKIN_QUOT__' + (opt_stack ? opt_stack.length - 1 : '_');
	});
};

/**
 * Заметить __SNAKESKIN_QUOT__номер в строке на реальное содержимое
 *
 * @private
 * @param {string} str - исходная строка
 * @param {!Array} stack - массив c подстроками
 * @return {string}
 */
Snakeskin._uescape = function (str, stack) {
	return str.replace(/__SNAKESKIN_QUOT__(\d+)/g, function (sstr, pos) {
		return stack[pos];
	});
};
/**
 * Применить к указанной строке стандартное экранирование Snakeskin
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.applyDefEscape = function (str) {
	return str
		.replace(/\\/gm, '\\\\')
		.replace(/'/gm, '\\\'');
};

var applyDefEscape = DirObj.prototype.applyDefEscape;

/**
 * Экранировать символы перевода строки в указанной строке
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.escapeNextLine = function (str) {
	return str
		.replace(/\n/gm, '\\n')
		.replace(/\v/gm, '\\v')
		.replace(/\r/gm, '\\r');
};

if (typeof window === 'undefined') {
	global.EscaperIsLocal = true;
}

//#include ../node_modules/escaper/lib/escaper.js

/**
 * Заметить блоки вида ' ... ', " ... ", / ... /, ` ... `, // ..., /* ... *\/ на
 * __ESCAPER_QUOT__номер_ в указанной строке
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceDangerBlocks = function (str) {
	return Escaper.replace(str, true, this.quotContent, true);
};

/**
 * Заметить __ESCAPER_QUOT__номер_ в указанной строке на реальное содержимое
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.pasteDangerBlocks = function (str) {
	return Escaper.paste(str, this.quotContent);
};
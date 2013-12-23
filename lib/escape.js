var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Применить к строке стандартное экранирование
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.applyDefEscape = function (str) {
	var __NEJS_THIS__ = this;
	return str.replace(/\\/gm, '\\\\').replace(/'/gm, '\\\'');
};

/*dirObj.cDataContent[pos]
 .replace(/\n/gm, '\\n')
 .replace(/\r/gm, '\\r')
 .replace(/\v/gm, '\\v')
 .replace(/'/gm, '&#39;')*/

/**
 * Применить к строке экранирование пробельных символов
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.applySpaceEscape = function (str) {
	var __NEJS_THIS__ = this;
	return str
		.replace(/\n/gm, '\\n')
		.replace(/\r/gm, '\\r')
		.replace(/\v/gm, '\\v')
		.replace(/'/gm, '&#39;');
};

if (typeof window === 'undefined') {
	global.EscaperIsLocal = true;
}

//#include ../node_modules/escaper/escaper.js

/**
 * Заметить блоки вида ' ... ', " ... ", / ... /, // ..., /* ... *\/ на
 * __ESCAPER_QUOT__номер_
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceDangerBlocks = function (str) {
	var __NEJS_THIS__ = this;
	return Escaper.replace(str, true, this.quotContent);
};

/**
 * Заметить __ESCAPER_QUOT__номер_ в строке на реальное содержимое
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.pasteDangerBlocks = function (str) {
	var __NEJS_THIS__ = this;
	return Escaper.paste(str, this.quotContent);
};
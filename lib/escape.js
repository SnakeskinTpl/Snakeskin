var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Применить у строке стандартное экранирование
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.applyDefEscape = function (str) {
	var __NEJS_THIS__ = this;
	return str.replace(/\\/gm, '\\\\').replace(/'/gm, '\\\'');
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
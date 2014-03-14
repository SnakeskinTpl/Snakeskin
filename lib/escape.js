var __NEJS_THIS__ = this;
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

/**
 * Экранировать символы перевода строки
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.escapeNextLine = function (str) {
	var __NEJS_THIS__ = this;
	return str
		.replace(/\n/gm, '\\n')
		.replace(/\v/gm, '\\v')
		.replace(/\r/gm, '\\r');
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
	return Escaper.replace(str, true, this.quotContent, true);
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
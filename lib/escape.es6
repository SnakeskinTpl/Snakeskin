function applyDefEscape(str) {
	return str
		.replace(/\\/gm, '\\\\')
		.replace(/'/gm, '\\\'');
}

function escapeNextLine(str) {
	return str
		.replace(/\n/gm, '\\n')
		.replace(/\v/gm, '\\v')
		.replace(/\r/gm, '\\r');
}

if (typeof window === 'undefined' && typeof global !== 'undefined') {
	global.EscaperIsLocal = true;
}

//#include ../node_modules/escaper/lib/escaper.js

var escaperRgxp = /^__ESCAPER_QUOT__\d+_/;

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

/**
 * Заметить __SNAKESKIN__номер_ в указанной строке на реальное содержимое
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.pasteTplVarBlocks = function (str) {
	return str.replace(/__SNAKESKIN__(\d+)_/gm, (sstr, pos) => this.dirContent[pos]);
};
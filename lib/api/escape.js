/*!
 * Методы и функции для экранирования
 */

var sysEscapeMap = {
	'\\': true,
	[I18N]: true,
	[LEFT_BLOCK]: true,
	[ADV_LEFT_BLOCK]: true,
	[SINGLE_COMMENT.charAt(0)]: true,
	[MULT_COMMENT_START.charAt(0)]: true,
	[CONCAT_COMMAND]: true,
	[CONCAT_END]: true,
	[IGNORE_COMMAND]: true,
	[INLINE_COMMAND.trim().charAt(0)]: true
};

forIn(baseShortMap, (el, key) => {
	sysEscapeMap[key.charAt(0)] = true;
});

var strongSysEscapeMap = {
	'\\': true,
	[SINGLE_COMMENT.charAt(0)]: true,
	[MULT_COMMENT_START.charAt(0)]: true
};

var includeSysEscapeMap = {};
includeSysEscapeMap['\\'] = true;

forIn(includeDirMap, (el, key) => {
	includeSysEscapeMap[key.charAt(0)] = true;
});

var escapeMap = {
	'"': true,
	'\'': true,
	'/': true
};

var escapeEndMap = {
	'-': true,
	'+': true,
	'*': true,
	'%': true,
	'~': true,
	'>': true,
	'<': true,
	'^': true,
	',': true,
	';': true,
	'=': true,
	'|': true,
	'&': true,
	'!': true,
	'?': true,
	':': true,
	'(': true,
	'{': true,
	'[': true
};

var escapeEndWordMap = {
	'typeof': true,
	'void': true,
	'instanceof': true,
	'delete': true,
	'in': true,
	'new': true
};

var bMap = {
	'(': true,
	'[': true,
	'{': true
};

var closeBMap = {
	')': true,
	']': true,
	'}': true
};

var pMap = {
	'(': true,
	'[': true
};

var closePMap = {
	')': true,
	']': true
};

function escapeBackslash(str) {
	return String(str).replace(/\\/g, '\\\\');
}

function escapeSingleQuote(str) {
	return String(str)
		.replace(/'/g, '\\\'');
}

function escapeDoubleQuote(str) {
	return String(str)
		.replace(/"/g, '\\\"');
}

function applyDefEscape(str) {
	return escapeNextLine(
		String(str)
			.replace(/\\/g, '\\\\')
			.replace(/'/g, '\\\'')
	);
}

function escapeNextLine(str) {
	return String(str)
		.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r');
}

var Escaper,
	globalEscaper = root.Escaper;

/* istanbul ignore next */
////#include ../node_modules/escaper/dist/escaper.js

if (IS_NODE) {
	Escaper = exports;
	module.exports =
		exports = root;

} else {
	Escaper = root.Escaper;
	root.Escaper = globalEscaper;
}

Escaper.snakeskinRgxp = filterStartRgxp;
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
	return str.replace(/__SNAKESKIN__(\d+)_/g, (sstr, pos) => this.dirContent[pos]);
};

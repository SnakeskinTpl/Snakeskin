/*!
 * Методы и функции для экранирования
 */

var sysEscapeMap = {};

sysEscapeMap['\\'] = true;
sysEscapeMap[I18N] = true;
sysEscapeMap[LEFT_BLOCK] = true;
sysEscapeMap[ADV_LEFT_BLOCK] = true;
sysEscapeMap[SINGLE_COMMENT.charAt(0)] = true;
sysEscapeMap[MULT_COMMENT_START.charAt(0)] = true;

var strongSysEscapeMap = {};

strongSysEscapeMap['\\'] = true;
strongSysEscapeMap[SINGLE_COMMENT.charAt(0)] = true;
strongSysEscapeMap[MULT_COMMENT_START.charAt(0)] = true;

var includeSysEscapeMap = {};

for (var key in includeDirMap) {
	if (!includeDirMap.hasOwnProperty(key)) {
		continue;
	}

	includeSysEscapeMap[key.charAt(0)] = true
}

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
	'instaceof': true,
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

function escapeWinPath(str) {
	return String(str).replace(/\\/gm, '\\\\');
}

function applySimpleEscape(str) {
	return String(str)
		.replace(/'/gm, '\\\'');
}

function applyDefEscape(str) {
	return escapeNextLine(str)
		.replace(/\\/gm, '\\\\')
		.replace(/'/gm, '\\\'');
}

function escapeNextLine(str) {
	return String(str)
		.replace(/\n/gm, '\\n')
		.replace(/\v/gm, '\\v')
		.replace(/\r/gm, '\\r');
}

if (typeof window === 'undefined' && typeof global !== 'undefined') {
	global.EscaperIsLocal = true;
}

//#include ../../node_modules/escaper/lib/escaper.js

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
DirObj.prototype.pasteTplVarBlocks = function (str) {var this$0 = this;
	return str.replace(/__SNAKESKIN__(\d+)_/gm, function(sstr, pos)  {return this$0.dirContent[pos]});
};

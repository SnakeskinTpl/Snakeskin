/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const sysEscapeMap = {
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

const strongSysEscapeMap = {
	'\\': true,
	[SINGLE_COMMENT.charAt(0)]: true,
	[MULT_COMMENT_START.charAt(0)]: true
};

const includeSysEscapeMap = {};
includeSysEscapeMap['\\'] = true;

forIn(includeDirMap, (el, key) => {
	includeSysEscapeMap[key.charAt(0)] = true;
});

const escapeMap = {
	'"': true,
	'\'': true,
	'/': true
};

const escapeEndMap = {
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

const escapeEndWords = {
	'typeof': true,
	'void': true,
	'instanceof': true,
	'delete': true,
	'in': true,
	'new': true
};

const bMap = {
	'(': true,
	'[': true,
	'{': true
};

const closeBMap = {
	')': true,
	']': true,
	'}': true
};

const pMap = {
	'(': true,
	'[': true
};

const closePMap = {
	')': true,
	']': true
};

const
	backSlashRgxp = /\\/g,
	singleQRgxp = /'/g,
	qRgxp = /"/g;

function escapeBackslash(str) {
	return String(str)
		.replace(backSlashRgxp, '\\\\');
}

function escapeSingleQuote(str) {
	return String(str)
		.replace(singleQRgxp, '\\\'');
}

function escapeDoubleQuote(str) {
	return String(str)
		.replace(qRgxp, '\\\"');
}

function applyDefEscape(str) {
	return escapeNextLine(
		String(str)
			.replace(backSlashRgxp, '\\\\')
			.replace(singleQRgxp, '\\\'')
	);
}

const
	nRgxp = /\n/g,
	rRgxp = /\r/g;

function escapeNextLine(str) {
	return String(str)
		.replace(nRgxp, '\\n')
		.replace(rRgxp, '\\r');
}

Escaper.snakeskinRgxp = filterStartRgxp;
const escaperRgxp = /^__ESCAPER_QUOT__\d+_/;

/**
 * @see Escaper.replace
 * @param {string} str - the source string
 * @return {string}
 */
DirObj.prototype.replaceDangerBlocks = function (str) {
	return Escaper.replace(str, true, this.quotContent, true);
};

/**
 * @see Escaper.paste
 * @param {string} str - the source string
 * @return {string}
 */
DirObj.prototype.pasteDangerBlocks = function (str) {
	return Escaper.paste(str, this.quotContent);
};

const tplsVarsRgxp = /__SNAKESKIN__(\d+)_/g;

/**
 * Replaces all found blocks __SNAKESKIN__number_ to real content in a string
 * and returns a new string
 *
 * @param {string} str - the source string
 * @return {string}
 */
DirObj.prototype.pasteTplVarBlocks = function (str) {
	return str.replace(tplsVarsRgxp, (sstr, pos) => this.dirContent[pos]);
};

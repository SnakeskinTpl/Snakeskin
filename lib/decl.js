/*!
 * Различные таблицы и константы SS
 */

// Общие разделители директивы
// >>>

const LEFT_BLOCK = '{';
const RIGHT_BLOCK = '}';

// <<<
// Дополнительные разделители директивы
// >>>

const ADV_LEFT_BLOCK = '#';
const I18N = '`';

const SINGLE_COMMENT = '///';
const JS_DOC = '/**';

const MULT_COMMENT_START = '/*';
const MULT_COMMENT_END = '*/';

var commentMap = {
	[SINGLE_COMMENT]: SINGLE_COMMENT,
	[MULT_COMMENT_START]: MULT_COMMENT_START,
	[MULT_COMMENT_END]: MULT_COMMENT_END
};

/**
 * @param {string} str
 * @param {number} i
 * @return {(string|boolean)}
 */
function returnComment(str, i) {
	return commentMap[str.substr(i, SINGLE_COMMENT.length)] ||
		commentMap[str.substr(i, MULT_COMMENT_START.length)] ||
		commentMap[str.substr(i, MULT_COMMENT_END.length)] ||
		false;
}

var includeDirMap = {
	'${': true,
	'#{': true
};

var includeDirLength;

for (let key in includeDirMap) {
	/* istanbul ignore if */
	if (!includeDirMap.hasOwnProperty(key)) {
		continue;
	}

	includeDirLength = key.length;
	break;
}

var baseShortMap = {
	'-': true,
	'#': true
};

var shortMap = {};

for (let key in baseShortMap) {
	/* istanbul ignore if */
	if (!baseShortMap.hasOwnProperty(key)) {
		continue;
	}

	shortMap[key] = true;
}

// <<<
// Модификаторы контекста
// >>>

const L_MOD = '#';
const G_MOD = '@';

var modMap = {
	[L_MOD]: true,
	[G_MOD]: true
};

// <<<
// Константы Jade-Like синтаксиса
// >>>

const CONCAT_COMMAND = '&';
const CONCAT_END = '.';
const IGNORE_COMMAND = '|';
const INLINE_COMMAND = ' :: ';

// <<<
// Механизм фильтров
// >>>

const FILTER = '|';

// <<<
// Различные таблицы констант
// >>>

var sysConst = {
	'__IS_NODE__': true,
	'__EXPORTS__': true,
	'__HAS_EXPORTS__': true,
	'__INIT__': true,
	'__ROOT__': true,
	'__CALLEE__': true,
	'__ARGUMENTS__': true,
	'__BLOCKS__': true,
	'__RESULT__': true,
	'__COMMENT_RESULT__': true,
	'__CDATA__': true,
	'__RETURN__': true,
	'__RETURN_VAL__': true,
	'__NODE__': true,
	'__I_PROTO__': true,
	'__I__': true,
	'__ATTR_J__': true,
	'__ATTR_STR__': true,
	'__ATTR_TMP__': true,
	'__LENGTH__': true,
	'__KEYS__': true,
	'__KEY__': true,
	'__APPEND__': true,
	'__FILTERS__': true,
	'__VARS__': true,
	'__LOCAL__': true,
	'__THIS__': true,
	'__INCLUDE__': true,
	'$_': true
};

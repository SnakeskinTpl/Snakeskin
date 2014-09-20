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

// !!! MULT_COMMENT_START[0] == MULT_COMMENT_END[1]

const MULT_COMMENT_START = '/*';
const MULT_COMMENT_END = '*/';

var includeDirMap = {
	'${': true,
	'#{': true
};

var baseShortMap = {
	'-': true,
	'#': true
};

var shortMap = {};

for (let key in baseShortMap) {
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
	'@': true,
	'#': true
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
	'__ROOT__': true,
	'__BLOCKS__': true,
	'__RESULT__': true,
	'__TMP_RESULT__': true,
	'__CDATA__': true,
	'__RETURN__': true,
	'__RETURN_VAL__': true,
	'__NODE__': true,
	'__I_PROTO__': true,
	'__I__': true,
	'__J__': true,
	'__TMP__': true,
	'__LENGTH__': true,
	'__KEYS__': true,
	'__KEY__': true,
	'__STR__': true,
	'__APPEND__': true,
	'__FILTERS__': true,
	'__VARS__': true,
	'__LOCAL__': true,
	'__THIS__': true,
	'__INCLUDE__': true,
	'$_': true
};
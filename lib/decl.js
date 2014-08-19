// Общие разделители директивы
// >>>

var LEFT_BLOCK = '{';
var RIGHT_BLOCK = '}';

// <<<
// Дополнительные разделители директивы
// >>>

var ADV_LEFT_BLOCK = '#';
var I18N = '`';

var SINGLE_COMMENT = '///';
var JS_DOC = '/**';

// !!! MULT_COMMENT_START[0] == MULT_COMMENT_END[1]

var MULT_COMMENT_START = '/*';
var MULT_COMMENT_END = '*/';

var includeDirMap = {
	'${': true,
	'#{': true
};

var baseShortMap = {
	'-': true,
	'#': true
};

var shortMap = {};

for (var key in baseShortMap) {
	if (!baseShortMap.hasOwnProperty(key)) {
		continue;
	}

	shortMap[key] = true;
}

// <<<
// Модификаторы контекста
// >>>

var L_MOD = '#';
var G_MOD = '@';

var modMap = {
	'@': true,
	'#': true
};

// <<<
// Константы Jade-Like синтаксиса
// >>>

var CONCAT_COMMAND = '&';
var CONCAT_END = '.';
var IGNORE_COMMAND = '|';
var INLINE_COMMAND = ' :: ';

// <<<
// Механизм фильтров
// >>>

var FILTER = '|';

// <<<
// Различные таблицы констант
// >>>

var sysConst = {
	'__ROOT__': true,
	'__BLOCKS__': true,
	'__RESULT__': true,
	'__CDATA__': true,
	'__RETURN__': true,
	'__RETURN_VAL__': true,
	'__I_PROTO__': true,
	'__I__': true,
	'__J__': true,
	'__TMP__': true,
	'__LENGTH__': true,
	'__KEYS__': true,
	'__KEY__': true,
	'__STR__': true,
	'__FILTERS__': true,
	'__VARS__': true,
	'__LOCAL__': true,
	'__THIS__': true,
	'__INCLUDE__': true,
	'$_': true
};
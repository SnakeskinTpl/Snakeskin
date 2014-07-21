// Общие разделители директивы
// >>>

var LB = '{';
var RB = '}';

// <<<
// Дополнительные разделители директивы
// >>>

var ALB = '#';
var I18N = '`';

var SC = '///';
var JD = '/**';

var MCS = '/*';
var MCE = '*/';

var includeDirMap = {
	'${': true,
	'#{': true
};

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
// Механизм фильтров
// >>>

var F = '|';

// <<<
// Различные таблицы констант
// >>>

var sysConst = {
	'__ROOT__': true,
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

var escapeMap = {
	'"': true,
	'\'': true,
	'/': true
};

var escapeEndMap = {
	'-': true,
	'+': true,
	'*': true,
	',': true,
	';': true,
	'=': true,
	'|': true,
	'&': true,
	'?': true,
	':': true,
	'(': true,
	'{': true
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
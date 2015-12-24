'use strict';

// jscs:disable validateOrderInObjectKeys
// jscs:disable requireEnhancedObjectLiterals

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';

// The base directive separators
// >>>

export const
	LEFT_BLOCK = '{',
	RIGHT_BLOCK = '}',
	ADV_LEFT_BLOCK = '#';

// <<<
// The additional directive separators
// >>>

export const
	I18N = '`';

export const
	JS_DOC = '/**',
	SINGLE_COMMENT = '///',
	MULT_COMMENT_START = '/*',
	MULT_COMMENT_END = '*/';

export const COMMENTS = {
	[SINGLE_COMMENT]: SINGLE_COMMENT,
	[MULT_COMMENT_START]: MULT_COMMENT_START,
	[MULT_COMMENT_END]: MULT_COMMENT_END
};

export const MICRO_TEMPLATES = {
	'${': true,
	'#{': true
};

export const
	MICRO_TEMPLATE_LENGTH = Object.keys(MICRO_TEMPLATES)[0].length;

export const BASE_SHORTS = {
	'-': true,
	'#': true
};

export const
	SHORTS = $C(BASE_SHORTS).map((el) => el);

// <<<
// The context modifiers
// >>>

export const
	L_MOD = '#',
	G_MOD = '@';

export const MODS = {
	[L_MOD]: true,
	[G_MOD]: true
};

// <<<
// Jade-Like
// >>>

export const
	CONCAT = '&',
	CONCAT_END = '.',
	IGNORE = '|',
	INLINE = ' :: ';

// <<<
// The filter modifiers
// >>>

export const
	FILTER = '|';

// <<<
// Escaping
// >>>

export const SYS_ESCAPES = {
	'\\': true,
	[I18N]: true,
	[LEFT_BLOCK]: true,
	[ADV_LEFT_BLOCK]: true,
	[SINGLE_COMMENT[0]]: true,
	[MULT_COMMENT_START[0]]: true,
	[CONCAT]: true,
	[CONCAT_END]: true,
	[IGNORE]: true,
	[INLINE.trim()[0]]: true
};

$C(BASE_SHORTS).forEach((el, key) =>
	SYS_ESCAPES[key[0]] = true);

export const STRONG_SYS_ESCAPES = {
	'\\': true,
	[SINGLE_COMMENT[0]]: true,
	[MULT_COMMENT_START[0]]: true
};

export const MICRO_TEMPLATE_ESCAPES = {
	'\\': true
};

$C(MICRO_TEMPLATES).forEach((el, key) =>
	MICRO_TEMPLATE_ESCAPES[key[0]] = true);

export const ESCAPES = {
	'"': true,
	'\'': true,
	'/': true
};

export const ESCAPES_END = {
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

export const ESCAPES_END_WORD = {
	'typeof': true,
	'void': true,
	'instanceof': true,
	'delete': true,
	'in': true,
	'new': true
};

export const B_OPEN = {
	'(': true,
	'[': true,
	'{': true
};

export const B_CLOSE = {
	')': true,
	']': true,
	'}': true
};

export const P_OPEN = {
	'(': true,
	'[': true
};

export const P_CLOSE = {
	')': true,
	']': true
};

// <<<
// The reserved names
// >>>

export const SYS_CONSTS = {
	'__IS_NODE__': true,
	'__AMD__': true,
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
	'__ATTR_POS__': true,
	'__ATTR_STR__': true,
	'__ATTR_CONCAT_MAP__': true,
	'__ATTR_CACHE__': true,
	'__WRAP_TMP__': true,
	'__WRAP_CACHE__': true,
	'__LENGTH__': true,
	'__KEYS__': true,
	'__KEY__': true,
	'__APPEND__': true,
	'__FILTERS__': true,
	'__VARS__': true,
	'__LOCAL__': true,
	'__THIS__': true,
	'__INCLUDE__': true,
	'TRUE': true,
	'FALSE': true,
	'$_': true,
	'$0': true
};

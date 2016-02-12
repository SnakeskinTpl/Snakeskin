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

import Snakeskin from '../core';

// The base directive separators
// >>>

export const
	LEFT_BOUND = '{',
	RIGHT_BOUND = '}',
	ADV_LEFT_BOUND = '#';

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

export const
	MICRO_TEMPLATE = '${';

export const BASE_SHORTS = {
	'-': true,
	[ADV_LEFT_BOUND]: true
};

export const
	SHORTS = {};

Snakeskin.forEach(BASE_SHORTS, (el, key) =>
	SHORTS[key] = true);

// <<<
// The context modifiers
// >>>

export const
	G_MOD = '@';

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
	[LEFT_BOUND]: true,
	[ADV_LEFT_BOUND]: true,
	[SINGLE_COMMENT.charAt(0)]: true,
	[MULT_COMMENT_START.charAt(0)]: true,
	[CONCAT]: true,
	[CONCAT_END]: true,
	[IGNORE]: true,
	[INLINE.trim().charAt(0)]: true
};

Snakeskin.forEach(BASE_SHORTS, (el, key) =>
	SYS_ESCAPES[key.charAt(0)] = true);

export const STRONG_SYS_ESCAPES = {
	'\\': true,
	[SINGLE_COMMENT.charAt(0)]: true,
	[MULT_COMMENT_START.charAt(0)]: true
};

export const MICRO_TEMPLATE_ESCAPES = {
	'\\': true,
	[MICRO_TEMPLATE.charAt(0)]: true
};

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
	'__REQUIRE__': true,
	'__RESULT__': true,
	'__STRING_RESULT__': true,
	'__CDATA__': true,
	'__RETURN__': true,
	'__RETURN_VAL__': true,
	'__LENGTH__': true,
	'__ESCAPE_D_Q__': true,
	'__ATTR_STR__': true,
	'__ATTR_CONCAT_MAP__': true,
	'__ATTR_CACHE__': true,
	'__ATTR_TYPE__': true,
	'__TARGET_REF__': true,
	'__CALL_POS__': true,
	'__CALL_TMP__': true,
	'__CALL_CACHE__': true,
	'__FILTERS__': true,
	'__VARS__': true,
	'__LOCAL__': true,
	'__THIS__': true,
	'__INCLUDE__': true,
	'__INLINE_TAG__': true,
	'__INLINE_TAGS__': true,
	'__TAG__': true,
	'__NODE__': true,
	'__JOIN__': true,
	'__GET_XML_ATTR_KEY_DECL__': true,
	'__APPEND_XML_ATTR_VAL__': true,
	'__GET_XML_TAG_DECL_END__': true,
	'__GET_END_XML_TAG_DECL__': true,
	'TRUE': true,
	'FALSE': true,
	'module': true,
	'exports': true,
	'require': true,
	'__dirname': true,
	'__filename': true,
	'TPL_NAME': true,
	'PARENT_TPL_NAME': true,
	'Raw': true,
	'Unsafe': true,
	'Snakeskin': true,
	'getTplResult': true,
	'clearTplResult': true,
	'arguments': true,
	'self': true,
	'callee': true,
	'$_': true,
	'$0': true
};

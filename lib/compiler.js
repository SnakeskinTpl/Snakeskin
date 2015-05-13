/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from './deps/collection';
import { NULL } from './consts/links';
import { IS_NODE } from './consts/hacks';
import { Snakeskin } from './core';
import { any, _ } from './helpers/gcc';
import { setMacros } from './helpers/macros';
import { Parser } from './parser/index';
import * as rgxp from './consts/regs';

import {

	getFromCache,
	getCacheKey,
	saveIntoFnCache,
	saveIntoCache

} from './helpers/cache';

import {

	LEFT_BLOCK as lb,
	RIGHT_BLOCK as rb,
	ADV_LEFT_BLOCK as alb

} from './consts/literals';

/**
 * Compiles Snakeskin templates
 *
 * @param {(Element|string)} src - a reference to a DOM node, where the templates were declared
 *   or a text of the templates
 *
 * @param {?$$SnakeskinParams=} [opt_params] - additional runtime parameters:
 *
 *   *) [exports = 'default'] - an export type
 *   *) [context] - a storage object for the compiled templates
 *        (will be set the CommonJS export type)
 *
 *   *) [vars] - a map of super global variables, which will be added to Snakeskin.Vars
 *   *) [cache = true] - if is false, then caching is disabled
 *   *) [debug] - an object, which will be contained some debug information
 *
 *   *) [onError] - a callback for error handling
 *   *) [throws = false] - if is true, then in case of an error or a missing error handler,
 *        then will be thrown an exception
 *
 *   *) [localization = true] - if is false, then localization literals ` ... ` won't be wrapped with a i18n function
 *   *) [i18nFn = 'i18n'] - a name of the i18n function
 *   *) [language] - a map of words for localization (for example, {'Hello world': 'Привет мир'})
 *   *) [words] - an object, which will be contained all found localization words
 *
 *   *) [ignore] - a RegExp object, which specifies whitespace symbols for ignoring
 *   *) [autoReplace = false] - if is false, then macros will be disabled
 *   *) [macros] - a map of the macros
 *   *) [renderAs] - a rendering type of templates:
 *        1) placeholder - all templates will be rendered as "placeholder";
 *        2) interface - all templates will be rendered as "interface";
 *        3) template - all templates will be rendered as "template".
 *
 *   *) [renderMode = 'stringConcat'] - a rendering mode of templates:
 *        1) stringConcat - renders template to a string, for concatenation of strings will be used operator;
 *        2) stringBuffer - renders template to a string, for concatenation of strings
 *          will be used Snakeskin.StringBuffer;
 *        3) dom - renders template to a DocumentFragment object.
 *
 *   *) [eol = '\n'] - EOL symbol
 *   *) [tolerateWhitespace = false] - if is true, then whitespaces will be processed "as is"
 *   *) [inlineIterators = false] - if is true, then all forEach and forIn iterators will be rendered as loops
 *   *) [doctype = 'xml'] - a type of document:
 *        1) html;
 *        2) xml.
 *
 *   *) [replaceUndef = true] - if is false, then will be disabled the undef filter by default
 *   *) [escapeOutput = true] - if is false, then will be disabled the html filter by default
 *
 *   *) [useStrict = true] - if is false, then all templates will be compiled without the 'use strict'; mode;
 *   *) [bemFilter = 'bem'] - a name of the bem filter
 *   *) [prettyPrint = false] - if is true, then output will be formatted
 *
 * @param {?$$SnakeskinInfoParams=} [opt_info] - additional parameters for debug:
 *   *) [file] - a path of a template file
 *
 * @param {$$SnakeskinSysParams=} [opt_sysParams] - private parameters:
 *   *) [cacheKey = false] - if is true, then will bi returned a cache key of operation
 *
 *   *) [scope] - a context of directives
 *   *) [vars] - a map of local variables
 *   *) [consts] - an array of constant declarations
 *
 *   *) [proto] - parameters object of proto
 *   *) [parent] - a link for the parent object
 *
 *   *) [lines] - an array of template lines
 *   *) [needPrfx] - if is true, then for declaring directives will be used #{ ... }
 *
 * @return {(string|boolean|null)}
 */
Snakeskin.compile = function (src, opt_params, opt_info, opt_sysParams) {
	src = src || '';

	/** @type {$$SnakeskinSysParams} */
	const
		sp = any(opt_sysParams || {});

	/** @type {$$SnakeskinParams} */
	const
		p = any(opt_params || {});

	// GCC export
	// >>>

	const
		ctx = p.context || NULL,
		eol = p.eol = p.eol || '\n',
		words = p.words;

	p.exports = p.exports || 'default';
	p.prettyPrint = p.prettyPrint || false;
	p.renderMode = p.renderMode || 'stringConcat';
	p.inlineIterators = p.inlineIterators || false;
	p.tolerateWhitespace = p.tolerateWhitespace || false;
	p.replaceUndef = p.replaceUndef !== false;
	p.escapeOutput = p.escapeOutput !== false;
	p.throws = p.throws || false;
	p.cache = p.cache !== false;
	p.autoReplace = p.autoReplace || false;
	p.doctype = p.doctype !== false && (p.doctype || 'xml');

	if (p.renderMode === 'dom') {
		p.doctype = false;
	}

	p.useStrict = p.useStrict !== false;
	p.bemFilter = p.bemFilter || 'bem';
	p.vars = p.vars || {};

	$C(p.vars).forEach((val, key) => {
		Snakeskin.Vars[key] = val;
	});

	p.i18nFn = p.i18nFn || 'i18n';
	p.localization = p.localization !== false;

	// <<<
	// Debug information
	// >>>

	const
		info = any($C.extend(false, {line: 1}, opt_info || {}));

	let text;
	if (typeof src === 'object' && 'innerHTML' in src) {
		info.node = src;
		text = src.innerHTML.replace(rgxp.whitespaceStart, '');

	} else {
		text = String(src);
	}

	// <<<
	// Caching
	// >>>

	const
		cacheKey = getCacheKey(p, ctx);

	if (sp.cacheKey) {
		return cacheKey;
	}

	if (p.cache) {
		const
			tmp = getFromCache(cacheKey, text, p, ctx);

		if (tmp) {
			return tmp;
		}
	}

	// <<<
	// Working with macros
	// >>>

	let macros = {
		map: {},
		groups: {},
		inline: {},
		combo: {}
	};

	if (sp.proto) {
		macros = p.macros;

	} else {
		setMacros(p.macros, macros, null, true);
	}

	// <<<
	// File initialization
	// >>>

	let
		label = '',
		dirname,
		filename;

	if (!sp.proto) {
		Snakeskin.LocalVars.include = {};
		Snakeskin.UID = Math.random()
			.toString(16)
			.replace('0.', '')
			.substring(0, 5);

		if (IS_NODE && info.file) {
			let
				path = require('path'),
				fs = require('fs');

			filename =
				info.file = path.normalize(path.resolve(info.file));

			dirname = path.dirname(filename);
			Snakeskin.LocalVars.include[filename] = 'index';

			try {
				label = fs.statSync(filename).mtime;

			} catch (ignore) {}
		}
	}
};

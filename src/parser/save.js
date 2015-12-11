'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import Parser from './constructor';
import { eol, singleQuotes } from '../consts/regs';
import { escapeEOLs } from '../helpers/escape';
import { $write } from '../consts/cache';
import { ws, r } from '../helpers/string';
import { isFunction } from '../helpers/types';

import {

	LEFT_BLOCK as lb,
	RIGHT_BLOCK as rb,
	ADV_LEFT_BLOCK as alb

} from '../consts/literals';

/**
 * Returns a string for the beginning of concatenation with __RESULT__
 * @return {string}
 */
Parser.prototype.$ = function () {
	if (this.domComment) {
		return '__COMMENT_RESULT__ +=';
	}

	switch (this.renderMode) {
		case 'stringBuffer':
			return '__RESULT__.push(';

		case 'dom':
			return '__APPEND__(__RESULT__[__RESULT__.length - 1],';

		default:
			return '__RESULT__ +=';
	}
};

/**
 * Returns a string for the ending of concatenation with __RESULT__
 * @return {string}
 */
Parser.prototype.$$ = function () {
	if (this.domComment) {
		return '';
	}

	switch (this.renderMode) {
		case 'stringBuffer':
			return ')';

		case 'dom':
			return ')';

		default:
			return '';
	}
};

/**
 * Appends a string to __RESULT__
 *
 * @param {?string=} [opt_str] - source string
 * @return {string}
 */
Parser.prototype.wrap = function (opt_str) {
	// jscs:disable
	return this.$() + (opt_str || '') + this.$$() + ';';
};

/**
 * Returns a string of a node declaration
 * (for renderMode == dom)
 *
 * @param {?boolean=} [opt_inline=false] - if is true, then the node considered as inline
 * @return {string}
 */
Parser.prototype.getPushNodeDecl = function (opt_inline) {
	return ws`
		${this.wrap('__NODE__')}
		${opt_inline ? '' : '__RESULT__.push(__NODE__);'}
		__NODE__ = null;
	`;
};

/**
 * Returns a string of template content
 * @return {string}
 */
Parser.prototype.getReturnResultDecl = function () {
	switch (this.renderMode) {
		case 'stringBuffer':
			return '__RESULT__.join(\'\')';

		case 'dom':
			return '__RESULT__[0]';

		default:
			return '__RESULT__';
	}
};

/**
 * Returns a string of a template declaration
 * @return {string}
 */
Parser.prototype.getReturnDecl = function () {
	switch (this.renderMode) {
		case 'stringBuffer':
			return 'new Snakeskin.StringBuffer()';

		case 'dom':
			return '[document.createDocumentFragment()]';

		default:
			return '\'\'';
	}
};

/**
 * Replaces CDATA blocks in a string
 *
 * @param {string} str - source string
 * @return {string}
 */
Parser.prototype.replaceCData = function (str) {
	const
		s = alb + lb,
		e = rb;

	return str
		.replace(new RegExp(`${r(s)}cdata${r(e)}([\\s\\S]*?)${r(s)}(?:\\/cdata|end cdata)${r(e)}`, 'g'), (sstr, data) => {
			this.cDataContent.push(data);
			return String(
					// The number of added lines
					`${s}__appendLine__ ${(data.match(new RegExp(eol.source, 'g')) || '').length}${e}` +

					// Label to replace CDATA
					`__CDATA__${this.cDataContent.length - 1}_`
			);
		});
};

/**
 * Declares the end of a template declaration
 *
 * @param {?string} cacheKey - cache key
 * @param {(Date|string)} label - declaration label
 * @return {!Parser}
 */
Parser.prototype.end = function (cacheKey, label) {
	label = label || '';
	switch (this.renderMode) {
		case 'stringBuffer':
			this.res = this.res.replace(/__RESULT__\.push\(''\);/g, '');
			break;

		case 'dom':
			this.res = this.res.replace(/__APPEND__\(__RESULT__\[__RESULT__\.length - 1],''\);/g, '');
			break;

		default:
			this.res = this.res.replace(/__RESULT__ \+= '';/g, '');
			break;
	}

	let includes = '';
	if (this.environment.key.length) {
		includes = JSON.stringify(this.environment.key);
	}

	this.res = this.pasteDangerBlocks(this.res)
		.replace(
			/__CDATA__(\d+)_/g,
			(sstr, pos) => escapeEOLs(
				this.cDataContent[pos].replace(new RegExp(eol.source, 'g'), this.eol)
			).replace(singleQuotes, '&#39;')
		);

	const
		versionDecl = `Snakeskin v${Snakeskin.VERSION.join('.')}`,
		keyDecl = `key <${cacheKey}>`,
		labelDecl = `label <${label.valueOf()}>`,
		includesDecl = `includes <${includes}>`,
		generatedAtDecl = `generated at <${new Date().valueOf()}>`,
		resDecl = `${this.eol}   ${this.res}`;

	this.res = `/* ${versionDecl}, ${keyDecl}, ${labelDecl}, ${includesDecl}, ${generatedAtDecl}.${resDecl}`;
	this.res += ws`
			}

			${
				this.exports === 'default' ?
					ws`
						if (!__IS_NODE__ && !__HAS_EXPORTS__) {
							__INIT__();
						}
					` : ''
			}

		}).call(this);
	`;

	return this;
};

/**
 * Returns true, if is possible to write in the JS string
 * @return {boolean}
 */
Parser.prototype.isSimpleOutput = function () {
	if (this.getDirName(this.name) !== 'end' && this.strong) {
		this.error(`the directive "${this.structure.name}" can not be used with a "${this.strong}"`);
		return false;
	}

	return !this.parentTplName && !this.protoStart && !this.outerLink && (!this.proto || !this.proto.parentTplName);
};

/**
 * Returns true, if
 *   !proto && !outerLink &&
 *   (
 *       parentTplName && !hasParentBlock ||
 *       !parentTplName
 *   )
 *
 * @return {boolean}
 */
Parser.prototype.isAdvTest = function () {
	const res = (
		!this.proto && !this.outerLink &&
		(
			(this.parentTplName && !this.hasParentBlock({
				'block': true,
				'proto': true
			})) ||
			!this.parentTplName
		)
	);

	return Boolean(res);
};

/**
 * Adds a string to the JS string if is possible
 *
 * @param {string=} str - source string
 * @param {?boolean=} [opt_interface=false] - if is true, then the current operation is an interface
 * @param {(boolean|number)=} [opt_jsDoc] - last position of appending jsDoc or false
 * @return {boolean}
 */
Parser.prototype.save = function (str, opt_interface, opt_jsDoc) {
	if (str === undefined) {
		return false;
	}

	if (!this.tplName || $write[this.tplName] !== false || opt_interface) {
		if (opt_jsDoc) {
			const pos = Number(opt_jsDoc);
			this.res = this.res.slice(0, pos) + str + this.res.slice(pos);

		} else {
			this.res += str;
		}

		return true;
	}

	return false;
};

/**
 * Adds a string to the JS string if is possible
 * (with this.isSimpleOutput())
 *
 * @param {(string|function(this:Parser))=} str - source string or a function
 * @param {?boolean=} [opt_interface=false] - if is true, then the current operation is an interface
 * @param {(boolean|number)=} [opt_jsDoc] - last position of appending jsDoc or false
 * @return {boolean}
 */
Parser.prototype.append = function (str, opt_interface, opt_jsDoc) {
	if (isFunction(str)) {
		if (!this.protoStart && (!this.proto || !this.proto.parentTplName)) {
			str = str.call(this);

		} else {
			return false;
		}
	}

	if (!this.isSimpleOutput()) {
		return false;
	}

	return this.save(str, opt_interface, opt_jsDoc);
};

/**
 * Calls a callback function if is possible to write to the JS string
 * (with this.isSimpleOutput())
 *
 * @param {function(this:Parser)} callback - callback function
 * @return {boolean}
 */
Parser.prototype.mod = function (callback) {
	if (!this.isSimpleOutput()) {
		return false;
	}

	if (!this.tplName || $write[this.tplName] !== false) {
		callback.call(this);
		return true;
	}

	return false;
};

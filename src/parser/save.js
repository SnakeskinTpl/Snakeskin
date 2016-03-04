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
import { r } from '../helpers/string';
import { any } from '../helpers/gcc';
import { escapeEOLs } from '../helpers/escape';
import { eol, singleQuotes } from '../consts/regs';
import { $write } from '../consts/cache';
import { LEFT_BOUND, RIGHT_BOUND, ADV_LEFT_BOUND } from '../consts/literals';

/**
 * Returns a string for the beginning of concatenation with __RESULT__
 * @return {string}
 */
Parser.prototype.$ = function () {
	if (this.stringResult) {
		return '__STRING_RESULT__ += ';
	}

	switch (this.renderMode) {
		case 'stringConcat':
			return '__RESULT__ += ';

		case 'stringBuffer':
			return '__RESULT__.push(';

		default:
			return 'Snakeskin.appendChild(__RESULT__[__RESULT__.length - 1], ';
	}
};

/**
 * Returns a string for the ending of concatenation with __RESULT__
 * @return {string}
 */
Parser.prototype.$$ = function () {
	if (this.stringResult) {
		return '';
	}

	switch (this.renderMode) {
		case 'stringConcat':
			return '';

		case 'stringBuffer':
			return ')';

		default:
			return `, '${this.renderMode}')`;
	}
};

/**
 * Appends a string to __RESULT__
 *
 * @param {?string=} [opt_str] - source string
 * @return {string}
 */
Parser.prototype.wrap = function (opt_str) {
	return `${this.$()}${opt_str || ''}${this.$$()};`;
};

/**
 * Returns a string of template declaration
 * @return {string}
 */
Parser.prototype.getResultDecl = function () {
	switch (this.renderMode) {
		case 'stringConcat':
			return `''`;

		case 'stringBuffer':
			return 'new Snakeskin.StringBuffer()';

		default:
			return `[new Snakeskin.DocumentFragment('${this.renderMode}')]`;
	}
};

/**
 * Returns a string of template content
 * @return {string}
 */
Parser.prototype.getReturnResultDecl = function () {
	const
		r = '__RESULT__ instanceof Raw ? __RESULT__.value : ';

	switch (this.renderMode) {
		case 'stringConcat':
			return `${r}__RESULT__`;

		case 'stringBuffer':
			return `${r}__JOIN__(__RESULT__)`;

		default:
			return `${r}__RESULT__[0]`;
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
		s = ADV_LEFT_BOUND + LEFT_BOUND,
		e = RIGHT_BOUND;

	return str
		.replace(new RegExp(`${r(s)}cdata${r(e)}([\\s\\S]*?)${r(s)}(?:\\/cdata|end cdata)${r(e)}`, 'g'), (str, data) => {
			this.cdataContent.push(data);
			return String(
				// The number of added lines
				`${s}__appendLine__ ${(data.match(new RegExp(eol.source, 'g')) || '').length}${e}` +

				// Label to replace CDATA
				`__CDATA__${this.cdataContent.length - 1}_`
			);
		});
};

/**
 * Declares the end of Snakeskin declaration
 *
 * @param {?string} cacheKey - cache key
 * @param {(Date|string)} label - declaration label
 * @return {!Parser}
 */
Parser.prototype.end = function (cacheKey, label) {
	label = label || '';

	// Replace some trash :)
	switch (this.renderMode) {
		case 'stringConcat':
			this.result = this.result.replace(/__RESULT__ \+= '';/g, '');
			break;

		case 'stringBuffer':
			this.result = this.result.replace(/__RESULT__\.push\(''\);/g, '');
			break;

		default:
			this.result = this.result.replace(
				new RegExp(
					`Snakeskin\\.appendChild\\(__RESULT__\\[__RESULT__\\.length - 1], '', '${this.renderMode}'\\);`,
					'g'
				),

				''
			);

			break;
	}

	if (this.cdataContent.length) {
		this.result = this.result.replace(/__CDATA__(\d+)_/g, (str, pos) =>
			escapeEOLs((this.cdataContent[pos] || '')
				.replace(new RegExp(eol.source, 'g'), this.eol)).replace(singleQuotes, '\\\'')
		);
	}

	const
		versionDecl = `Snakeskin v${Snakeskin.VERSION.join('.')}`,
		keyDecl = `key <${cacheKey}>`,
		labelDecl = `label <${label.valueOf()}>`,
		includesDecl = `includes <${this.environment.key.length ? JSON.stringify(this.environment.key) : ''}>`,
		generatedAtDecl = `generated at <${new Date().valueOf()}>`,
		resDecl = `${this.eol}   ${this.result}`;

	this.result = `/* ${versionDecl}, ${keyDecl}, ${labelDecl}, ${includesDecl}, ${generatedAtDecl}.${resDecl}`;

	if (this.module !== 'native') {
		this.result += '});';
	}

	return this;
};

/**
 * Returns true if is possible to write in the JS string
 * @return {boolean}
 */
Parser.prototype.isSimpleOutput = function () {
	return !this.parentTplName && !this.outerLink;
};

/**
 * Returns true if !outerLink && (parentTplName && !hasParentBlock || !parentTplName)
 * @return {boolean}
 */
Parser.prototype.isAdvTest = function () {
	return Boolean(
		!this.outerLink && (this.parentTplName && !this.hasParentBlock(this.getGroup('block')) || !this.parentTplName)
	);
};

/**
 * Adds a string to the result JS string if is possible
 *
 * @param {string=} str - source string
 * @param {?$$SnakeskinParserSaveParams=} [opt_params] - addition parameters:
 *
 *   *) [iface=false] - if is true, then the current operation is an interface
 *   *) [raw=false] - if is true, then the appending text is considered as raw
 *   *) [jsDoc] - last position of appending jsDoc or false
 *
 * @return {(boolean|string)}
 */
Parser.prototype.save = function (str, opt_params) {
	const
		{iface, jsDoc, raw} = any(opt_params || {});

	if (str === undefined) {
		return false;
	}

	if (!this.tplName || $write[this.tplName] !== false || iface) {
		if (!raw) {
			str = this.pasteDangerBlocks(str);
		}

		if (jsDoc) {
			const pos = Number(jsDoc);
			this.result = this.result.slice(0, pos) + str + this.result.slice(pos);

		} else {
			this.result += str;
		}

		return str;
	}

	return false;
};

/**
 * Adds a string to the result JS string if is possible
 * (with this.isSimpleOutput())
 *
 * @param {string=} str - source string
 * @param {?$$SnakeskinParserSaveParams=} [opt_params] - addition parameters:
 *
 *   *) [iface=false] - if is true, then the current operation is an interface
 *   *) [raw=false] - if is true, then the appending text is considered as raw
 *   *) [jsDoc] - last position of appending jsDoc or false
 *
 * @return {(boolean|string)}
 */
Parser.prototype.append = function (str, opt_params) {
	if (!this.isSimpleOutput()) {
		return false;
	}

	return this.save(str, opt_params);
};

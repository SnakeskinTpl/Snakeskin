'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Snakeskin from '../core';
import { ws } from '../helpers/string';

Snakeskin.addDirective(
	'forEach',

	{
		block: true,
		deferInit: true,
		group: ['cycle', 'callback', 'inlineIterator'],
		notEmpty: true
	},

	function (command) {
		command = command.replace(/=>>/g, '=>=>');

		const
			parts = command.split(/\s*=>\s*/),
			[obj] = parts;

		if (!parts.length || parts.length > (this.inlineIterators ? 2 : 3)) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir(parts.length === 3 ? '$forEach' : null, {
			params: parts[2] ? parts[1] : null
		});

		if (!this.isReady()) {
			return;
		}

		if (!this.inlineIterators) {
			if (parts.length === 3) {
				this.append(ws`
					${this.out(`$C(${parts[0]})`, {unsafe: true})}.forEach(function (${this.declCallbackArgs(parts)}) {
						${this.declArguments()}
				`);

				return;
			}

			this.append(ws`
				Snakeskin.forEach(
					${this.out(parts[0], {unsafe: true})},
					function (${this.declCallbackArgs(parts[1])}) {
						${this.declArguments()}
			`);

			return;
		}

		const
			tmpObj = this.declVars(`__I_OBJ__ = ${obj}`),
			cacheObj = this.out('__I_OBJ__', {unsafe: true});

		const
			keys = this.out('__KEYS__', {unsafe: true}),
			args = parts[1] ? parts[1].split(',') : [];

		let
			objLength = this.declVars('__KEYS__ = Object.keys ? Object.keys(__I_OBJ__) : null');

		if (args.length >= 6) {
			objLength += ws`
				${this.declVars(`__LENGTH__ = __KEYS__ ? __KEYS__.length : 0`)}

				if (!${keys}) {
					${this.declVars('__LENGTH__ = 0')}

					for (${this.declVars('__KEY__', false, '')} in ${cacheObj}) {
						if (!${cacheObj}.hasOwnProperty(${this.out('__KEY__', {unsafe: true})})) {
							continue;
						}

						${this.out('__LENGTH__++;', {unsafe: true})}
					}
				}
			`;
		}

		let resStr = ws`
			${tmpObj}

			if (${cacheObj}) {
				if (Array.isArray(${cacheObj})) {
					${this.declVars('__LENGTH__ =  __I_OBJ__.length')}
					for (${this.declVars('__I__ = -1') + this.out('++__I__ < __LENGTH__;', {unsafe: true})}) {
		`;

		resStr += $C(args).reduce((res, el, i) => {
			switch (i) {
				case 0:
					el += ' = __I_OBJ__[__I__]';
					break;

				case 1:
					el += ' = __I__';
					break;

				case 2:
					el += ' = __I_OBJ__';
					break;

				case 3:
					el += ' = __I__ === 0';
					break;

				case 4:
					el += ' = __I__ === __LENGTH__ - 1';
					break;

				case 5:
					el += ' = __LENGTH__';
					break;
			}

			return res += this.declVars(el);

		}, '');

		let end = ws`
			} else {
				${objLength}

				if (${keys}) {
					${this.declVars(`__LENGTH__ = __KEYS__.length`)}
					for (${this.declVars('__I__ = -1') + this.out('++__I__ < __LENGTH__;', {unsafe: true})}) {
		`;

		end += $C(args).reduce((res, el, i) => {
			switch (i) {
				case 0:
					el += ' = __I_OBJ__[__KEYS__[__I__]]';
					break;

				case 1:
					el += ' = __KEYS__[__I__]';
					break;

				case 2:
					el += ' = __I_OBJ__';
					break;

				case 3:
					el += ' = __I__';
					break;

				case 4:
					el += ' = __I__ === 0';
					break;

				case 5:
					el += ' = __I__ === __LENGTH__ - 1';
					break;

				case 6:
					el += ' = __LENGTH__';
					break;
			}

			return res += this.declVars(el);

		}, '');

		let oldEnd = ws`
			} else {
				${this.declVars('__I__ = -1')}

				for (${this.declVars('__KEY__', false, '')} in ${cacheObj}) {
					if (!${cacheObj}.hasOwnProperty(${this.out('__KEY__', {unsafe: true})})) {
						continue;
					}

					${this.out('__I__++;', {unsafe: true})}
		`;

		oldEnd += $C(args).reduce((res, el, i) => {
			switch (i) {
				case 0:
					el += ' = __I_OBJ__[__KEY__]';
					break;

				case 1:
					el += ' = __KEY__';
					break;

				case 2:
					el += ' = __I_OBJ__';
					break;

				case 3:
					el += ' = __I__';
					break;

				case 4:
					el += ' = __I__ === 0';
					break;

				case 5:
					el += ' = __I__ === __LENGTH__ - 1';
					break;

				case 6:
					el += ' = __LENGTH__';
					break;
			}

			return res += this.declVars(el);

		}, '');

		this.append(resStr);
		this.structure.params = {
			end,
			from: this.result.length,
			oldEnd
		};
	},

	function () {
		if (!this.isReady()) {
			return;
		}

		const
			{params} = this.structure;

		if (this.inlineIterators) {
			const part = this.result.slice(params.from);
			this.append(`} ${params.end + part} } ${params.oldEnd + part} }}}}`);

		} else {
			if (params.params) {
				this.append(`}, ${this.out(params.params, {unsafe: true})});`);

			} else {
				this.append('});');
			}
		}
	}
);

Snakeskin.addDirective(
	'forIn',

	{
		block: true,
		group: ['cycle', 'callback', 'inlineIterator'],
		notEmpty: true
	},

	function (command) {
		const
			parts = command.split(/\s*=>\s*/),
			[obj] = parts;

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		if (!this.isReady()) {
			return;
		}

		if (!this.inlineIterators) {
			this.append(ws`
				Snakeskin.forIn(
					${this.out(parts[0], {unsafe: true})},
					function (${this.declCallbackArgs(parts[1])}) {
						${this.declArguments()}
			`);

			return;
		}

		const
			args = parts[1] ? parts[1].split(',') : [],
			tmpObj = this.declVars(`__I_OBJ__ = ${obj}`),
			cacheObj = this.out('__I_OBJ__', {unsafe: true});

		let
			objLength = '';

		if (args.length >= 6) {
			objLength += ws`
				${this.declVars('__LENGTH__ = 0')}

				for (${this.declVars('key', false, '')} in ${cacheObj}) {
					${this.out('__LENGTH__++;', {unsafe: true})}
				}
			`;
		}

		let resStr = ws`
			${tmpObj}

			if (${cacheObj}) {

				${objLength}
				${this.declVars('__I__ = -1')}

				for (${this.declVars('__KEY__', false, '')} in ${cacheObj}) {
					${this.out('__I__++;', {unsafe: true})}
		`;

		resStr += $C(args).reduce((res, el, i) => {
			switch (i) {
				case 0:
					el += ' = __I_OBJ__[__KEY__]';
					break;

				case 1:
					el += ' = __KEY__';
					break;

				case 2:
					el += ' = __I_OBJ__';
					break;

				case 3:
					el += ' = __I__';
					break;

				case 4:
					el += ' = __I__ === 0';
					break;

				case 5:
					el += ' = __I__ === __LENGTH__ - 1';
					break;

				case 6:
					el += ' = __LENGTH__';
					break;
			}

			return res += this.declVars(el);

		}, '');

		this.append(resStr);
	},

	function () {
		this.append($=> this.inlineIterators ? '}}' : '});');
	}
);

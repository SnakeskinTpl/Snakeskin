'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Parser from './constructor';
import { ws } from '../helpers/string';

/**
 * The map of prototype callbacks
 */
Parser.prototype.backTable = {
	init() {
		return {};
	}
};

/**
 * The number of prototype callbacks
 * (when "apply" calls before prototype declaration)
 * @type {number}
 */
Parser.prototype.backTableI = 0;

/**
 * If is true, then proto declaration is started
 * @type {boolean}
 */
Parser.prototype.protoStart = false;

/**
 * The index of anonymous prototypes
 * @type {number}
 */
Parser.prototype.anonI = 0;

/**
 * Returns a declaration string of proto arguments
 *
 * @param {!Array.<!Array>} protoArgs - array of the proto arguments [a name, a value by default]
 * @param {!Array} args - array of specified arguments
 * @return {string}
 */
Parser.prototype.returnProtoArgs = function (protoArgs, args) {
	let tmp = [];

	const
		{length} = protoArgs;

	return $C(protoArgs).reduce((res, el, i) => {
		const
			val = this.out(args[i] || 'void 0', {sys: true});

		let
			[arg, def] = el;

		arg = arg.replace(scopeModRgxp, '');
		if (def !== undefined) {
			def = this.out(def, {sys: true});
		}

		if (protoArgs['__SNAKESKIN_TMP__needArgs'] && i === length - 1) {
			if (length - 1 < args.length) {
				tmp = tmp.concat(args.slice(length - 1, args.length));
			}

			res += ws`
				var ${arg} = [${tmp.join()}];
				${arg}.callee = __CALLEE__;
			`;

		} else {
			tmp.push(arg);
			res += ws`
				var ${arg} = ${
					def !== undefined ?
						val ? `${val} != null ? ${val} : ${this.out(def, {sys: true})}` : def : val || 'void 0'
				};
			`;
		}

		return res;

	}, '');
};

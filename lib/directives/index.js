/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';
import { stack } from '../include';
import { $C } from '../deps/collection';
import { SHORTS } from '../consts/literals';
import { isFunction, isArray } from '../helpers/types';
import { r } from '../helpers/string';
import {

	DIR_NAME_ALIASES,
	DIR_NAME_REPLACERS,

	SYS_DIRS,
	BLOCK_DIRS,
	TEXT_DIRS,
	DIR_GROUPS,

	DIR_AFTER,
	DIR_INSIDE,
	DIR_CHAIN,
	DIR_END,

	CONSTS

} from '../consts/cache';

import {

	LEFT_BLOCK as lb,
	ADV_LEFT_BLOCK

} from '../consts/literals';

const
	alb = ADV_LEFT_BLOCK + lb;

/**
 * Inits the specified group
 *
 * @param {string} name - the group name
 * @return {string}
 */
Snakeskin.group = function (name) {
	return lb + name;
};

/**
 * Inits the specified name
 *
 * @param {string} name - the group name
 * @return {string}
 */
Snakeskin.placement = function (name) {
	return alb + name;
};

/**
 * Adds a new directive to the SS namespace
 *
 * @param {string} name - the directive name
 * @param {{
 *   deferInit: (?boolean|undefined),
 *   alias: (?boolean|undefined),
 *   text: (?boolean|undefined),
 *   placement: (?string|undefined),
 *   notEmpty: (?boolean|undefined),
 *   group: (Array|string|undefined),
 *   chain: (Array|string|undefined),
 *   end: (Array|string|undefined),
 *   inside: (Array|string|undefined),
 *   after: (Array|string|undefined),
 *   sys: (?boolean|undefined),
 *   block: (?boolean|undefined),
 *   selfInclude: (?boolean|undefined),
 *   replacers: (Object.<string, (string|function(string): string)>|undefined)
 * }} params - additional parameters:
 *
 *   *) [params.deferInit = false] - if is true, the directive won't be started automatically
 *   *) [params.alias = false] - if is true, then the directive is considered as an alias
 *        (only for private directives)
 *
 *   *) [params.text = false] - if is true, then the directive will be outputted as a plain text
 *   *) [params.placement] - placement of the directive ('global', 'template', ...)
 *   *) [params.notEmpty = false] - if is true, then the directive can't be empty
 *
 *   *) [params.group] - a group name, which includes the current directive
 *        or an array of names
 *
 *   *) [params.chain] - a directive name, which is a master for the current directive
 *        or an array of names
 *
 *   *) [params.inside] - a directive name, which can be included in the current directive
 *        or an array of names
 *
 *   *) [params.after] - a directive name, which can be placed after the current directive
 *        or an array of names
 *
 *   *) [params.end] - a directive name, which must be closed using the current directive
 *        or an array of names
 *
 *   *) [params.sys = false] - if is true, then the directive is considered as a system type
 *   *) [params.block = false] - if is true, then the directive is considered as a block type
 *   *) [params.selfInclude = true] - if is false, then the directive can't be placed inside an another directive
 *        of the same type
 *
 *   *) [params.replacers] - shorthands for the directive
 *        replacers: {
 *          // Can be no more than two symbols in the key
 *          '?': 'void '
 *        }
 *
 * @param {function(this:Parser, string, number, string, (boolean|number))} constr - constructor
 * @param {?function(this:Parser, string, number, string, (boolean|number))=} opt_destr - destructor
 */
Snakeskin.addDirective = function (name, params, constr, opt_destr) {
	params = params || {};

	const
		q = (el) => `"${el}"`,
		_ = ([cache, val]) => ({cache, val});

	$C([
		_([BLOCK_DIRS, params.block]),
		_([SYS_DIRS, params.sys]),
		_([TEXT_DIRS, params.text])

	]).forEach(({cache, val}) => { cache[name] = Boolean(val); });

	$C([
		_([DIR_GROUPS, params.group]),
		_([DIR_PLACEMENT, params.placement]),
		_([DIR_CHAIN, params.chain]),
		_([DIR_INSIDE, params.inside]),
		_([DIR_AFTER, params.after]),
		_([DIR_END, params.end])

	]).forEach(({cache, val}) => {
		$C(isArray(val) ? val : [val]).forEach((key) => {
			cache[key] = cache[key] || {};
			cache[key][name] = true;
		});
	});

	$C([
		DIR_CHAIN,
		DIR_INSIDE,
		DIR_AFTER,
		DIR_END

	]).forEach((cache) => {
		$C(cache).forEach((el, key) => {
			if (key[0] === lb) {
				delete cache[key];
				$C(DIR_GROUPS[key.slice(1)]).forEach((el, key) => {
					cache[key] = cache[key] || {};
					cache[el][name] = true;
				});
			}
		});
	});

	$C(params.replacers).forEach((el, key) => {
		if (key.length > 2) {
			throw new Error(`Invalid shorthand key "${key}" (key.length > 2)`);
		}

		DIR_NAME_REPLACERS[key] = isFunction(el) ?
			el : (cmd) => cmd.replace(r(key), el) ;

		if (key[0] !== '/') {
			SHORTS[key] = true;
		}
	});

	if (params.alias) {
		DIR_NAME_ALIASES[name] = name.replace(/__(.*?)__/, '$1');
	}

	if (!(params.selfInclude = params.selfInclude !== false)) {
		params.block = true;
	}

	let
		placement = params.placement;

	/** @this {Parser} */
	Snakeskin.Directives[name] = function (command, commandLength, type, jsDoc) {
		const
			sourceName = this.getDirName(name);

		let
			parser = this,
			dirName = sourceName;

		if (parser.ctx) {
			dirName = parser.name || dirName;
			parser = parser.ctx;
		}

		const
			ignore = DIR_GROUPS['ignore'][dirName],
			struct = parser.structure;

		parser.name = dirName;
		switch (placement) {
			case `${alb}template`:
				if (!struct.parent) {
					parser.error(
						`"${dirName}" can be used only within: ${parser.getGroupList('template').map(q).join(', ')}`
					);
				}

				break;

			case `${alb}global`:
				if (struct.parent) {
					parser.error(`"${dirName}" can be used only within the global space`);
				}

				break;

			default:
				const
					isGroup = placement[0] === lb;

				placement = isGroup ?
					placement.slice(1) : 0;

				if (placement && parser.hasParent(placement)) {
					parser.error(`"${dirName}" can be used only within a "${params.placement}"`);
				}
		}

		if (params.notEmpty && !command) {
			return parser.error(`the directive "${dirName}" must have a body`);
		}

		if (params.chain && !$C(params.chain).some((el) => struct.name === el)) {
			const groups = $C(params.chain).reduce((arr, el) => arr.concat(DIR_GROUPS_LIST[el]), []);
			return parser.error(`the directive "${dirName}" can be used only with a ${groups.join(', ')}`);
		}

		if (struct.strong) {
			if (DIR_INSIDE[struct.name][dirName]) {
				parser.chainSpace = false;

			} else if (!ignore && sourceName === dirName && dirName !== 'end') {
				return parser.error(`the directive "${dirName}" can't be used within the "${struct.name}"`);
			}
		}

		if (!params.selfInclude && parser.has(dirName)) {
			return parser.error(`the directive "${dirName}" can't be used within the "${dirName}"`);
		}

		if (params.text) {
			parser.text = true;
		}

		const from = parser.res.length;

		if (!params.deferInit && !params.chain) {
			if (params.block) {
				parser.startDir();

			} else {
				parser.startInlineDir();
			}
		}

		constr.call(parser, command, commandLength, type, jsDoc);

		if (parser.structure.params['@from'] === undefined) {
			parser.structure.params['@from'] = from;
		}

		const
			newStruct = parser.structure;

		if (DIR_INSIDE[dirName]) {
			newStruct.strong = true;
			parser.chainSpace = true;
		}

		if (dirName === sourceName) {
			if (struct === newStruct) {
				if (!ignore && DIR_AFTER[struct.name] && !DIR_AFTER[struct.name][dirName]) {
					return parser.error(`the directive "${dirName}" can't be used after the "${struct.name}"`);
				}

			} else {
				const
					siblings = sourceName === 'end' ?
						newStruct.children : newStruct.parent && newStruct.parent.children;

				if (siblings) {
					let
						j = 1,
						prev;

					while ((prev = siblings[siblings.length - j]) && (prev.name === 'text' || prev === newStruct)) {
						j++;
					}

					if (!ignore && prev && DIR_AFTER[prev.name] && !DIR_AFTER[prev.name][dirName]) {
						return parser.error(`the directive "${dirName}" can't be used after the "${prev.name}"`);
					}
				}
			}
		}

		parser
			.applyQueue();

		if (parser.inline === true) {
			baseEnd.call(parser);

			if (opt_destr) {
				opt_destr.call(parser, command, commandLength, type, jsDoc);
			}

			parser.inline = null;
			parser.structure = parser.structure.parent;

			if (parser.blockStructure && parser.blockStructure.name === 'const') {
				parser.blockStructure = parser.blockStructure.parent;
			}
		}
	};

	Snakeskin.Directives[`${name}End`] = opt_destr;

	/** @this {Parser} */
	const baseEnd = Snakeskin.Directives[`${name}BaseEnd`] = function () {
		const
			params = this.structure.params;

		if (params['@scope']) {
			this.scope.pop();
		}

		$C(params['@consts']).forEach((el, key) => {
			CONSTS[this.tplName][key] = el;
		});

		const
			res = params['@res'] ?
				params['@res'] : this.res,

			from = params['@from'],
			to = res.length;

		if (from == null) {
			return;
		}

		const parent =
			this.structure.parent;

		if ((!parent || parent.name === 'root') && !this.getGroup('define')[name] && from !== to) {
			try {
				this.evalStr(res.substring(from, to));

			} catch (err) {
				return this.error(err.message);
			}

			if (stack.length) {
				this.source =
					this.source.substring(0, this.i + 1) +
					this.replaceCData(stack.join('')) +
					this.source.substring(this.i + 1);

				stack.splice(0, stack.length);
			}
		}
	};
};

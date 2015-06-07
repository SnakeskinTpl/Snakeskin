/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from './core';
import { $C } from './deps/collection';
import { SHORTS } from './consts/literals'
import {

	DIR_NAME_REPLACERS,
	SYS_DIRS,
	BLOCK_DIRS,
	TEXT_DIRS,
	AFTER_DIR,
	INSIDE_DIR,
	DIR_CHAIN,
	DIR_END,
	ALIASES,
	DIR_GROUPS,
	DIR_GROUPS_LIST,
	CONSTS

} from './consts/cache';

const
	aliasRgxp = /__(.*?)__/;

/**
 * Adds a new directive to the SS namespace
 *
 * @param {string} name - the directive name
 * @param {{
 *   alias: (?boolean|undefined),
 *   text: (?boolean|undefined),
 *   placement: (?string|undefined),
 *   notEmpty: (?boolean|undefined),
 *   chain: (Array|string|undefined),
 *   end: (Array|string|undefined),
 *   group: (Array|string|undefined),
 *   sys: (?boolean|undefined),
 *   block: (?boolean|undefined),
 *   selfInclude: (?boolean|undefined),
 *   replacers: (Object|undefined),
 *   inside: (Object|undefined),
 *   after: (Object|undefined)
 * }} params - additional parameters:
 *
 *   *) [params.alias = false] - if is true, then the directive is considered as an alias
 *        (only for private directives)
 *
 *   *) [params.text = false] - if is true, then the directive will be outputted as a plain text
 *   *) [params.placement] - placement of the directive ('global', 'template', ...)
 *   *) [params.notEmpty = false] - if is true, then the directive can't be empty
 *
 *   *) [params.chain] - a directive name, which is a master for the current directive
 *        or an array of names
 *
 *   *) [params.end] - a directive name, which must be closed using the current directive
 *        or an array of names
 *
 *   *) [params.group] - a group name, which includes the current directive
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
 *          '?': (cmd) => cmd.replace(/^\?/, 'void ')
 *        }
 *
 *   *) [params.inside] - a map of directives, which can be included in the current directive
 *        inside: {
 *          'case': true,
 *          'default': true
 *        }
 *
 *   *) [params.after] - a map of directives, which can be placed after the current directive
 *        after: {
 *          'catch': true,
 *          'finally': true
 *        }
 *
 * @param {function(this:Parser, string, number, string, (boolean|number))} constr - constructor
 * @param {?function(this:Parser, string, number, string, (boolean|number))=} opt_destr - destructor
 */
Snakeskin.addDirective = function (name, params, constr, opt_destr) {
	params = params || {};

	const _ = (arr) => {
		return {
			val: arr[1],
			cache: arr[0],
			type: arr[2]
		};
	};

	$C([
		_([AFTER_DIR, params.after]),
		_([INSIDE_DIR, params.inside]),
		_([BLOCK_DIRS, params.block, Boolean]),
		_([SYS_DIRS, params.sys, Boolean]),
		_([TEXT_DIRS, params.text, Boolean])

	]).forEach(({cache, val, type}) => {
		cache[name] = type ?
			type(val) : val;

	});

	$C(params.replacers).forEach((el, key) => {
		if (key.length > 2) {
			throw new Error(`Invalid shorthand key "${key}" (key.length > 2)`);
		}

		DIR_NAME_REPLACERS[key] = el;

		if (key[0] !== '/') {
			SHORTS[key] = true;
		}
	});

	if (params.alias) {
		ALIASES[name] = name.replace(aliasRgxp, '$1');
	}

	$C(Array.isArray(params.group) ? params.group : [params.group]).forEach((group) => {
		if (!DIR_GROUPS[group]) {
			DIR_GROUPS[group] = {};
			DIR_GROUPS_LIST[group] = [];
		}

		DIR_GROUPS[group][name] = true;
		DIR_GROUPS_LIST[group].push(`"${name}"`);
	});

	$C(Array.isArray(params.chain) ? params.chain : [params.chain]).forEach((chain) => {
		DIR_CHAIN[chain] = DIR_CHAIN[chain] || {};
		DIR_CHAIN[chain][name] = true;
	});

	$C(Array.isArray(params.end) ? params.end : [params.end]).forEach((end) => {
		DIR_END[end] = DIR_END[end] || {};
		DIR_END[end][name] = true;
	});

	if (!(params.selfInclude = params.selfInclude !== false)) {
		params.block = true;
	}

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
		switch (params.placement) {
			case 'template':
				if (!struct.parent) {
					parser.error(`the directive "${dirName}" can be used only within a ${DIR_GROUPS_LIST['template'].join(', ')}`);
				}

				break;

			case 'global':
				if (struct.parent) {
					parser.error(`the directive "${dirName}" can be used only within the global space`);
				}

				break;

			default:
				if (params.placement && parser.hasParent(params.placement)) {
					parser.error(`the directive "${dirName}" can be used only within a "${params.placement}"`);
				}
		}

		if (params.notEmpty && !command) {
			return parser.error(`the directive "${dirName}" must have a body`);
		}

		if (struct.strong) {
			if (INSIDE_DIR[struct.name][dirName]) {
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
		constr.call(parser, command, commandLength, type, jsDoc);

		if (parser.structure.params['@from'] === undefined) {
			parser.structure.params['@from'] = from;
		}

		const
			newStruct = parser.structure;

		if (INSIDE_DIR[dirName]) {
			newStruct.strong = true;
			parser.chainSpace = true;
		}

		if (dirName === sourceName) {
			if (struct === newStruct) {
				if (!ignore && AFTER_DIR[struct.name] && !AFTER_DIR[struct.name][dirName]) {
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

					if (!ignore && prev && AFTER_DIR[prev.name] && !AFTER_DIR[prev.name][dirName]) {
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

			if (fsStack.length) {
				this.source =
					this.source.substring(0, this.i + 1) +
					this.replaceCData(fsStack.join('')) +
					this.source.substring(this.i + 1);

				fsStack.splice(0, fsStack.length);
			}
		}
	};
};

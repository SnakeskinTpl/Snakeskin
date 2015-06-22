/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from '../deps/collection';
import { Snakeskin } from '../core';
import { stack } from '../include';
import { SHORTS } from '../consts/literals';
import { isFunction } from '../helpers/types';
import { r } from '../helpers/string';
import { HAS_CONSOLE_LOG } from '../consts/hacks';
import {

	DIR_NAME_ALIASES,
	DIR_NAME_REPLACERS,

	SYS_DIRS,
	BLOCK_DIRS,
	TEXT_DIRS,
	DIR_GROUPS,

	DIR_PLACEMENT,
	DIR_PLACEMENT_PLAIN,
	DIR_BLACKLIST,
	DIR_BLACKLIST_PLAIN,

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

export const
	/**
	 * Transformer for a group list
	 *
	 * @param {Array} arr - the source list
	 * @return {string}
	 */
	q = (arr) => $C(arr).map((el) => `"${el}"`).join(', ');

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
 * Inits the specified placement
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
 *   generator: (?boolean|undefined),
 *   notEmpty: (?boolean|undefined),
 *   renderModeBlacklist: (Array|string|undefined),
 *   placement: (Array|string|undefined),
 *   group: (Array|string|undefined),
 *   blacklist: (Array|string|undefined),
 *   chain: (Array|string|undefined),
 *   end: (Array|string|undefined),
 *   inside: (Array|string|undefined),
 *   after: (Array|string|undefined),
 *   sys: (?boolean|undefined),
 *   text: (?boolean|undefined),
 *   block: (?boolean|undefined),
 *   selfInclude: (?boolean|undefined),
 *   replacers: (Object.<string, (string|function(string): string)>|undefined)
 * }} params - additional parameters:
 *
 *   *) [params.deferInit = false] - if is true, the directive won't be started automatically
 *   *) [params.alias = false] - if is true, then the directive is considered as an alias
 *        (only for private directives)
 *
 *   *) [params.generator = false] - if is true, the directive can be used only with generators
 *   *) [params.notEmpty = false] - if is true, then the directive can't be empty
 *   *) [params.renderModeBlacklist] - a render mode, which can't be used with the current directive
 *        or an array of names
 *
 *   *) [params.placement] - placement of the directive: a name/group of a parent directive or
 *        Snakeskin.placement ('global' or 'template')
 *
 *   *) [params.group] - a group name, which includes the current directive
 *        or an array of names
 *
 *   *) [params.blacklist] - a directive/group name, which can't be used with the current directive
 *        or an array of names
 *
 *   *) [params.chain] - a directive/group name, which is a master for the current directive
 *        or an array of names
 *
 *   *) [params.inside] - a directive/group name, which can be included in the current directive
 *        or an array of names
 *
 *   *) [params.after] - a directive/group name, which can be placed after the current directive
 *        or an array of names
 *
 *   *) [params.end] - a directive/group name, which must be closed using the current directive
 *        or an array of names
 *
 *   *) [params.sys = false] - if is true, then the directive is considered as a system type
 *   *) [params.text = false] - if is true, then the directive will be outputted as a plain text
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
 * @param {function(this:Parser, string, number, string, (boolean|number))=} opt_constr - constructor
 * @param {function(this:Parser, string, number, string, (boolean|number))=} opt_destr - destructor
 */
Snakeskin.addDirective = function (name, params, opt_constr, opt_destr) {
	const
		p = params || {};

	let
		_ = ([cache, val]) => ({cache, val});

	$C([
		_([BLOCK_DIRS, p.block]),
		_([SYS_DIRS, p.sys]),
		_([TEXT_DIRS, p.text])

	]).forEach(({cache, val}) => { cache[name] = Boolean(val); });

	$C([
		_([DIR_GROUPS, p.group]),
		_([DIR_CHAIN, p.chain]),
		_([DIR_INSIDE, p.inside]),
		_([DIR_AFTER, p.after]),
		_([DIR_END, p.end])

	]).forEach(({cache, val}) => {
		$C([].concat(val)).forEach((key) => {
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
					cache[key][name] = true;
				});
			}
		});
	});

	_ =
		([cache, plainCache, val]) => ({cache, plainCache, val});

	$C([
		_([DIR_PLACEMENT, DIR_PLACEMENT_PLAIN, p.placement]),
		_([DIR_BLACKLIST, DIR_BLACKLIST_PLAIN, p.blacklist])

	]).forEach(({cache, plainCache, val}) => {
		if (cache === DIR_PLACEMENT && new RegExp(`${r(alb)}?`).test(val)) {
			return;
		}

		cache[name] = $C([].concat(val)).reduce((map, el) =>
			(map[el] = [el], map), {});

		$C(cache).forEach((map, key) => {
			$C(map).forEach((el, key) => {
				if (key[0] === lb) {
					key = key.slice(1);
					if (DIR_GROUPS[key]) {
						map[key] = Object.keys(DIR_GROUPS[key]);
					}
				}
			});

			plainCache[key] = {};
			$C(map).forEach((el) => {
				$C(el).forEach((el) => {
					plainCache[key][el] = true;
				});
			});
		});
	});

	$C(p.replacers).forEach((el, key) => {
		if (key.length > 2) {
			throw new Error(`Invalid shorthand key "${key}" (key.length > 2)`);
		}

		if (DIR_NAME_REPLACERS[key] && HAS_CONSOLE_LOG) {
			console.log(`Warning: replacer "${key}" already exists`);
		}

		DIR_NAME_REPLACERS[key] = isFunction(el) ?
			el : (cmd) => cmd.replace(key, el) ;

		if (key[0] !== '/') {
			SHORTS[key] = true;
		}
	});

	const renderModeBlacklist =
		$C([].concat(p.renderModeBlacklist)).reduce((map, el) => (map[el] = true, map), {});

	if (p.alias) {
		DIR_NAME_ALIASES[name] = name.replace(/__(.*?)__/, '$1');
	}

	if (!(p.selfInclude = p.selfInclude !== false)) {
		p.block = true;
	}

	/** @this {Parser} */
	Snakeskin.Directives[name] = function (command, commandLength, type, jsDoc) {
		const
			sourceName = this.getDirName(name);

		let
			parser = this,
			dirName = sourceName;

		if (parser.ctx) {
			dirName = this.getDirName(parser.name) || dirName;
			parser = parser.ctx;
		}

		const
			ignore = DIR_GROUPS['ignore'][dirName],
			struct = parser.structure,
			parentDirName = this.getDirName(struct.name);

		parser.name = dirName;
		switch (p.placement) {
			case `${alb}template`:
				if (!struct.parent) {
					return parser.error(
						`the directive "${dirName}" can be used only within: ${q(parser.getGroupList('template'))}`
					);
				}

				break;

			case `${alb}global`:
				if (struct.parent) {
					return parser.error(`the directive "${dirName}" can be used only within the global space`);
				}

				break;

			default:
				if (p.placement && !parser.has(DIR_PLACEMENT_PLAIN[name])) {
					return parser.error(
						`the directive "${dirName}" can be used only within: ${q(Object.keys(DIR_PLACEMENT_PLAIN[name]))}`
					);
				}
		}

		if (p.notEmpty && !command) {
			return parser.error(`the directive "${dirName}" must have a body`);
		}

		if (p.renderModeBlacklist && renderModeBlacklist[parser.renderMode]) {
			return parser.error(`the directive "${this.name}" can't be used with the "${parser.renderMode}" render mode`);
		}

		if (p.generator && !parser.parentTplName && !parser.generator && !parser.proto && !parser.outerLink) {
			return parser.error(`the directive "${dirName}" can be used only with a generator`);
		}

		if (p.chain && (!DIR_CHAIN[parentDirName] || !DIR_CHAIN[parentDirName][dirName])) {
			const groups = $C([].concat(p.chain)).reduce((arr, el) =>
				arr.concat(el[0] === lb ? parser.getGroupList(el.slice(1)) : el), []);

			return parser.error(`the directive "${dirName}" can be used only with: ${q(groups)}`);
		}

		if (p.blacklist && parser.has(DIR_BLACKLIST_PLAIN[name])) {
			return parser.error(`the directive "${dirName}" can't be used with: ${q(Object.keys(DIR_BLACKLIST_PLAIN[name]))}`);
		}

		if (struct.strong) {
			if (DIR_INSIDE[parentDirName][dirName]) {
				parser.chainSpace = false;

			} else if (!ignore && sourceName === dirName && dirName !== 'end') {
				return parser.error(`the directive "${dirName}" can't be used within the "${parentDirName}"`);
			}
		}

		if (!p.selfInclude && parser.has(dirName)) {
			return parser.error(`the directive "${dirName}" can't be used within the "${dirName}"`);
		}

		if (p.text) {
			parser.text = true;
		}

		const
			from = parser.res.length;

		if (!p.deferInit && !p.chain) {
			if (p.block) {
				parser.startDir();

			} else {
				parser.startInlineDir();
			}
		}

		if (opt_constr) {
			opt_constr.call(parser, command, commandLength, type, jsDoc);
		}

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
				if (!ignore && DIR_AFTER[parentDirName] && !DIR_AFTER[parentDirName][dirName]) {
					return parser.error(`the directive "${dirName}" can't be used after the "${parentDirName}"`);
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
			res = params['@res'] ? params['@res'] : this.res;

		const
			from = params['@from'],
			to = res.length;

		if (from == null) {
			return;
		}

		const parent =
			this.structure.parent;

		if ((!parent || parent.name === 'root') && !this.getGroup('define')[name] && from !== to) {
			try {
				this.evalStr(res.slice(from, to));

			} catch (err) {
				return this.error(err.message);
			}

			if (stack.length) {
				this.source =
					this.source.slice(0, this.i + 1) +
					this.replaceCData(stack.join('')) +
					this.source.slice(this.i + 1);

				stack.splice(0, stack.length);
			}
		}
	};
};

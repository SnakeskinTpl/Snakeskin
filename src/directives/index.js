'use strict';

// jscs:disable safeContextKeyword

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Snakeskin from '../core';
import { stack } from '../helpers/include';
import { SHORTS } from '../consts/literals';
import { isFunction } from '../helpers/types';
import { r } from '../helpers/string';
import { HAS_CONSOLE_LOG } from '../consts/hacks';
import {

	$dirNameAliases,
	$dirNameShorthands,
	$consts,
	$logicDirs,
	$blockDirs,
	$textDirs,
	$dirGroups,
	$dirPlacement,
	$dirPlacementPlain,
	$dirAncestorsBlacklist,
	$dirAncestorsBlacklistPlain,
	$dirAncestorsWhitelist,
	$dirAncestorsWhitelistPlain,
	$dirParents,
	$dirChain,
	$dirEnd,
	$dirTrim

} from '../consts/cache';

// FIXME https://github.com/jscs-dev/node-jscs/issues/2017
// jscs:disable jsDoc

export const
	/**
	 * Transformer for a group list
	 *
	 * @param {Array} arr - source list
	 * @return {string}
	 */
	q = (arr) => $C(arr).map((el) => `"${el}"`).join(', ');

// jscs:enable jsDoc

const
	gPrfx = '@';

/**
 * Initialises the specified group
 *
 * @param {string} name - group name
 * @return {string}
 */
Snakeskin.group = function (name) {
	return gPrfx + name;
};

/**
 * Adds a new directive to the SS namespace
 *
 * @param {string} name - directive name
 * @param {{
 *   deferInit: (?boolean|undefined),
 *   generator: (?boolean|undefined),
 *   notEmpty: (?boolean|undefined),
 *   alias: (?boolean|undefined),
 *   group: (Array|string|undefined),
 *   renderModesBlacklist: (Array|string|undefined),
 *   renderModesWhitelist: (Array|string|undefined),
 *   placement: (Array|string|undefined),
 *   ancestorsBlacklist: (Array|string|undefined),
 *   ancestorsWhitelist: (Array|string|undefined),
 *   with: (Array|string|undefined),
 *   parents: (Array|string|undefined),
 *   endsWith: (Array|string|undefined),
 *   endFor: (Array|string|undefined),
 *   trim: ({left: boolean, right: boolean}|undefined),
 *   logic: (?boolean|undefined),
 *   text: (?boolean|undefined),
 *   block: (?boolean|undefined),
 *   selfInclude: (?boolean|undefined),
 *   shorthands: (Object.<string, (string|function(string): string)>|undefined)
 * }} params - additional parameters:
 *
 *   *) [params.deferInit = false] - if is true, the directive won't be started automatically
 *   *) [params.generator = false] - if is true, the directive can be used only with generators
 *   *) [params.notEmpty = false] - if is true, then the directive can't be empty
 *   *) [params.alias = false] - if is true, then the directive is considered as an alias
 *        (only for private directives)
 *
 *   *) [params.group] - group name, which includes the current directive
 *        or an array of names
 *
 *   *) [params.renderModesBlacklist] - rendering mode, which can't be used with the current directive
 *        or an array of names
 *
 *   *) [params.renderModesWhitelist] - rendering mode, which can be used with the current directive
 *        or an array of names
 *
 *   *) [params.placement] - placement of the directive: global or template
 *   *) [params.ancestorsBlacklist] - directive/group name, which can't be an ancestor for the current directive
 *        or an array of names
 *
 *   *) [params.ancestorsWhitelist] - directive/group name, which can be an ancestor for the current directive
 *        or an array of names
 *
 *   *) [params.with] - directive/group name, which is a master for the current directive
 *        or an array of names
 *
 *   *) [params.parents] - directive/group name, which can be a parent for the current directive
 *        or an array of names
 *
 *   *) [params.children] - directive/group name, which can be a child of the current directive
 *        or an array of names
 *
 *   *) [params.endsWith] - directive/group name, which can be placed after the current directive
 *        or an array of names
 *
 *   *) [params.endFor] - directive/group name, which must be closed using the current directive
 *        or an array of names
 *
 *   *) [params.trim] - trim for the directive content (Jade-Like mode)
 *        trim: {
 *          left: true,
 *          right: false
 *        }
 *
 *   *) [params.logic = false] - if is true, then the directive is considered as a system type
 *   *) [params.text = false] - if is true, then the directive will be outputted as a plain text
 *   *) [params.block = false] - if is true, then the directive is considered as a block type
 *   *) [params.selfInclude = true] - if is false, then the directive can't be placed inside an another directive
 *        of the same type
 *
 *   *) [params.shorthands] - shorthands for the directive
 *        shorthands: {
 *          // Can be no more than two symbols in the key
 *          '?': 'void '
 *        }
 *
 * @param {function(this:Parser, string, number, string, string, (boolean|number))=} opt_constr - constructor
 * @param {function(this:Parser, string, number, string, string, (boolean|number))=} opt_destruct - destructor
 */
Snakeskin.addDirective = function (name, params, opt_constr, opt_destruct) {
	const
		p = params || {},
		concat = (val) => val != null ? [].concat(val) : [];

	let
		_ = ([cache, val]) => ({cache, val});

	$C([

		_([$dirTrim, p.trim]),
		_([$blockDirs, p.block]),
		_([$logicDirs, p.logic]),
		_([$textDirs, p.text])

	]).forEach(({cache, val}) => {
		cache[name] = cache === $dirTrim ? val : Boolean(val);
	});

	$C([

		_([$dirGroups, p.group]),
		_([$dirChain, p.with]),
		_([$dirParents, p.parents]),
		_([$dirEnd, p.endFor])

	]).forEach(({cache, val}) => {
		$C(concat(val)).forEach((key) => {
			if (cache === $dirGroups && key[0] === gPrfx) {
				throw new Error(`Invalid group name "${key}" (group name can't begin with "${gPrfx}"`);
			}

			cache[key] = cache[key] || {};
			cache[key][name] = true;
		});
	});

	$C([$dirChain, $dirParents, $dirEnd]).forEach((cache) => {
		$C(cache).forEach((el, key) => {
			if (key[0] !== gPrfx) {
				return;
			}

			const
				link = cache[key];

			$C($dirGroups[key.slice(1)]).forEach((el, group) => {
				cache[group] = cache[group] || {};
				$C(link).forEach((el, dir) => cache[group][dir] = true);
			});
		});
	});

	$C([

		_([$dirParents, p.children]),
		_([$dirEnd, p.endsWith])

	]).forEach(({cache, val}) => {
		$C(concat(val)).forEach((key) => {
			cache[name] = cache[name] || {};
			cache[name][key] = true;
		});
	});

	$C([$dirParents, $dirEnd]).forEach((cache) => {
		$C(cache).forEach((dir) => {
			$C(dir).forEach((el, key) => {
				if (key[0] !== gPrfx) {
					return;
				}

				$C($dirGroups[key.slice(1)]).forEach((val, key) => dir[key] = true);
			});
		});
	});

	_ =
		([cache, plainCache, val]) => ({cache, plainCache, val});

	$C([
		_([$dirPlacement, $dirPlacementPlain, p.placement]),
		_([$dirAncestorsBlacklist, $dirAncestorsBlacklistPlain, p.ancestorsBlacklist]),
		_([$dirAncestorsWhitelist, $dirAncestorsWhitelistPlain, p.ancestorsWhitelist])

	]).forEach(({cache, plainCache, val}) => {
		cache[name] = $C(concat(val)).reduce((map, el) =>
			(map[el] = [el], map), {});

		$C(cache).forEach((map, key) => {
			$C(map).forEach((el, key) => {
				if (key[0] !== gPrfx) {
					return;
				}

				key = key.slice(1);
				if ($dirGroups[key]) {
					map[key] = Object.keys($dirGroups[key]);
				}
			});

			plainCache[key] = {};
			$C(map).forEach((el) =>
				$C(el).forEach((el) =>
					plainCache[key][el] = true));
		});
	});

	$C(p.shorthands).forEach((el, key) => {
		if (key.length > 2) {
			throw new Error(`Invalid shorthand key "${key}" (key.length > 2)`);
		}

		if ($dirNameShorthands[key] && HAS_CONSOLE_LOG) {
			console.log(`Warning: replacer "${key}" already exists`);
		}

		$dirNameShorthands[key] = isFunction(el) ?
			el : (cmd) => cmd.replace(key, el);

		if (key[0] !== '/') {
			SHORTS[key] = true;
		}
	});

	if (p.alias) {
		$dirNameAliases[name] = name.replace(/__(.*?)__/, '$1');
	}

	if (!(p.selfInclude = p.selfInclude !== false)) {
		p.block = true;
	}

	/** @this {Parser} */
	Snakeskin.Directives[name] = function (command, commandLength, type, raw, jsDoc) {
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
			{structure} = parser;

		const
			ignore = $dirGroups['ignore'][dirName],
			prevDirName = this.getDirName(structure.name);

		parser.name = dirName;
		switch (p.placement) {
			case 'template':
				if (!structure.parent) {
					return parser.error(
						`the directive "${dirName}" can be used only within directives ${q(parser.getGroupList('template'))}`
					);
				}

				break;

			case 'global':
				if (structure.parent) {
					return parser.error(`the directive "${dirName}" can be used only within the global space`);
				}

				break;
		}

		if (p.notEmpty && !command) {
			return parser.error(`the directive "${dirName}" must have a body`);
		}

		if (p.generator && !parser.parentTplName && !parser.generator && !parser.outerLink) {
			return parser.error(`the directive "${dirName}" can be used only within a generator template`);
		}

		const
			rmBlacklistList = concat(p.renderModesBlacklist),
			rmBlacklist = $C(rmBlacklistList).reduce((map, el) => (map[el] = true, map), {});

		if (p.renderModesBlacklist && rmBlacklist[parser.renderMode]) {
			return parser.error(`the directive "${dirName}" can't be used with directives ${q(rmBlacklist)} rendering modes`);
		}

		const
			rmWhitelistList = concat(p.renderModesWhitelist),
			rmWhitelist = $C(rmWhitelistList).reduce((map, el) => (map[el] = true, map), {});

		if (p.renderModesWhitelist && !rmWhitelist[parser.renderMode]) {
			return parser.error(
				`the directive "${dirName}" can be used only with directives ${q(rmWhitelistList)} rendering modes`
			);
		}

		if (p.with && (!$dirChain[prevDirName] || !$dirChain[prevDirName][dirName])) {
			const groups = $C([].concat(p.with)).reduce((arr, el) =>
				arr.concat(el[0] === gPrfx ? parser.getGroupList(el.slice(1)) : el), []);

			return parser.error(`the directive "${dirName}" can be used only with directives ${q(groups)}`);
		}

		if (p.ancestorsBlacklist && parser.has($dirAncestorsBlacklistPlain[name])) {
			return parser.error(
				`the directive "${dirName}" can't be used within directives ${
					q(Object.keys($dirAncestorsBlacklistPlain[name]))
				}`
			);
		}

		if (p.ancestorsWhitelist && !parser.has($dirAncestorsWhitelistPlain[name])) {
			return parser.error(
				`the directive "${dirName}" can be used only within directives ${
					q(Object.keys($dirAncestorsWhitelistPlain[name]))
				}`
			);
		}

		if (structure.strong) {
			if ($dirParents[prevDirName][dirName]) {
				parser.strongSpace.push(parser.strongSpace[parser.strongSpace.length - 2]);

			} else if (!ignore && sourceName === dirName && dirName !== 'end') {
				return parser.error(`the directive "${dirName}" can't be used within the "${prevDirName}"`);
			}
		}

		if (!p.selfInclude && parser.has(dirName)) {
			return parser.error(`the directive "${dirName}" can't be used within the "${dirName}"`);
		}

		if (p.text) {
			parser.text = true;
		}

		const
			from = parser.result.length;

		if (!p.deferInit && !p.with) {
			if (p.block) {
				parser.startDir();

			} else {
				parser.startInlineDir();
			}
		}

		if (opt_constr) {
			opt_constr.call(parser, command, commandLength, type, raw, jsDoc);
		}

		if (parser.structure.params['@from'] === undefined) {
			parser.structure.params['@from'] = from;
		}

		const
			newStruct = parser.structure;

		if ($dirParents[dirName]) {
			newStruct.strong = true;
			parser.strongSpace.push(true);
		}

		if (dirName === sourceName) {
			if (structure === newStruct) {
				if (
					!ignore &&
					(!$dirChain[prevDirName] || !$dirChain[prevDirName][dirName]) &&
					$dirEnd[prevDirName] && !$dirEnd[prevDirName][dirName]

				) {
					return parser.error(`the directive "${dirName}" can't be used after the "${prevDirName}"`);
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

					if (
						!ignore && prev &&
						(!$dirChain[prev.name] || !$dirChain[prev.name][dirName]) &&
						$dirEnd[prev.name] && !$dirEnd[prev.name][dirName]

					) {
						return parser.error(`the directive "${dirName}" can't be used after the "${prev.name}"`);
					}
				}
			}
		}

		parser
			.applyQueue();

		if (parser.inline === true) {
			baseEnd.call(parser);

			if (opt_destruct) {
				opt_destruct.call(parser, command, commandLength, type, raw, jsDoc);
			}

			parser.inline = null;
			parser.structure = parser.structure.parent;

			if (parser.blockStructure && parser.blockStructure.name === 'const') {
				parser.blockStructure = parser.blockStructure.parent;
			}
		}
	};

	Snakeskin.Directives[`${name}End`] = opt_destruct;

	/** @this {Parser} */
	const baseEnd = Snakeskin.Directives[`${name}BaseEnd`] = function () {
		const
			{structure, structure: {params}} = this;

		if (params['@scope']) {
			this.scope.pop();
		}

		if ($dirParents[structure.name] || $dirParents[structure.parent.name]) {
			this.strongSpace.pop();
		}

		$C(params['@consts']).forEach((el, key) => {
			$consts[this.tplName][key] = el;
		});

		const
			res = params['@res'] ? params['@res'] : this.result;

		const
			from = params['@from'],
			to = res.length;

		if (from == null) {
			return;
		}

		const
			{parent} = this.structure;

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

'use strict';

// jscs:disable safeContextKeyword

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { stack } from '../helpers/include';
import { isFunction } from '../helpers/types';
import { any } from '../helpers/gcc';
import { SHORTS } from '../consts/literals';
import { HAS_CONSOLE_LOG } from '../consts/hacks';
import {

	$dirInterpolation,
	$dirNameAliases,
	$dirNameShorthands,
	$consts,
	$logicDirs,
	$blockDirs,
	$textDirs,
	$dirGroups,
	$dirParents,
	$dirChain,
	$dirEnd,
	$dirTrim

} from '../consts/cache';

// FIXME https://github.com/jscs-dev/node-jscs/issues/2017
// jscs:disable jsDoc

/**
 * Transformer for a group list
 *
 * @param {Array} arr - source list
 * @return {string}
 */
export const q = (arr) => {
	const
		tmp = [];

	for (let i = 0; i < arr.length; i++) {
		tmp.push(`"${arr[i]}"`);
	}

	return tmp.join(', ');
};

// jscs:enable jsDoc

export const
	GROUP = '@';

export let
	groupCache = {};

/**
 * Initialises the specified group
 *
 * @param {string} name - group name
 * @return {string}
 */
Snakeskin.group = function (name) {
	return GROUP + name;
};

const
	dirPlacement = {},
	dirPlacementPlain = {},
	dirAncestorsBlacklist = {},
	dirAncestorsBlacklistPlain = {},
	dirAncestorsWhitelist = {},
	dirAncestorsWhitelistPlain = {};

/**
 * Adds a new directive to the SS namespace
 *
 * @param {string} name - directive name
 * @param {$$SnakeskinAddDirectiveParams} params - additional parameters:
 *
 *   *) [params.deferInit = false] - if is true, the directive won't be started automatically
 *   *) [params.async = false] - if is true, the directive can be used only with asyncs
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
 *   *) [params.interpolation = false] - if is true, then the directive will be support interpolation
 *   *) [params.selfThis = false] - if is true, then inside the directive block all calls of this won't
 *        be replaced to __THIS__
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
	groupCache = {};

	const
		p = Object.assign({}, params),
		concat = (val) => val != null ? [].concat(val) : [];

	let
		_ = ([cache, val]) => ({cache, val});

	[

		_([$dirTrim, p.trim]),
		_([$blockDirs, p.block]),
		_([$logicDirs, p.logic]),
		_([$textDirs, p.text]),
		_([$dirInterpolation, p.interpolation])

	].forEach(({cache, val}) => {
		if (cache === $dirTrim) {
			let res;
			switch (val) {
				case true:
					res = {
						left: true,
						right: true
					};

					break;

				case false:
					res = {
						left: false,
						right: false
					};

					break;
			}

			cache[name] = res;

		} else {
			cache[name] = Boolean(val);
		}
	});

	[

		_([$dirGroups, p.group]),
		_([$dirChain, p.with]),
		_([$dirParents, p.parents]),
		_([$dirEnd, p.endFor])

	].forEach(({cache, val}) => {
		Snakeskin.forEach(concat(val), (key) => {
			if (cache === $dirGroups && key[0] === GROUP) {
				throw new Error(`Invalid group name "${key}" (group name can't begin with "${GROUP}"`);
			}

			cache[key] = cache[key] || {};
			cache[key][name] = true;
		});
	});

	[$dirChain, $dirParents, $dirEnd].forEach((cache) => {
		Snakeskin.forEach(cache, (el, key) => {
			if (key[0] !== GROUP) {
				return;
			}

			const
				link = cache[key];

			Snakeskin.forEach($dirGroups[key.slice(1)], (el, group) => {
				cache[group] = cache[group] || {};
				Snakeskin.forEach(link, (el, dir) => cache[group][dir] = true);
			});
		});
	});

	[

		_([$dirParents, p.children]),
		_([$dirEnd, p.endsWith])

	].forEach(({cache, val}) => {
		concat(val).forEach((key) => {
			cache[name] = cache[name] || {};
			cache[name][key] = true;
		});
	});

	[$dirParents, $dirEnd].forEach((cache) => {
		Snakeskin.forEach(cache, (dir) => {
			Snakeskin.forEach(dir, (el, key) => {
				if (key[0] !== GROUP) {
					return;
				}

				Snakeskin.forEach($dirGroups[key.slice(1)], (val, key) => dir[key] = true);
			});
		});
	});

	_ =
		([cache, plainCache, val]) => ({cache, plainCache, val});

	[

		_([dirPlacement, dirPlacementPlain, p.placement]),
		_([dirAncestorsBlacklist, dirAncestorsBlacklistPlain, p.ancestorsBlacklist]),
		_([dirAncestorsWhitelist, dirAncestorsWhitelistPlain, p.ancestorsWhitelist])

	].forEach(({cache, plainCache, val}) => {
		cache[name] =
			concat(val).reduce((map, el) => (map[el] = [el], map), {});

		Snakeskin.forEach(cache, (map, key) => {
			Snakeskin.forEach(map, (el, key) => {
				if (key[0] !== GROUP) {
					return;
				}

				key = key.slice(1);
				if ($dirGroups[key]) {
					map[key] = Object.keys($dirGroups[key]);
				}
			});

			plainCache[key] = {};
			Snakeskin.forEach(map, (el) =>
				Snakeskin.forEach(el, (el) => {
					if (el[0] !== GROUP) {
						plainCache[key][el] = true;
					}
				})
			);
		});
	});

	Snakeskin.forEach(p.shorthands, (el, key) => {
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
			{structure} = this;

		const
			dirName = this.name = this.getDirName(name),
			prevDirName = structure.name,
			ignore = this.getGroup('ignore')[dirName];

		switch (p.placement) {
			case 'template':
				if (!this.tplName) {
					return this.error(
						`the directive "${dirName}" can be used only within directives ${q(this.getGroupList('template'))}`
					);
				}

				break;

			case 'global':
				if (structure.parent) {
					return this.error(`the directive "${dirName}" can be used only within the global space`);
				}

				break;
		}

		if (p.notEmpty && !command) {
			return this.error(`the directive "${dirName}" must have a body`);
		}

		if (p.async && !this.async && !this.outerLink) {
			return this.error(`the directive "${dirName}" can be used only within an async template`);
		}

		if (p.generator && !this.generator && !this.outerLink) {
			return this.error(`the directive "${dirName}" can be used only within a generator template`);
		}

		const
			rmBlacklistList = concat(p.renderModesBlacklist),
			rmBlacklist = {};

		for (let i = 0; i < rmBlacklistList.length; i++) {
			rmBlacklist[rmBlacklistList[i]] = true;
		}

		if (p.renderModesBlacklist && rmBlacklist[this.renderMode]) {
			return this.error(
				`the directive "${dirName}" can't be used with directives ${q(rmBlacklistList)} rendering modes`
			);
		}

		const
			rmWhitelistList = concat(p.renderModesWhitelist),
			rmWhitelist = {};

		for (let i = 0; i < rmWhitelistList.length; i++) {
			rmWhitelist[rmWhitelistList[i]] = true;
		}

		if (p.renderModesWhitelist && !rmWhitelist[this.renderMode]) {
			return this.error(
				`the directive "${dirName}" can be used only with directives ${q(rmWhitelistList)} rendering modes`
			);
		}

		const
			prevChain = $dirChain[prevDirName] && $dirChain[prevDirName][dirName];

		if (p.with && !prevChain) {
			const
				groups = [].concat(p.with);

			let arr = [];
			for (let i = 0; i < groups.length; i++) {
				const el = groups[i];
				arr = arr.concat(el[0] === GROUP ? this.getGroupList(el.slice(1)) : el);
			}

			return this.error(`the directive "${dirName}" can be used only with directives ${q(arr)}`);
		}

		if (p.ancestorsBlacklist && this.has(dirAncestorsBlacklistPlain[name])) {
			return this.error(
				`the directive "${dirName}" can't be used within directives ${
					q(Object.keys(dirAncestorsBlacklistPlain[name]))
				}`
			);
		}

		if (p.ancestorsWhitelist && !this.has(dirAncestorsWhitelistPlain[name])) {
			return this.error(
				`the directive "${dirName}" can be used only within directives ${
					q(Object.keys(dirAncestorsWhitelistPlain[name]))
				}`
			);
		}

		if (!p.selfInclude && this.has(dirName)) {
			return this.error(`the directive "${dirName}" can't be used within the "${dirName}"`);
		}

		if (this.decorators.length && !ignore && !this.getGroup('rootTemplate', 'decorator')[dirName]) {
			return this.error(`decorators can't be used after ${dirName}`);
		}

		if (p.text) {
			this.text = true;
		}

		if (p.filters) {
			this.appendDefaultFilters(p.filters);
		}

		const
			from = this.result.length;

		if (!p.deferInit && !p.with) {
			if (p.block) {
				this.startDir();

			} else {
				this.startInlineDir();
			}
		}

		if (p.selfThis) {
			this.selfThis.push(true);
		}

		if (opt_constr) {
			opt_constr.call(this, command, commandLength, type, raw, jsDoc);
		}

		if (structure.chain && !prevChain && !ignore && !this.isLogic()) {
			const
				parent = any(this.getNonLogicParent()).name;

			if ($dirParents[parent] && $dirParents[parent][dirName]) {
				this.strongSpace.push(this.strongSpace[this.strongSpace.length - 2]);

			} else if (dirName !== 'end') {
				return this.error(`the directive "${dirName}" can't be used within the "${parent}"`);
			}
		}

		const
			newStructure = this.structure;

		if (newStructure.params['@from'] === undefined) {
			newStructure.params['@from'] = from;
		}

		if ($dirParents[dirName]) {
			newStructure.chain = true;
			this.strongSpace.push(true);
		}

		if (structure === newStructure) {
			if (
				!ignore &&
				(!$dirChain[prevDirName] || !$dirChain[prevDirName][dirName]) &&
				$dirEnd[prevDirName] && !$dirEnd[prevDirName][dirName]

			) {
				return this.error(`the directive "${dirName}" can't be used after the "${prevDirName}"`);
			}

		} else {
			const
				siblings = dirName === 'end' ?
					newStructure.children : newStructure.parent && newStructure.parent.children;

			if (siblings) {
				let
					j = 1,
					prev;

				while ((prev = siblings[siblings.length - j]) && (prev.name === 'text' || prev === newStructure)) {
					j++;
				}

				if (
					!ignore && prev &&
					(!$dirChain[prev.name] || !$dirChain[prev.name][dirName]) &&
					$dirEnd[prev.name] && !$dirEnd[prev.name][dirName]

				) {
					return this.error(`the directive "${dirName}" can't be used after the "${prev.name}"`);
				}
			}
		}

		this
			.applyQueue();

		if (this.inline[this.inline.length - 1] === true) {
			baseEnd.call(this);

			if (opt_destruct) {
				opt_destruct.call(this, command, commandLength, type, raw, jsDoc);
			}

			this.endDir();
		}
	};

	Snakeskin.Directives[`${name}End`] = opt_destruct;

	/** @this {Parser} */
	const baseEnd = Snakeskin.Directives[`${name}BaseEnd`] = function () {
		const
			{structure, structure: {params, parent}} = this;

		if (params['@scope']) {
			this.scope.pop();
		}

		const
			chainParent = $dirParents[any(this.getNonLogicParent()).name];

		if ($dirParents[structure.name] || chainParent && chainParent[structure.name]) {
			this.strongSpace.pop();
		}

		if (p.filters) {
			this.filters.pop();
		}

		if (p.selfThis) {
			this.selfThis.pop();
		}

		const
			consts = params['@consts'];

		if (consts) {
			const
				arr = Object.keys(consts);

			for (let i = 0; i < arr.length; i++) {
				$consts[this.tplName][arr[i]] = consts[arr[i]];
			}
		}

		const
			res = params['@result'] != null ? params['@result'] : this.result;

		const
			from = params['@from'],
			to = res.length;

		if (from == null) {
			return;
		}

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

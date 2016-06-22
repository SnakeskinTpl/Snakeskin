'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Parser from './constructor';
import { $extMap, $cache, $templates, $router, $routerPositions } from '../consts/cache';
import { LEFT_BOUND as lb, RIGHT_BOUND as rb, ADV_LEFT_BOUND as alb } from '../consts/literals';

/**
 * Returns the full body of the specified template
 * (with inheritance)
 *
 * @param {string} name - template name
 * @return {string}
 */
Parser.prototype.getTplFullBody = function (name) {
	const
		parentTpl = $extMap[name],
		constLength = 1;

	const
		isDecl = this.getGroupList('inherit'),
		is = {};

	for (let i = 0; i < isDecl.length; i++) {
		is[i * 2] = isDecl[i];
		is[i * 2 + 1] = `${isDecl[i]}_add`;
	}

	let res = $cache[parentTpl];
	if (!this.tolerateWhitespaces) {
		res += `${alb + lb}__&-__${rb}`;
	}

	const
		length = isDecl.length * 2,
		tb = $templates[name],
		advDiff = [];

	let
		from = 0,
		blockDiff,
		newFrom,
		prev,
		el,
		k;

	const
		sort = (a, b) => a.val - b.val;

	for (let i = 0; i < length; i++) {
		const
			type = is[i];

		if ($router[type]) {
			el = $router[type][name];
			prev = $router[type][parentTpl];
			k = `${type}_`;

			if ($routerPositions[type]) {
				from = $routerPositions[type][parentTpl];
				newFrom = null;
			}
		}

		for (const key in el) {
			if (!el.hasOwnProperty(key)) {
				break;
			}

			const
				current = el[key],
				parent = !tb[k + key].drop && prev[key];

			let
				adv = 0,
				block = $cache[name].slice(current.from, current.to);

			if (parent) {
				if (parent.output != null && current.output == null && i % 2 === 0) {
					current.output = parent.output;

					if (type === 'const') {
						block += current.output;

					} else {
						this.getBlockOutput(type, name)[key] = current.output;
					}
				}

				blockDiff = block.length - $cache[parentTpl].slice(parent.from, parent.to).length;
			}

			const diff = parent ? parent.from : from;
			advDiff.sort(sort);

			for (let i = 0; i < advDiff.length; i++) {
				if (advDiff[i].val <= diff) {
					adv += advDiff[i].adv;

				} else {
					break;
				}
			}

			if (parent && i % 2 === 0) {
				if (type !== 'block' && (type !== 'const' || !current.block)) {
					newFrom = parent.from + adv + block.length;
					from += blockDiff;

					if (newFrom > from) {
						from = newFrom + constLength;
					}
				}

				res =
					res.slice(0, parent.from + adv) +
					block +
					res.slice(parent.to + adv);

				advDiff.push({
					adv: blockDiff,
					val: parent.from
				});

			} else if (!parent) {
				switch (type) {
					case 'block_add':
						if (!current.external) {
							res += block;
							break;
						}

					case 'block_add':
					case 'const_add':
						if (newFrom === null) {
							newFrom = from;
							from += adv;
						}

						block = type === 'const_add' ?
							`${current.needPrfx ? alb : ''}${lb}${block}${rb}` : block;

						res = res.slice(0, from) +
							block +
							res.slice(from);

						advDiff.push({
							adv: block.length,
							val: newFrom
						});

						from = from + block.length;
						break;
				}
			}
		}
	}

	return res;
};

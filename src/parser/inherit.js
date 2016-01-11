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
import { $extMap, $cache, $templates, $router, $routerPositions } from '../consts/cache';
import { LEFT_BLOCK as lb, RIGHT_BLOCK as rb, ADV_LEFT_BLOCK as alb } from '../consts/literals';

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

	$C(isDecl).forEach((el, i) => {
		is[i * 2] = el;
		is[i * 2 + 1] = `${el}_add`;
	});

	let res = $cache[parentTpl];
	if (!this.tolerateWhitespaces) {
		res += `${alb}${lb}__&-__${rb}`;
	}

	let
		length = isDecl.length * 2,
		from = 0,
		advDiff = [];

	let
		tb = $templates[name],
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

		$C(el).forEach((val, key) => {
			const
				current = el[key],
				parent = !tb[k + key].drop && prev[key];

			let
				adv = 0,
				block = $cache[name].slice(current.from, current.to);

			if (parent) {
				if (parent.output != null && current.output == null && (i % 2 === 0)) {
					current.output = parent.output;

					if (type === 'const') {
						block += current.output;

					} else {
						this.getBlockOutput(type, name)[key] = current.output;
					}
				}

				blockDiff = block.length - $cache[parentTpl].slice(parent.from, parent.to).length;
			}

			const
				diff = parent ? parent.from : from;

			$C(advDiff.sort(sort)).forEach((el) => {
				if (el.val <= diff) {
					adv += el.adv;

				} else {
					return false;
				}
			});

			if (parent && (i % 2 === 0)) {
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
						res += block;
						break;

					case 'const_add':
						if (newFrom === null) {
							newFrom = from;
							from += adv;
						}

						block =
							type === `${current.needPrfx ? alb : ''}${lb}${block}${rb}`;

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
		});
	}

	return res;
};

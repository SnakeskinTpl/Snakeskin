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
import {

	EXT_MAP,
	CACHE,
	TEMPLATES,
	ROUTER,
	ROUTER_POSITIONS

} from '../consts/cache';

import {

	LEFT_BLOCK as lb,
	RIGHT_BLOCK as rb,
	ADV_LEFT_BLOCK as alb

} from '../consts/literals';

const
	sort = (a, b) => a.val - b.val;

/**
 * Returns the full body of a template
 * (with inheritance)
 *
 * @param {string} tplName - template name
 * @return {string}
 */
Parser.prototype.getTplFullBody = function (tplName) {
	const
		parentTpl = EXT_MAP[tplName],
		protoLength = 'proto'.length,
		constLength = 1;

	const
		isDecl = $C(this.getGroup('inherit')).get(),
		is = {};

	$C(isDecl).forEach((el, i) => {
		is[i * 2] = el;
		is[i * 2 + 1] = `${el}_add`;
	});

	let
		res = CACHE[parentTpl];

	if (!this.tolerateWhitespace) {
		res += `${alb}${lb}__&-__${rb}`;
	}

	let
		length = isDecl.length * 2,
		from = 0,
		advDiff = [];

	let
		tb = TEMPLATES[tplName],
		blockDiff,
		newFrom,
		prev,
		el,
		k;

	for (let i = 0; i < length; i++) {
		const
			type = is[i];

		if (ROUTER[type]) {
			k = `${type}_`;

			el = ROUTER[type][tplName];
			prev = ROUTER[type][parentTpl];

			if (ROUTER_POSITIONS[type]) {
				from = ROUTER_POSITIONS[type][parentTpl];
				newFrom = null;
			}
		}

		$C(el).forEach((val, key) => {
			const
				current = el[key],
				parent = !tb[k + key].drop && prev[key];

			let
				adv = 0,
				block = CACHE[tplName].slice(current.from, current.to);

			if (parent) {
				if (parent.output != null && current.output == null && (i % 2 === 0)) {
					current.output = parent.output;

					if (type === 'const') {
						block += current.output;

					} else {
						this.getBlockOutput(type, tplName)[key] = current.output;
					}
				}

				blockDiff = block.length - CACHE[parentTpl].slice(parent.from, parent.to).length;
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
						from = newFrom + (type === 'proto' ? protoLength : constLength);
					}
				}

				res =
					res.slice(0, parent.from + adv) +
					block +
					res.slice(parent.to + adv);

				advDiff.push({
					val: parent.from,
					adv: blockDiff
				});

			} else if (!parent) {
				switch (type) {
					case 'block_add':
						res += block;
						break;

					case 'const_add':
					case 'proto_add':
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
							val: newFrom,
							adv: block.length
						});

						from = from + block.length;
						break;
				}
			}
		});
	}

	return res;
};

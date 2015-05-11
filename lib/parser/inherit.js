/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * Returns the full body of a template
 * (with inheritance)
 *
 * @param {string} tplName - the template name
 * @return {string}
 */
DirObj.prototype.getFullBody = function (tplName) {
	const
		protoLength = 'proto'.length,
		constLength = 1;

	const
		isDecl = [];

	forIn(this.getGroup('inherit'), (el, key) => {
		isDecl.push(key);
	});

	const
		length = isDecl.length * 2,
		is = {};

	for (let i = -1, j = 0; ++i < isDecl.length;) {
		is[i + j] = isDecl[i];
		j++;
		is[i + j] = `${isDecl[i]}_add`;
	}

	const
		parentTpl = extMap[tplName];

	let
		res = cache[parentTpl];

	const
		alb = ADV_LEFT_BLOCK,
		lb = LEFT_BLOCK,
		rb = RIGHT_BLOCK;

	if (!this.tolerateWhitespace) {
		res += `${alb}${lb}__&-__${rb}`;
	}

	let
		from = 0,
		advDiff = [];

	const sornFn =
		(a, b) => a.val - b.val;

	let
		tb = table[tplName],
		k;

	let
		el,
		prev;

	let
		newFrom,
		blockDiff;

	for (let i = -1; ++i < length;) {
		const type = is[i];

		if (routerCache[type]) {
			k = `${type}_`;

			el = routerCache[type][tplName];
			prev = routerCache[type][parentTpl];

			if (routerFromCache[type]) {
				from = routerFromCache[type][parentTpl];
				newFrom = null;
			}
		}

		for (let key in el) {
			if (!el.hasOwnProperty(key)) {
				continue;
			}

			// The shift relative
			// position of the parent element
			let adv = 0;

			const
				current = el[key],
				parent = !tb[k + key].drop && prev[key];

			let block = cache[tplName]
				.substring(current.from, current.to);

			// The difference between the child and the parent elements
			if (parent) {
				if (parent.output != null && current.output == null && (i % 2 === 0)) {
					current.output = parent.output;

					if (type === 'const') {
						block += current.output;

					} else {
						this.getBlockOutput(type, tplName)[key] = current.output;
					}
				}

				blockDiff = block.length -
					cache[parentTpl].substring(parent.from, parent.to).length;
			}

			const
				diff = parent ?
					parent.from : from;

			advDiff.sort(sornFn);

			for (let j = -1; ++j < advDiff.length;) {
				if (advDiff[j].val <= diff) {
					adv += advDiff[j].adv;

				} else {
					break;
				}
			}

			// Replace
			if (parent && (i % 2 === 0)) {
				if (type !== 'block' && (type !== 'const' || !current.block)) {
					newFrom = parent.from + adv + block.length;
					from += blockDiff;

					if (newFrom > from) {
						from = newFrom + (type === 'proto' ? protoLength : constLength);
					}
				}

				res = res.substring(0, parent.from + adv) +
					block +
					res.substring(parent.to + adv);

				advDiff.push({
					val: parent.from,
					adv: blockDiff
				});

			// Add
			} else if (!parent) {
				if (type === 'block_add') {
					res += block;

				} else if (type === 'const_add' || type === 'proto_add') {

					// If the child template hasn't overloads,
					// But adding a new
					if (newFrom === null) {
						newFrom = from;
						from += adv;
					}

					block = type === 'const_add' ?
						`${current.needPrfx ? alb : ''}${lb}${block}${rb}` : block;

					res = res.substring(0, from) +
						block +
						res.substring(from);

					advDiff.push({
						val: newFrom,
						adv: block.length
					});

					from = from + block.length;
				}
			}
		}
	}

	return res;
};

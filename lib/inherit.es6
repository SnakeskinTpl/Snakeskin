/**
 * Вернуть полное тело заданного шаблона
 * при наследовании
 *
 * @param {string} tplName - название шаблона
 * @return {string}
 */
DirObj.prototype.getFullBody = function (tplName) {
	var protoLength = 'proto'.length,
		constLength = 1;

	var isDecl = [],
		inherit = this.getGroup('inherit');

	for (let key in inherit) {
		if (!inherit.hasOwnProperty(key)) {
			continue;
		}

		isDecl.push(key);
	}

	var length = isDecl.length * 2,
		is = {};

	for (let i = -1, j = 0; ++i < isDecl.length;) {
		is[i + j] = isDecl[i];
		j++;
		is[i + j] = `${isDecl[i]}_add`;
	}

	var parentTpl = extMap[tplName],
		res = cache[parentTpl];

	var from = 0,
		advDiff = [];

	var sornFn = (a, b) => a.val - b.val;
	var tb = table[tplName],
		k;

	var el,
		prev;

	var newFrom,
		blockDiff;

	for (let i = -1; ++i < length;) {
		let type = is[i];

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

			// Сдвиг относительно
			// родительской позиции элемента
			let adv = 0;

			let current = el[key],
				parent = !tb[k + key].drop && prev[key];

			let block = cache[tplName]
				.substring(current.from, current.to);

			// Разница между дочерним и родительским блоком
			if (parent) {
				blockDiff = block.length -
					cache[parentTpl].substring(parent.from, parent.to).length;
			}

			let diff = parent ?
				parent.from : from;

			advDiff.sort(sornFn);

			for (let j = -1; ++j < advDiff.length;) {
				if (advDiff[j].val <= diff) {
					adv += advDiff[j].adv;

				} else {
					break;
				}
			}

			// Переопределение
			if (parent && (i % 2 === 0)) {
				if (parent.output && !current.output) {
					current.output = parent.output;
					block += parent.output;
				}

				if (type !== 'block' && (type !== 'const' || !current.proto)) {
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

			// Добавление
			} else if (!parent) {
				if (type === 'block_add') {
					res += block;

				} else if (type === 'const_add' || type === 'proto_add') {

					// Случай, если в дочернем шаблоне нет перекрытий,
					// но есть добавления нового
					if (newFrom === null) {
						newFrom = from;
						from += adv;
					}

					block = type === 'const_add' ?
						`${(current.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK}${block + RIGHT_BLOCK}` : block;

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
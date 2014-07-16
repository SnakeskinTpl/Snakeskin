/**
 * Вернуть полное тело заданного шаблона
 * при наследовании
 *
 * @param {string} parentName - название родительского шаблона
 * @return {string}
 */
DirObj.prototype.getFullBody = function (parentName) {
	var protoLength = 'proto'.length,
		constLength = ''.length;

	var isDecl = ['block', 'const', 'proto'],
		length = isDecl.length * 2,
		is = {};

	for (let i = 0, j = 0; i < isDecl.length; i++) {
		is[i + j] = isDecl[i];
		j++;
		is[i + j] = `${isDecl[i]}_add`;
	}

	var parentTpl = extMap[parentName],
		res = cache[parentTpl];

	var from = 0,
		advDiff = [];

	var sornFn = (a, b) => a.val - b.val;
	var tb = table[parentName],
		k;

	var el,
		prev;

	var newFrom,
		blockDiff;

	for (let i = 0; i < length; i++) {
		let type = is[i];

		if (routerCache[type]) {
			k = `${type}_`;

			el = routerCache[type][parentName];
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

			let block = cache[parentName]
				.substring(current.from, current.to);

			// Разница между дочерним и родительским блоком
			if (parent) {
				blockDiff = block.length -
					cache[parentTpl].substring(parent.from, parent.to).length;
			}

			let diff = parent ?
				parent.from : from;

			advDiff.sort(sornFn);

			for (let j = 0; j < advDiff.length; j++) {
				if (advDiff[j].val < diff) {
					adv += advDiff[j].adv;

				} else {
					break;
				}
			}

			// Переопределение
			if (parent && (i % 2 === 0)) {
				if (i > 1) {
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
						`${current.needPrfx ? PRFX : ''}{${block}}` : block;

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
/**
 * Вернуть конечное тело заданного шаблона при наследовании
 *
 * @param {string} tplName - название шаблона
 * @return {string}
 */
DirObj.prototype.getExtStr = function (tplName) {
	var protoLength = 'proto'.length,
		constLength = ''.length;

	var isDecl = ['block', 'const', 'proto'],
		length = isDecl.length * 2,
		is = {};

	for (var i = 0, j = 0; i < isDecl.length; i++) {
		is[i + j] = isDecl[i];
		j++;
		is[i + j] = (("" + (isDecl[i])) + "_add");
	}

	var parentTpl = extMap[tplName],
		res = cache[parentTpl];

	var from = 0,
		advDiff = [];

	var sornFn = function(a, b)  {return a.val - b.val};
	var tb = table[tplName],
		k;

	var el,
		prev;

	var newFrom,
		blockDiff;

	for (var i$0 = 0; i$0 < length; i$0++) {
		var type = is[i$0];

		if (routerCache[type]) {
			k = (("" + type) + "_");

			el = routerCache[type][tplName];
			prev = routerCache[type][parentTpl];

			if (routerFromCache[type]) {
				from = routerFromCache[type][parentTpl];
				newFrom = null;
			}
		}

		for (var key = void 0 in el) {
			if (!el.hasOwnProperty(key)) {
				continue;
			}

			// Сдвиг относительно
			// родительской позиции элемента
			var adv = 0;

			var current = el[key],
				parent = !tb[k + key].drop && prev[key];

			var block = cache[tplName]
				.substring(current.from, current.to);

			// Разница между дочерним и родительским блоком
			if (parent) {
				blockDiff = block.length -
					cache[parentTpl].substring(parent.from, parent.to).length;
			}

			var diff = parent ?
				parent.from : from;

			advDiff.sort(sornFn);

			for (var j$0 = 0; j$0 < advDiff.length; j$0++) {
				if (advDiff[j$0].val < diff) {
					adv += advDiff[j$0].adv;

				} else {
					break;
				}
			}

			// Переопределение
			if (parent && (i$0 % 2 === 0)) {
				if (i$0 > 1) {
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
						(("" + (current.needPrfx ? PRFX : '')) + ("{" + block) + "}") : block;

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
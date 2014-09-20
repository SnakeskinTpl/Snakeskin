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

	for (var key in inherit) {
		if (!inherit.hasOwnProperty(key)) {
			continue;
		}

		isDecl.push(key);
	}

	var length = isDecl.length * 2,
		is = {};

	for (var i = -1, j = 0; ++i < isDecl.length;) {
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

	for (var i$0 = -1; ++i$0 < length;) {
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

		for (var key$0 = void 0 in el) {
			if (!el.hasOwnProperty(key$0)) {
				continue;
			}

			// Сдвиг относительно
			// родительской позиции элемента
			var adv = 0;

			var current = el[key$0],
				parent = !tb[k + key$0].drop && prev[key$0];

			var block = cache[tplName]
				.substring(current.from, current.to);

			// Разница между дочерним и родительским блоком
			if (parent) {
				if (parent.output != null && current.output == null && (i$0 % 2 === 0)) {
					current.output = parent.output;

					if (type === 'const') {
						block += current.output;

					} else {
						this.getBlockOutput(type, tplName)[key$0] = current.output;
					}
				}

				blockDiff = block.length -
					cache[parentTpl].substring(parent.from, parent.to).length;
			}

			var diff = parent ?
				parent.from : from;

			advDiff.sort(sornFn);

			for (var j$0 = -1; ++j$0 < advDiff.length;) {
				if (advDiff[j$0].val <= diff) {
					adv += advDiff[j$0].adv;

				} else {
					break;
				}
			}

			// Переопределение
			if (parent && (i$0 % 2 === 0)) {
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
						(("" + ((current.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK)) + ("" + block) + ("" + RIGHT_BLOCK) + "") : block;

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
/**
 * Вернуть конечное тело заданного шаблона при наследовании
 *
 * @param {string} tplName - название шаблона
 * @return {string}
 */
DirObj.prototype.getExtStr = function (tplName) {
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

	// Цикл производит перекрытие и добавление новых блоков
	// (новые блоки добавляются в конец шаблона, итерации 0 и 1),
	// а затем перекрытие и добавление новых переменных (итерации 2 и 3),
	// а затем перекрытие и добавление прототипов (итерации 4 и 5),
	// причём новые переменные и прототипы добавляются сразу за унаследованными
	for (let i = 0; i < 6; i++) {
		// Блоки дочернего и родительского шаблона
		if (i === 0) {
			k = 'block_';
			el = blockCache[tplName];
			prev = blockCache[parentTpl];

		// Переменные дочернего и родительского шаблона
		} else if (i === 2) {
			k = 'const_';
			el = constCache[tplName];
			prev = constCache[parentTpl];

			// Позиция конца декларации последней переменной родительского шаблона
			from = fromConstCache[parentTpl];
			newFrom = null;

		// Прототипы дочернего и родительского шаблона
		} else if (i === 4) {
			k = 'proto_';
			el = protoCache[tplName];
			prev = protoCache[parentTpl];

			// Позиция конца декларации последнего прототипа родительского шаблона
			from = fromProtoCache[parentTpl];
			newFrom = null;
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

			if (i === 4 && parent && current.argsDecl !== parent.argsDecl) {
				current.from -= current.length;
				parent.from -= parent.length;
			}

			let block = cache[tplName]
				.substring(current.from, current.to);

			// Разница между дочерним и родительским блоком
			if (parent) {
				blockDiff = block.length -
					cache[parentTpl].substring(parent.from, parent.to).length;
			}

			let diff = parent ? parent.from : from;
			advDiff.sort(sornFn);

			for (let j = 0; j < advDiff.length; j++) {
				if (advDiff[j].val < diff) {
					adv += advDiff[j].adv;

				} else {
					break;
				}
			}

			if (parent && (i % 2 === 0)) {
				if (i > 1) {
					newFrom = parent.from + adv + block.length;
					from += blockDiff;

					if (newFrom > from) {
						from = newFrom + (i === 4 ? 5 : 1);
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
				// Новые глобальные блоки всегда добавляются в конец шаблона,
				// а остальные элементы после последнего вызова
				if (i === 1) {
					res += block;

				// Переменные и прототипы
				} else if (i === 3 || i === 5) {
					// Случай, если в дочернем шаблоне нет перекрытий,
					// но есть добавления нового
					if (newFrom === null) {
						newFrom = from;
						from += adv;
					}

					block = i === 3 ?
						`${current.needPrfx ? PRFX : ''}{${block}}` : block;

					res = res.substring(0, from) + block + res.substring(from);

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
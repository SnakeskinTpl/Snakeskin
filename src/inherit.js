/*!
 * Наследование
 */

/**
 * Вернуть тело шаблона при наследовании
 *
 * @private
 * @param {string} tplName - название шаблона
 * @param {Object} info - дополнительная информация
 * @return {string}
 */
Snakeskin._getExtStr = function (tplName, info) {
	// Если указанный родитель не существует
	if (typeof cache[extMap[tplName]] === 'undefined') {
		error = new Error('The specified pattern ("' + extMap[tplName]+ '" for "' + tplName + '") for inheritance is not defined (' + this._genError(info) + ')!');
		error.name = 'Snakeskin Error';

		throw error;
	}

	var parentTpl = extMap[tplName],
		// Исходный текст шаблона равен родительскому
		res = cache[parentTpl],

		// Блоки дочернего и родительского шаблона
		el,
		prev,

		block,
		key,
		i = -1,

		// Позиция для вставки новой переменной
		// или нового блока прототипа
		newFrom,
		from = 0,

		advDiff = [],
		blockDiff,
		diff,
		adv;

	// Цикл производит перекрытие добавление новых блоков (новые блоки добавляются в конец шаблона)
	// (итерации 0 и 1), а затем
	// перекрытие и добавление новых переменных (итерации 2 и 3),
	// а затем перекрытие и добавление прототипов (4-5 итерации),
	// причём новые переменные и прототипы добавляются сразу за унаследованными
	while (++i < 6) {
		// Блоки дочернего и родительского шаблона
		if (i === 0) {
			el = blockCache[tplName];
			prev = blockCache[parentTpl];

		// Переменные дочернего и родительского шаблона
		} else if (i === 2) {
			el = varCache[tplName];
			prev = varCache[parentTpl];

			// Позиция конца декларации последней переменной родительского шаблона
			from = fromVarCache[parentTpl];
			newFrom = null;

		// Прототипы дочернего и родительского шаблона
		} else if (i === 4) {
			el = protoCache[tplName];
			prev = protoCache[parentTpl];

			// Позиция конца декларации последнего прототипа родительского шаблона
			from = fromProtoCache[parentTpl];
			newFrom = null;
		}

		for (key in el) {
			if (!el.hasOwnProperty(key)) { continue; }

			// Сдвиг относительно родительской позиции элемента
			adv = 0;
			// Текст добавляемой области
			block = cache[tplName].substring(el[key].from, el[key].to);

			// Разница между дочерним и родительским блоком
			if (prev[key]) {
				blockDiff = block.length - cache[parentTpl].substring(prev[key].from, prev[key].to).length;
			}

			// Вычисляем сдвиг
			diff = prev[key] ? prev[key].from : from;
			advDiff
				// Следим, чтобы стек сдвигов всегда был отсортирован по возрастанию
				.sort(function (a, b) {
					if (a.val > b.val) {
						return 1;
					}

					if (a.val === b.val) {
						return 0;
					}

					if (a.val < b.val) {
						return -1;
					}
				})
				.some(function (el) {
					if (el.val < diff) {
						adv += el.adv;
					} else {
						return true;
					}
				});

			if (prev[key] && (i % 2 === 0)) {
				// Новые глобальные блоки всегда добавляются в конец шаблона,
				// а остальные элементы после последнего вызова
				if (i > 1) {
					newFrom = prev[key].from + adv + block.length;
					from += blockDiff;

					if (newFrom > from) {
						// } >>
						from = newFrom + (i === 4 ? 5 : 1);
					}
				}

				// Перекрытие
				res = res.substring(0, prev[key].from + adv) + block + res.substring(prev[key].to + adv);

				// Добавляем сдвиг в стек
				advDiff.push({
					val: prev[key].from,
					adv: blockDiff
				});

			// Добавление
			} else if (!prev[key]) {
				// Блоки
				if (i === 1) {
					res += '{' + key + '}' + block + '{end}';

				// Переменные и прототипы
				} else if (i === 3 || i === 5) {
					// Случай, если в дочернем шаблоне нет перекрытий,
					// но есть добавления нового
					if (newFrom === null) {
						newFrom = from;
						from += adv;
					}

					block = i === 3 ? ('{' + block + '}') : ('{' + key + '}' + block + '{end}');
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
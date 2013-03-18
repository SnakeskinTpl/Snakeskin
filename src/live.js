/*!
 * Различные методы для работы скомпилированных шаблонов
 */

/**
 * Итератор цикла
 * (return false прерывает выполнение)
 *
 * @param {(!Array|!Object)} obj - массив или объект
 * @param {(function(*, number, boolean, boolean, number)|function(*, string, number, boolean, boolean, number))} callback - функция callback
 */
Snakeskin.forEach = function (obj, callback) {
	var i = -1,
		length,
		key;

	if (Array.isArray(obj)) {
		length = obj.length;
		while (++i < length) {
			if (callback(obj[i], i, i === 0, i === length - 1, length) === false) {
				break;
			}
		}

	} else {
		i = 0;
		for (key in obj) {
			if (!obj.hasOwnProperty(key)) { continue; }
			i++;
		}

		length = i;
		i = -1;
		for (key in obj) {
			if (!obj.hasOwnProperty(key)) { continue; }
			i++;
			if (callback(obj[key], key, i, i === 0, i === length - 1, length) === false) {
				break;
			}
		}
	}
};
/////////////////////////////////
//// Различные методы для работы скомпилированных шаблонов
/////////////////////////////////

/**
 * Итератор цикла
 *
 * @param {(!Array|!Object)} obj - массив или объект
 * @param {function()} callback - функция callback
 */
Snakeskin.forEach = function (obj, callback) {
	var i = -1,
		length,
		key;
	
	if (Array.isArray(obj)) {
		length = obj.length;
		while (++i < length) {
			callback(obj[i], i, i === 0, i === length - 1, length);
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
			callback(obj[key], key, i, i === 0, i === length - 1, length);
		}
	}
};
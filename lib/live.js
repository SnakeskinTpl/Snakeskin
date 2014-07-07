if (/\[\w+ \w+]/.test(Object.keys && Object.keys.toString())) {
	var keys = Object.keys;
}

/**
 * Итератор массива или объекта (с проверкой hasOwnProperty)
 *
 * @expose
 * @param {(Array|Object)} obj - исходный объект
 * @param {(function(?, number, !Array, boolean, boolean, number)|function(?, string, !Object, number, boolean, boolean, number))} callback - функция обратного вызова
 */
Snakeskin.forEach = function (obj, callback) {
	if (!obj) {
		return;
	}

	var length = 0;

	if (Array.isArray(obj)) {
		length = obj.length;
		for (var i$0 = -1; ++i$0 < length;) {
			if (callback(obj[i$0], i$0, obj, i$0 === 0, i$0 === length - 1, length) === false) {
				break;
			}
		}

	} else if (keys) {
		var arr = keys(obj);
		length = arr.length;

		for (var i$1 = -1; ++i$1 < length;) {
			if (callback(obj[arr[i$1]], arr[i$1], obj, i$1, i$1 === 0, i$1 === length - 1, length) === false) {
				break;
			}
		}

	} else {
		if (callback.length >= 6) {
			for (var key in obj) {
				if (!obj.hasOwnProperty(key)) {
					continue;
				}

				length++;
			}
		}

		for (var key$0 in obj) {
			if (!obj.hasOwnProperty(key$0)) {
				continue;
			}

			if (callback(obj[key$0], key$0, obj, i, i === 0, i === length - 1, length) === false) {
				break;
			}
		}
	}
};

/**
 * Итератор объекта без проверки hasOwnProperty
 *
 * @expose
 * @param {Object} obj - исходный объект
 * @param {function(?, string, !Object, number, boolean, boolean, number)} callback - функция обратного вызова
 */
Snakeskin.forIn = function (obj, callback) {
	if (!obj) {
		return;
	}

	var length = 0;

	if (callback.length >= 6) {
		for (var key in obj) {
			length++;
		}
	}

	for (var key$1 in obj) {
		if (callback(obj[key$1], key$1, obj, i, i === 0, i === length - 1, length) === false) {
			break;
		}
	}
};
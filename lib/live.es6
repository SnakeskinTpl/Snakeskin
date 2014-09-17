if (/\[\w+ \w+]/.test(Object.keys && Object.keys.toString())) {
	var keys = Object.keys;
}

/**
 * Конструктор объекта StringBuffer
 *
 * @expose
 * @constructor
 * @return {!Array}
 */
Snakeskin.StringBuffer = function () {
	return [];
};

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
		for (let i = -1; ++i < length;) {
			if (callback(obj[i], i, obj, i === 0, i === length - 1, length) === false) {
				break;
			}
		}

	} else if (keys) {
		let arr = keys(obj);
		length = arr.length;

		for (let i = -1; ++i < length;) {
			if (callback(obj[arr[i]], arr[i], obj, i, i === 0, i === length - 1, length) === false) {
				break;
			}
		}

	} else {
		let i = 0;

		if (callback.length >= 6) {
			for (let key in obj) {
				if (!obj.hasOwnProperty(key)) {
					continue;
				}

				length++;
			}
		}

		for (let key in obj) {
			if (!obj.hasOwnProperty(key)) {
				continue;
			}

			if (callback(obj[key], key, obj, i, i === 0, i === length - 1, length) === false) {
				break;
			}

			i++;
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

	var length = 0,
		i = 0;

	if (callback.length >= 6) {
		for (let key in obj) {
			length++;
		}
	}

	for (let key in obj) {
		if (callback(obj[key], key, obj, i, i === 0, i === length - 1, length) === false) {
			break;
		}

		i++;
	}
};

/**
 * Вставить заданный узел или текст в исходный
 *
 * @expose
 * @param {!Node} node - исходный элемент
 * @param {(!Node|string)} obj - элемент для вставки или текст
 */
Snakeskin.appendChild = function (node, obj) {
	if (typeof obj === 'string') {
		obj = document.createTextNode(obj);
	}

	node.appendChild(obj);
};
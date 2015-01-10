/*!
 * Методы live библиотеки Snakeskin
 */

if (/\[native code]/.test(Object.keys && Object.keys.toString())) {
	var keys = Object.keys;
}

/**
 * Декларировать локальный модуль
 * @param {function()} fn
 */
function local(fn) {
	fn();
}

/**
 * Итератор объекта
 *
 * @param {(Object|undefined)} obj - исходный объект
 * @param {function(?, string, !Object)} callback - функция обратного вызова
 */
function forIn(obj, callback) {
	if (!obj) {
		return;
	}

	if (keys) {
		let arr = keys(obj),
			length = arr.length;

		for (let i = -1; ++i < length;) {
			if (callback(obj[arr[i]], arr[i], obj) === false) {
				break;
			}
		}

	} else {
		for (let key in obj) {
			if (!obj.hasOwnProperty(key)) {
				continue;
			}

			if (callback(obj[key], key, obj) === false) {
				break;
			}
		}
	}
}

/**
 * Конструктор объекта StringBuffer
 *
 * @constructor
 * @return {!Array}
 */
Snakeskin.StringBuffer = function () {
	return [];
};

/**
 * Итератор массива или объекта (с проверкой hasOwnProperty)
 *
 * @param {(Array|Object|undefined)} obj - исходный объект
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
 * @param {(Object|undefined)} obj - исходный объект
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

var inlineTagMap = {
	'img': true,
	'link': true,
	'embed': true,
	'br': true,
	'hr': true,
	'wbr': true,
	'meta': true,
	'input': true,
	'source': true,
	'track': true,
	'base': true,
	'area': true,
	'col': true,
	'param': true
};

/**
 * Вставить заданный узел или текст в исходный
 *
 * @param {!Node} node - исходный элемент
 * @param {(!Node|string)} obj - элемент для вставки или текст
 * @return {(!Node|string)}
 */
Snakeskin.appendChild = function (node, obj) {
	if (node['tagName'] && inlineTagMap[node['tagName'].toLowerCase()]) {
		return String(obj).trim();
	}

	if (typeof obj === 'string') {
		obj = document.createTextNode(obj);
	}

	node.appendChild(obj);
	return obj;
};
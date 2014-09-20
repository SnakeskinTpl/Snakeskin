/*!
 * Методы live библиотеки Snakeskin
 */

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
		for (var i = -1; ++i < length;) {
			if (callback(obj[i], i, obj, i === 0, i === length - 1, length) === false) {
				break;
			}
		}

	} else if (keys) {
		var arr = keys(obj);
		length = arr.length;

		for (var i$0 = -1; ++i$0 < length;) {
			if (callback(obj[arr[i$0]], arr[i$0], obj, i$0, i$0 === 0, i$0 === length - 1, length) === false) {
				break;
			}
		}

	} else {
		var i$1 = 0;

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

			if (callback(obj[key$0], key$0, obj, i$1, i$1 === 0, i$1 === length - 1, length) === false) {
				break;
			}

			i$1++;
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
		for (var key in obj) {
			length++;
		}
	}

	for (var key$1 in obj) {
		if (callback(obj[key$1], key$1, obj, i, i === 0, i === length - 1, length) === false) {
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
 * @expose
 * @param {!Node} node - исходный элемент
 * @param {(!Node|string)} obj - элемент для вставки или текст
 * @return {(!Node|string)}
 */
Snakeskin.appendChild = function (node, obj) {
	if (node['tagName'] && inlineTagMap[node['tagName'].toLowerCase()]) {
		return obj;
	}

	if (typeof obj === 'string') {
		obj = document.createTextNode(obj);
	}

	node.appendChild(obj);
	return obj;
};
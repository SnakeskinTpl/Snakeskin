var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Импортировать свойства объекта в пространство имён Snakeskin.Filters
 *
 * @param {!Object} filters - исходный объект
 * @param {?string=} [opt_namespace] - пространство имён для сохранения, например, foo.bar
 */
Snakeskin.importFilters = function (filters, opt_namespace) {
	var __NEJS_THIS__ = this;
	var obj = Snakeskin.Filters;

	if (opt_namespace) {
		var parts = opt_namespace.split('.');
		for (var i = 0; i < parts.length; i++) {
			if (!obj[parts[i]]) {
				obj[parts[i]] = {};
			}

			obj = obj[parts[i]];
		}
	}

	for (var key in filters) {
		if (!filters.hasOwnProperty(key)) {
			continue;
		}

		obj[key] = filters[key];
	}
};

var entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&#39;',
	'/': '&#x2F;'
};

var escapeHTMLRgxp = /[&<>"'\/]/g,
	escapeHTML = function (s) {
		return entityMap[s];};

/**
 * Экранирование строки html
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.html = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(escapeHTMLRgxp, escapeHTML);
};

/**
 * Замена undefined на ''
 *
 * @param {*} str - исходная строка
 * @return {*}
 */
Snakeskin.Filters.undef = function (str) {
	var __NEJS_THIS__ = this;
	return str !== void 0 ? str : '';
};

var uentityMap = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#39;': '\'',
	'&#x2F;': '/'
};

var uescapeHTMLRgxp = /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g,
	uescapeHTML = function (s) {
		return uentityMap[s];};

/**
 * Снять экранирование строки html
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['uhtml'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(uescapeHTMLRgxp, uescapeHTML);
};

var stripTagsRgxp = /<\/?[^>]+>/g;

/**
 * Удалить html теги из строки
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['stripTags'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(stripTagsRgxp, '');
};

var uriO = /%5B/g,
	uriC = /%5D/g;

/**
 * Кодировать URL - https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURI
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['uri'] = function (str) {
	var __NEJS_THIS__ = this;
	return encodeURI(str + '').replace(uriO, '[').replace(uriC, ']');
};

/**
 * Перевести строку в верхний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['upper'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').toUpperCase();
};

/**
 * Перевести первую букву в верхний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['ucfirst'] = function (str) {
	var __NEJS_THIS__ = this;
	str += '';
	return str.charAt(0).toUpperCase() + str.substring(1);
};

/**
 * Перевести строку в нижний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['lower'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').toLowerCase();
};

/**
 * Перевести первую букву в нижний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['lcfirst'] = function (str) {
	var __NEJS_THIS__ = this;
	str += '';
	return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Обрезать крайние пробелы
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['trim'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').trim();
};

var spaceCollapseRgxp = /\s{2,}/g;

/**
 * Свернуть пробелы в один и срезать крайние
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['collapse'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(spaceCollapseRgxp, ' ').trim();
};

/**
 * Обрезать строку до нужной длины (в конце, если нужно, ставится троеточие)
 *
 * @param {*} str - исходная строка
 * @param {number} length - максимальная длина текста
 * @param {?boolean=} [opt_wordOnly=false] - если false, то текст обрезается без учёта целостности слов
 * @return {string}
 */
Snakeskin.Filters['truncate'] = function (str, length, opt_wordOnly) {
	var __NEJS_THIS__ = this;
	str += '';
	if (!str || str.length <= length) {
		return str;
	}

	var tmp = str.substring(0, length - 1),
		lastInd;

	var i = tmp.length;
	while (i-- && opt_wordOnly) {
		if (tmp.charAt(i) === ' ') {
			lastInd = i;

		} else if (lastInd !== void 0) {
			break;
		}
	}

	return (lastInd !== void 0 ? tmp.substring(0, lastInd) : tmp) + '…';
};

/**
 * Составить строку из повторений подстроки
 *
 * @param {*} str - исходная строка
 * @param {?number=} [opt_num=1] - число повторений
 * @return {string}
 */
Snakeskin.Filters['repeat'] = function (str, opt_num) {
	var __NEJS_THIS__ = this;
	return new Array(opt_num || 2).join(str);
};

/**
 * Удалить все подстроки в строке
 *
 * @param {*} str - исходная строка
 * @param {(string|RegExp)} search - искомая подстрока
 * @return {string}
 */
Snakeskin.Filters['remove'] = function (str, search) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(search, '');
};

/**
 * Заменить все подстроки в строке
 *
 * @param {*} str - исходная строка
 * @param {(string|!RegExp)} search - искомая подстрока
 * @param {string} replace - строка для замены
 * @return {string}
 */
Snakeskin.Filters['replace'] = function (str, search, replace) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(search, replace);
};

/**
 * Преобразовать объект в строку JSON
 *
 * @param {(Object|Array|string|number|boolean)} obj - исходный объект
 * @return {string}
 */
Snakeskin.Filters['json'] = function (obj) {
	var __NEJS_THIS__ = this;
	if (typeof obj === 'object') {
		return JSON.stringify(obj);
	}

	return (obj + '');
};
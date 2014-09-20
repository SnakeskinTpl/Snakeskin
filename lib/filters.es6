/*!
 * Набор базовых фильтров и методы для работы с ними
 */

/**
 * Импортировать свойства заданного объекта в пространство имён Snakeskin.Filters
 *
 * @expose
 * @param {!Object} filters - импортируемый объект
 * @param {?string=} [opt_namespace] - пространство имён для сохранения, например, foo.bar
 */
Snakeskin.importFilters = function (filters, opt_namespace) {
	var obj = Snakeskin.Filters;

	if (opt_namespace) {
		let parts = opt_namespace.split('.');
		for (let i = -1; ++i < parts.length;) {
			if (!obj[parts[i]]) {
				obj[parts[i]] = {};
			}

			obj = obj[parts[i]];
		}
	}

	for (let key in filters) {
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
	escapeAttrRgxp = /([$\w]\s*=\s*)([^"'\s>=]+)/g,
	escapeJavaScript = /(javascript)(:|;)/,
	escapeHTML = (s) => entityMap[s];

/**
 * Экранирование HTML сущностей
 *
 * @expose
 * @param {*} str - исходная строка
 * @param {?boolean=} [opt_attr=false] - если true, то дополнительное экранируются xml атрибуты
 * @return {string}
 */
Snakeskin.Filters.html = function (str, opt_attr) {
	var res = String(str);

	if (opt_attr) {
		res = res.replace(escapeAttrRgxp, '$1"$2"');
	}

	res = res.replace(escapeHTMLRgxp, escapeHTML);

	if (opt_attr) {
		res = res.replace(escapeJavaScript, '$1&#31;$2');
	}

	return res;
};

/**
 * Замена undefined на ''
 *
 * @expose
 * @param {*} str - исходная строка
 * @return {*}
 */
Snakeskin.Filters.undef = function (str) {
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
	uescapeHTML = (s) => uentityMap[s];

/**
 * Снятие экранирования HTML сущностей
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['uhtml'] = function (str) {
	return String(str).replace(uescapeHTMLRgxp, uescapeHTML);
};

var stripTagsRgxp = /<\/?[^>]+>/g;

/**
 * Удаление HTML тегов
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['stripTags'] = function (str) {
	return String(str).replace(stripTagsRgxp, '');
};

var uriO = /%5B/g,
	uriC = /%5D/g;

/**
 * Кодирование URL
 *
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURI
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['uri'] = function (str) {
	return encodeURI(String(str))
		.replace(uriO, '[')
		.replace(uriC, ']');
};

/**
 * Перевод строки в верхний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['upper'] = function (str) {
	return String(str).toUpperCase();
};

/**
 * Перевод первой буквы строки в верхний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['ucfirst'] = function (str) {
	str = String(str);
	return str.charAt(0).toUpperCase() + str.substring(1);
};

/**
 * Перевод строки в нижний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['lower'] = function (str) {
	return String(str).toLowerCase();
};

/**
 * Перевод первой буквы строки в нижний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['lcfirst'] = function (str) {
	str = String(str);
	return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Срез крайних пробелов строки
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['trim'] = function (str) {
	return String(str).trim();
};

var spaceCollapseRgxp = /\s{2,}/g;

/**
 * Срез крайних пробелов строки
 * и свёртывание остальных пробелов в один
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['collapse'] = function (str) {
	return String(str).replace(spaceCollapseRgxp, ' ').trim();
};

/**
 * Обрезание строки до заданной длины
 * (в конце, если нужно, ставится многоточие)
 *
 * @param {*} str - исходная строка
 * @param {number} length - максимальная длина текста
 * @param {?boolean=} [opt_wordOnly=false] - если false, то текст обрезается без учёта целостности слов
 * @param {?boolean=} [opt_html=false] - если true, то символ многоточия вставляется как HTML-мнемоник
 * @return {string}
 */
Snakeskin.Filters['truncate'] = function (str, length, opt_wordOnly, opt_html) {
	str = String(str);
	if (!str || str.length <= length) {
		return str;
	}

	var tmp = str.substring(0, length - 1),
		lastInd = void 0;

	var i = tmp.length;
	while (i-- && opt_wordOnly) {
		if (tmp.charAt(i) === ' ') {
			lastInd = i;

		} else if (lastInd !== void 0) {
			break;
		}
	}

	return (lastInd !== void 0 ? tmp.substring(0, lastInd) : tmp) + (opt_html ? '&#8230;' : '…');
};

/**
 * Генерация строки из повторений исходной подстроки
 *
 * @param {*} str - исходная строка
 * @param {?number=} [opt_num=2] - число повторений
 * @return {string}
 */
Snakeskin.Filters['repeat'] = function (str, opt_num) {
	return new Array(opt_num != null ? opt_num + 1 : 3).join(str);
};

/**
 * Удаление подстроки из строки
 *
 * @param {*} str - исходная строка
 * @param {(string|RegExp)} search - искомая подстрока
 * @return {string}
 */
Snakeskin.Filters['remove'] = function (str, search) {
	return String(str).replace(search, '');
};

/**
 * Замена подстроки в строке
 *
 * @param {*} str - исходная строка
 * @param {(string|!RegExp)} search - искомая подстрока
 * @param {string} replace - строка для замены
 * @return {string}
 */
Snakeskin.Filters['replace'] = function (str, search, replace) {
	return String(str).replace(search, replace);
};

/**
 * Преобразование объекта в JSON
 *
 * @param {(Object|Array|string|number|boolean)} obj - исходный объект
 * @return {string}
 */
Snakeskin.Filters['json'] = function (obj) {
	if (typeof obj === 'object') {
		return JSON.stringify(obj);
	}

	return String(obj);
};

/**
 * Преобразование JSON в объект
 *
 * @param {*} val - исходное значение
 * @return {?}
 */
Snakeskin.Filters['parse'] = function (val) {
	if (typeof val !== 'string') {
		return val;
	}

	return JSON.parse(val);
};

/**
 * Декларация BEM части
 *
 * @param {*} block - название блока
 * @param {*} part - вторая часть декларации
 * @return {string}
 */
Snakeskin.Filters['bem'] = function (block, part) {
	return String(block) + String(part);
};

/**
 * Задача значения по умолчанию для объекта
 *
 * @param {*} val - исходное значение
 * @param {*} def - значение по умолчанию
 * @return {*}
 */
Snakeskin.Filters['default'] = function (val, def) {
	return val === void 0 ? def : val;
};
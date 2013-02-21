/////////////////////////////////
//// Snakeskin - компилируемый шаблонизатор
/////////////////////////////////

var Snakeskin = {
		VERSION: '1.2.1',
		Filters: {},
		cache: {}
	},
	
	SS = Snakeskin;

(function (require) {
	'use strict';
	
	/////////////////////////////////
	//// Live toolkit
	/////////////////////////////////
	
	var key;
	
	if (!Array.isArray) {
		/**
		 * Вернуть true, если указанный объект является массивом
		 *
		 * @param {*} obj - исходный объект
		 * @return {boolean}
		 */
		Array.isArray = function (obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		};
	}
	
	if (!String.prototype.trim) {
		/**
		 * Удалить крайние пробелы у строки
		 *
		 * @this {string}
		 * @return {string}
		 */
		String.prototype.trim = function () {
			var str = this.replace(/^\s\s*/, ''),
				i = str.length;
				
			while (/\s/.test(str.charAt(--i))) {};
			return str.substring(0, i + 1);
		};
	}
	
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
	
	var entityMap = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			'\'': '&#39;',
			'/': '&#x2F;'
		},
		escapeHTMLRgxp = /[&<>"'\/]/g,
		escapeHTML = function (s) {
			return entityMap[s];
		};
	
	/**
	 * Экранирование строки html
	 *
	 * @param {*} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.html = function (str) {
		return String(str).replace(escapeHTMLRgxp, escapeHTML);
	};
	
	/**
	 * Замена undefined на ''
	 *
	 * @param {*} str - исходная строка
	 * @return {*}
	 */
	Snakeskin.Filters.undef = function (str) {
		return typeof str !== 'undefined' ? str : '';
	};
	
	var uentityMap = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#39;': '\'',
		'&#x2F;': '/'
	},
	uescapeHTMLRgxp = /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g,
	uescapeHTML = function (s) {
		return uentityMap[s];
	};

	/**
	 * Снять экранирование строки html
	 *
	 * @param {*} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.uhtml = function (str) {
		return String(str).replace(uescapeHTMLRgxp, uescapeHTML);
	};
	
	var stripTagsRgxp = /<\/?[^>]+>/g;
	
	/**
	 * Удалить html теги из строки
	 *
	 * @param {*} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.stripTags = function (str) {
		return String(str).replace(stripTagsRgxp, '');
	};
	
	var uriO = /%5B/g,
		uriC = /%5D/g;
	
	/**
	 * Кодировать URL - https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURI
	 *
	 * @param {*} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.uri = function (str) {
		return encodeURI(String(url)).replace(uriO, '[').replace(uriC, ']');
	};
	
	/**
	 * Перевести строку в верхний регистр
	 *
	 * @param {string} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.upper = function (str) {
		return String(str).toUpperCase();
	};
	
	/**
	 * Перевести первую букву в верхний регистр
	 *
	 * @param {*} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.ucfirst = function (str) {
		str = String(str);
		return str.charAt(0).toUpperCase() + str.substring(1);
	};
	
	/**
	 * Перевести строку в нижний регистр
	 *
	 * @param {*} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.lower = function (str) {
		return String(str).toLowerCase();
	};
	
	/**
	 * Перевести первую букву в нижний регистр
	 *
	 * @param {*} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.lcfirst = function (str) {
		str = String(str);
		return str.charAt(0).toLowerCase() + str.substring(1);
	};
	
	/**
	 * Обрезать крайние пробелы
	 *
	 * @param {*} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.trim = function (str) {
		return String(str).trim();
	};
	
	var spaceCollapseRgxp = /\s{2,}/g;
	
	/**
	 * Свернуть пробелы в один и срезать крайние
	 *
	 * @param {*} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.collapse = function (str) {
		return String(str).replace(spaceCollapseRgxp, ' ').trim();
	};
	
	/**
	 * Обрезать строку до нужно длины (в конце, если нужно, ставится троеточие)
	 *
	 * @param {*} str - исходная строка
	 * @param {number} length - максимальная длина текста
	 * @param {?boolean=} [opt_wordOnly=false] - если false, то текст обрезается без учёта целостности слов
	 * @return {string}
	 */
	Snakeskin.Filters.truncate = function (str, length, opt_wordOnly) {
		str = String(str);
		if (!str || str.length <= length) {
			return str;
		}
		
		var tmp = str.substring(0, length - 1),
			lastInd, i = tmp.length;
		
		while (i-- && opt_wordOnly) {
			if (tmp.charAt(i) === ' ') {
				lastInd = i;
			
			} else if (typeof lastInd !== 'undefined') {
				break;
			}
		}
		
		return (typeof lastInd !== 'undefined' ? tmp.substring(0, lastInd) : tmp) + '…';
	};
	
	/**
	 * Составить строку из повторений подстроки
	 *
	 * @param {*} str - исходная строка
	 * @param {?number=} [opt_num=1] - число повторений
	 * @return {string}
	 */
	Snakeskin.Filters.repeat = function (str, opt_num) {
		return new Array(opt_num || 2).join(str);
	};
	
	/**
	 * Удалить все подстроки в строке
	 *
	 * @param {*} str - исходная строка
	 * @param {(string|RegExp)} search - искомая подстрока
	 * @return {string}
	 */
	Snakeskin.Filters.remove = function (str, search) {
		return String(str).replace(search, '');
	};
	
	/**
	 * Заменить все подстроки в строке
	 *
	 * @param {*} str - исходная строка
	 * @param {(string|RegExp)} search - искомая подстрока
	 * @param {string} replace - строка для замены
	 * @return {string}
	 */
	Snakeskin.Filters.replace = function (str, search, replace) {
		return String(str).replace(search, replace);
	};
	
	
	// common.js экспорт
	if (require) {
		for (key in Snakeskin) {
			if (!Snakeskin.hasOwnProperty(key)) { continue; }
			exports[key] = Snakeskin[key];
		}
	}
})(typeof window === 'undefined');

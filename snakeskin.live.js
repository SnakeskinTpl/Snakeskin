/////////////////////////////////
//// Snakeskin - компилируемый шаблонизатор
/////////////////////////////////

var Snakeskin = {
		VERSION: '1.1',
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
	 * @param {string} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.html = function (str) {
		return String(str).replace(escapeHTMLRgxp, escapeHTML);
	};
	
	
	// common.js экспорт
	if (require) {
		for (key in Snakeskin) {
			if (!Snakeskin.hasOwnProperty(key)) { continue; }
			exports[key] = Snakeskin[key];
		}
	}
})(typeof window === 'undefined');

var __NEJS_THIS__ = this;
/*!
 * Полифилы для старых браузеров
 * @status stable
 * @version 1.0.0
 */

if (!Array.isArray) {
	/**
	 * Вернуть true, если указанный объект является массивом
	 *
	 * @param {*} obj - исходный объект
	 * @return {boolean}
	 */
	Array.isArray = function (obj) {
		var __NEJS_THIS__ = this;
		return Object.prototype.toString.call(obj) === '[object Array]';
	};
}

if (!String.prototype.trim) {
	/**
	 * Удалить крайние пробелы у строки
	 * @return {string}
	 */
	String.prototype.trim = function () {
		var __NEJS_THIS__ = this;
		var str = this.replace(/^\s\s*/, ''),
			i = str.length;

		while (/\s/.test(str.charAt(--i))) {}
		return str.substring(0, i + 1);
	};
}
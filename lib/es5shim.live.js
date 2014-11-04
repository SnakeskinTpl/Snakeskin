/*!
 * Полифилы, необходимые для работы live библиотеки
 * в старых браузерах
 */

Array.isArray = Array.isArray || /* istanbul ignore next */ function (obj) {
	return ({}).toString.call(obj) === '[object Array]';
};

String.prototype.trim = String.prototype.trim || /* istanbul ignore next */ function () {
	var str = this.replace(/^\s\s*/, ''),
		i = str.length;

	for (let rgxp = /\s/; rgxp.test(str.charAt(--i));) {}
	return str.substring(0, i + 1);
};

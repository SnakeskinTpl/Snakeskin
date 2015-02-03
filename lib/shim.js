/*!
 * Some ECMAScript shims
 */

Array.isArray = Array.isArray || function (obj) {
	return ({}).toString.call(obj) === '[object Array]';
};

String.prototype.trim = String.prototype.trim || function () {
	var str = this.replace(/^\s\s*/, ''),
		i = str.length;

	for (let rgxp = /\s/; rgxp.test(str.charAt(--i));) {}
	return str.substring(0, i + 1);
};

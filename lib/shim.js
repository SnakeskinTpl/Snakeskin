/*!
 * Some ECMAScript shims
 */

Array.isArray = Array.isArray || function (obj) {
	return Object().toString.call(obj) === '[object Array]';
};

String.prototype.trim = String.prototype.trim || function () {
	const
		str = this.replace(/^\s\s*/, ''),
		rgxp = /\s/;

	for (let i = str.length; rgxp.test(str.charAt(--i));) {
		/* ignore */
	}

	return str.substring(0, i + 1);
};

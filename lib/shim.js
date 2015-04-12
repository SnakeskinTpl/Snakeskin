/*!
 * Some ECMAScript shims
 */

Array.isArray = Array.isArray || function (obj) {
	return ({}).toString.call(obj) === '[object Array]';
};

String.prototype.trim = String.prototype.trim || function () {
	const
		str = this.replace(/^\s\s*/, '');

	let
		i = str.length;

	for (const rgxp = /\s/; rgxp.test(str.charAt(--i));) {
		/* ignore */
	}

	return str.substring(0, i + 1);
};

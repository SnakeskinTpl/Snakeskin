var tagSymbols = new RegExp(`[${w}]`);

function beforeTag(str, start) {
	for (let i = start; i--;) {
		let el = str.charAt(i),
			sstr = str.substr(i - 1, 2);

		if (!whiteSpaceRgxp.test(el)) {
			return tagSymbols.test(el) || sstr === '--';
		}
	}

	return true;
}

function afterTag(str, start) {
	for (let i = start - 1; ++i < str.length;) {
		let el = str.charAt(i),
			sstr = str.substr(i, 3);

		if (!whiteSpaceRgxp.test(el)) {
			return tagSymbols.test(el) || sstr === '!--';
		}
	}

	return true;
}

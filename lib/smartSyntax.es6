Snakeskin.prepareDecl = function (dir) {
	var clrL = true,
		spaces = 0;

	var struct = [];
	for (let i = dir.i; i < dir.source.length; i++) {
		let el = dir.source.charAt(i),
			currentClrL = clrL;

		if (nextLineRgxp.test(el)) {
			clrL = true;
			spaces = 0;

		} else {
			if (whiteSpaceRgxp.test(el)) {
				spaces++;

			} else if (currentClrL && shortMap[el]) {
				clrL = false;

				let last = struct[struct.length - 1];

				if (last) {
					if (last.spaces < spaces) {
						last.children.push({
							command: el,
							spaces: spaces,
							children: []
						});

						last.children[0].parent = struct;
						struct = last.children;

					} else {

					}

				} else {
					console.log(getDir(dir.source, i + 1));

					struct.push({
						command: el,
						spaces: spaces,
						children: [],
						parent: null
					})
				}
			}
		}
	}
};

function getDir(str, i) {
	var res = '',
		name = '';

	var lastEl = '',
		lastElI = 0,
		nmBrk = null;

	for (let j = i; j < str.length; j++) {
		let el = str.charAt(j);

		if (nextLineRgxp.test(el)) {
			if (lastEl !== '&') {
				return {
					command: res,
					name: name,
					lastEl: lastEl
				};

			} else {
				lastEl = '';
				res = res.substring(0, lastElI) + res.substring(lastElI + 1);
			}

		} else {
			let whiteSpace = whiteSpaceRgxp.test(el);

			if (whiteSpace) {
				if (nmBrk === false) {
					nmBrk = true;
				}

			} else if (whiteSpaceRgxp.test(res.charAt(res.length - 1))) {
				lastEl = el;
				lastElI = res.length;
			}

			if (!nmBrk && !whiteSpace) {
				if (nmBrk === null) {
					nmBrk = false;
				}

				name += el;
			}

			res += el;
		}
	}
}
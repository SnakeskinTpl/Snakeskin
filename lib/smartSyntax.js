function prepareDecl(str, i) {
	var clrL = true,
		spaces = 0;

	var struct = [];
	for (var j = i; j < str.length; j++) {
		var el = str.charAt(j),
			currentClrL = clrL;

		if (nextLineRgxp.test(el)) {
			clrL = true;
			spaces = 0;

		} else {
			if (whiteSpaceRgxp.test(el)) {
				spaces++;

			} else if (currentClrL && shortMap[el]) {
				clrL = false;
				var last = struct[struct.length - 1];

				if (last) {
					if (last.spaces < spaces) {
						var decl = getDir(dir.source, j + 1);

						last.children.push({
							command: decl.command,
							spaces: spaces,
							children: []
						});

						last.children[0].parent = struct;
						struct = last.children;
						j += decl.command.length;

					} else {
						var decl$0 = getDir(dir.source, j + 1);

						struct.push({
							command: decl$0.command,
							spaces: spaces,
							children: [],
							parent: null
						});

						j += decl$0.command.length;
					}

				} else {
					var decl$1 = getDir(dir.source, j + 1);

					struct.push({
						command: decl$1.command,
						spaces: spaces,
						children: [],
						parent: null
					});

					j += decl$1.command.length;
				}
			}
		}
	}
}

function getDir(str, i) {
	var res = '',
		name = '';

	var lastEl = '',
		lastElI = 0,
		nmBrk = null;

	for (var j = i; j < str.length; j++) {
		var el = str.charAt(j);

		if (nextLineRgxp.test(el)) {
			if (lastEl !== '&') {
				return {
					command: res,
					name: name,
					lastEl: lastEl
				};

			} else {
				lastEl = '';
				res = res.substring(0, lastElI) + el + res.substring(lastElI + 1);
			}

		} else {
			var whiteSpace = whiteSpaceRgxp.test(el);

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
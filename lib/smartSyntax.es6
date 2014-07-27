function prepareDecl(str, i) {
	var clrL = true,
		spaces = 0,
		space = '';

	var struct,
		res = '';

	var length = 0;
	for (let j = i; j < str.length; j++) {
		let el = str.charAt(j);
		length++;

		if (nextLineRgxp.test(el)) {
			clrL = true;
			spaces = 0;
			space = '\n';

		} else {
			if (whiteSpaceRgxp.test(el)) {
				spaces++;
				space += el;

			} else if (clrL && el) {
				clrL = false;

				let dir = shortMap[el],
					decl = getDir(str, dir ? j + 1 : j, dir);

				let obj = {
					command: decl.command,
					dir: dir,
					name: decl.name,
					spaces: spaces,
					space: space,
					parent: null,
					block: dir && block[decl.name]
				};

				if (struct) {
					if (struct.spaces < spaces && struct.block) {
						obj.parent = struct;
						struct = obj;

					} else if (struct.spaces === spaces || struct.spaces < spaces && !struct.block) {
						if (struct.block) {
							res += `${LB}__end__${RB}`;
						}

						obj.parent = struct.parent;
						struct = obj;

					} else {
						while (struct.spaces >= spaces) {
							if (struct.block) {
								res += `${LB}__end__${RB}`;
							}

							struct = struct
								.parent;

							if (!struct) {
								return {
									str: res,
									length: length
								};
							}
						}

						obj.parent = struct;
					}

				// Первичная инициализация
				} else {
					struct = obj;
				}

				res += space +
					(dir ? LB : '') +
					decl.command +
					(dir ? RB : '');

				length += decl.command.length;
				j += decl.command.length - 1;
			}
		}
	}

	while (struct) {
		if (struct.block) {
			res += `${LB}__end__${RB}`;
		}

		struct = struct
			.parent;
	}

	return {
		str: res,
		length: length
	};
}

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
				res = res.substring(0, lastElI) + el + res.substring(lastElI + 1);
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

			if (nmBrk !== null) {
				res += el;
			}
		}
	}
}
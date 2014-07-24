function prepareDecl(str, i) {
	var clrL = true,
		spaces = 0,
		space = '';

	var struct = [],
		res = '';

	for (let j = i; j < str.length; j++) {
		let el = str.charAt(j);

		if (nextLineRgxp.test(el)) {
			clrL = true;
			spaces = 0;
			space = '\n';

		} else {
			if (whiteSpaceRgxp.test(el)) {
				spaces++;
				space += el;

			} else if (clrL && shortMap[el]) {
				clrL = false;

				let last = struct[struct.length - 1],
					decl = getDir(str, j + 1);

				let obj = {
					command: decl.command,
					spaces: spaces,
					space: space,
					children: [],
					parent: null,
					block: Boolean(block[decl.name])
				};

				if (last) {
					if (last.spaces < spaces) {
						obj.parent = struct;
						last.children.push(obj);
						struct = last.children;

					} else if (last.spaces === spaces) {
						struct.push(obj);

					} else {
						while (last.spaces >= spaces) {
							if (last.block) {
								res += `${LB}end${RB}`;
							}

							if (struct[0].parent) {
								struct = struct[0].parent;
								last = struct[0];

							} else {
								return res;
							}
						}

						obj.parent = struct;
						last.children.push(obj);
						struct = last.children;
					}

				} else {
					struct.push(obj);
				}

				res += space + LB + decl.command + RB;
				j += decl.command.length;
			}
		}
	}

	var old = struct[struct.length - 1];

	while (true) {
		if (old.block) {
			res += `${LB}end${RB}`;
		}

		if (struct[0].parent) {
			struct = struct[0].parent;
			old = struct[0];

		} else {
			return res;
		}
	}
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
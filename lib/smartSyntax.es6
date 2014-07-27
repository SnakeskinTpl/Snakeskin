function getEnd(struct) {
	return `${struct.adv + LB}__end__${RB}`;
}

function prepareDecl(str, i) {
	var clrL = true,
		spaces = 0,
		space = '';

	var struct,
		res = '';

	var length = 0,
		tSpace = 0;

	for (let j = i; j < str.length; j++) {
		length++;

		let el = str.charAt(j),
			next2str = el + str.charAt(j + 1);

		if (nextLineRgxp.test(el)) {
			clrL = true;
			spaces = 0;
			space = '\n';
			tSpace++;

		} else {
			if (whiteSpaceRgxp.test(el)) {
				spaces++;
				space += el;
				tSpace++;

			} else if (clrL) {
				clrL = false;

				let dir = shortMap[el] || shortMap[next2str],
					decl = getDir(str, baseShortMap[el] || el === '|' ? j + 1 : j, dir);

				let replacer = replacers[next2str] || replacers[el];

				if (replacer) {
					decl.name = replacer(decl.name).trim();
				}

				let adv = el === ALB ? ALB : '';
				let obj = {
					dir: dir,
					name: decl.name,
					spaces: spaces,
					space: space,
					parent: null,
					block: dir && block[decl.name],
					adv: adv
				};

				if (struct) {
					if (struct.spaces < spaces && struct.block) {
						obj.parent = struct;
						struct = obj;

					} else if (struct.spaces === spaces || struct.spaces < spaces && !struct.block) {
						if (struct.block) {
							res += getEnd(struct);
						}

						obj.parent = struct.parent;
						struct = obj;

					} else {
						while (struct.spaces >= spaces) {
							if (struct.block) {
								res += getEnd(struct);
							}

							struct = struct
								.parent;

							if (!struct) {
								return {
									str: res,
									length: length - tSpace
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
					adv +
					(dir ? LB : '') +
					decl.command +
					(dir ? RB : '');

				length += decl.command.length - 1;
				j += decl.command.length - 1;

				tSpace = 0;
			}
		}
	}

	while (struct) {
		if (struct.block) {
			res += getEnd(struct);
		}

		struct = struct
			.parent;
	}

	return {
		str: res,
		length: length
	};
}

var lineWhiteSpaceRgxp = /[ \t]/;

function getDir(str, i) {
	var res = '',
		name = '';

	var lastEl = '',
		lastElI = 0;

	var concatLine = false;
	var nmBrk = null;

	for (let j = i; j < str.length; j++) {
		let el = str.charAt(j);

		if (nextLineRgxp.test(el)) {
			let prevEl = lastEl;
			lastEl = '';

			if (prevEl === '&' || prevEl === '.') {
				res = res.substring(0, lastElI) + el + res.substring(lastElI + 1);
			}

			if (concatLine && prevEl !== '.') {
				continue;
			}

			if (prevEl === '&') {
				concatLine = true;
				continue
			}

			return {
				command: res,
				name: name,
				lastEl: lastEl
			};

		} else {
			let whiteSpace = lineWhiteSpaceRgxp.test(el);

			if (whiteSpace) {
				if (nmBrk === false) {
					nmBrk = true;
				}

			} else {
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
var inline = {
	'img': true,
	'link': true,
	'embed': true,
	'br': true,
	'hr': true,
	'wbr': true,
	'meta': true,
	'input': true,
	'source': true,
	'track': true,
	'base': true
};

function prepareDecl(str, i) {
	var clrL = true,
		spaces = 0,
		space = '';

	var struct = [],
		res = '';

	var length = 0;
	for (var j = i; j < str.length; j++) {
		var el = str.charAt(j);
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

				var dir = shortMap[el];
				var last = struct[struct.length - 1],
					decl = getDir(str, dir ? j + 1 : j, dir);

				if (!dir) {
					getTag(decl.command);
				}

				var obj = {
					dir: dir,
					name: decl.name,
					spaces: spaces,
					space: space,
					children: [],
					parent: null,
					block: dir ?
						block[decl.name] : !inline[decl.name]
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
								if (last.dir) {
									res += (("" + LB) + ("__end__" + RB) + "");

								} else {
									res += (("</" + (last.name)) + ">");
								}
							}

							if (struct[0].parent) {
								struct = struct[0].parent;
								last = struct[0];

							} else {
								return {
									str: res,
									length: length
								};
							}
						}

						obj.parent = struct;
						last.children.push(obj);
						struct = last.children;
					}

				} else {
					struct.push(obj);
				}

				res += space +
					(dir ? LB : '<') +
					decl.command +
					(dir ? RB : '>');

				length += decl.command.length;
				j += decl.command.length;
			}
		}
	}

	var old = struct[struct.length - 1];

	while (true) {
		if (old.block) {
			if (old.dir) {
				res += (("" + LB) + ("__end__" + RB) + "");

			} else {
				res += (("</" + (old.name)) + ">");
			}
		}

		if (struct[0].parent) {
			struct = struct[0].parent;
			old = struct[0];

		} else {
			return {
				str: res,
				length: length
			};
		}
	}
}

function getTag(str) {
	var action = '';

	var tag = '',
		id = '',
		classes = [];

	var pOpen = 0;
	var attrs = {};

	for (var i = 0; i < str.length; i++) {
		var el = str.charAt(i);

		if (el === '#' || el === '.') {
			if (!tag) {
				tag = 'div';
			}

			action = el;

			if (el === '.') {
				classes.push('');
			}

			continue;
		}

		if (action === '#') {
			id += el;
		}

		if (action === '.') {
			classes[classes.length - 1] += el;
		}

		if (!action) {
			tag += el;
		}
	}

	console.log(tag, id, classes);
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

			if (nmBrk !== null) {
				res += el;
			}
		}
	}
}
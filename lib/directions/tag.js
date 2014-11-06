var emptyCommandParamsRgxp = /^([^\s]+?\(|\()/;

Snakeskin.addDirective(
	'tag',

	{
		block: true,
		placement: 'template',
		text: true,
		replacers: {
			'<': (cmd) => cmd.replace('<', 'tag '),
			'/<': (cmd) => cmd.replace('\/<', 'end tag')
		}
	},

	function (command) {
		this.startDir(null, {
			bemRef: this.bemRef
		});

		if (!this.tolerateWhitespace) {
			this.skipSpace = true;
		}

		if (this.isReady()) {
			if (command) {
				command = command.replace(emptyCommandParamsRgxp, 'div $1');

			} else {
				command = 'div';
			}

			let parts = splitBySpace(command),
				desc = this.returnTagDesc(parts[0]);

			let params = this.structure.params;

			params.tag = desc.tag;
			params.block = inlineTagMap[desc.tag] !== void 0 ?
				!inlineTagMap[desc.tag] : !desc.inline;

			let groups = this.splitAttrsGroup(parts.slice(1).join(' ')),
				dom = !this.domComment && this.renderMode === 'dom';

			let str = /* cbws */`
				__TMP__ = {
					'class': ''
				};
			`;

			if (dom) {
				str += /* cbws */`
					__NODE__ = document.createElement('${desc.tag}');
				`;

			} else {
				str += this.wrap(`'<${desc.tag}'`);
			}

			for (let i = -1; ++i < groups.length;) {
				let el = groups[i];
				str += this.returnAttrDecl(el.attr, el.group, el.separator, true);
			}

			if (desc.id) {
				if (dom) {
					str += `__NODE__.id = '${desc.id}';`;

				} else {
					str += this.wrap(`' id="${desc.id}"'`);
				}
			}

			if (desc.classes.length) {
				str += /* cbws */`
					__TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '${desc.classes.join(' ')}';
				`;
			}

			if (dom) {
				str += /* cbws */`
					if (__TMP__['class']) {
						__NODE__.className = __TMP__['class'];
					}

					${this.returnPushNodeDecl(!params.block)}
				`;

			} else {
				str += this.wrap(/* cbws */`
					(__TMP__['class'] ? ' class="' + __TMP__['class'] + '"' : '') + '${
						!params.block && this.doctype === 'xml' ? '/' : ''
					}>'
				`);
			}

			this.append(str);
		}
	},

	function () {
		var params = this.structure.params;

		this.bemRef = params.bemRef;
		this.prevSpace = false;

		if (params.block) {
			let str;

			if (!this.domComment && this.renderMode === 'dom') {
				str = '__RESULT__.pop();';

			} else {
				str = this.wrap(`'</${params.tag}>'`);
			}

			this.append(str);
		}
	}
);

var parentLinkRgxp = /^&/;

/**
 * Анализировать заданную строку декларации тега
 * и вернуть объект-описание
 *
 * @param {string} str - исходная строка
 * @return {{tag: string, id: string, classes: !Array, pseudo: !Array, inline: boolean}}
 */
DirObj.prototype.returnTagDesc = function (str) {
	var points = [],
		action = '';

	var tag = '',
		id = '',
		inline = false;

	var pseudo = [],
		classes = [];

	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	var bOpen = 0,
		bStart = false;

	var bMap = {
		'[': true,
		']': true
	};

	var sys = {
		'#': true,
		'.': true,
		':': true
	};

	var error = {
		tag: '',
		id: '',
		classes: [],
		pseudo: [],
		inline: false
	};

	for (let i = -1; ++i < str.length;) {
		let el = str.charAt(i),
			next = str.charAt(i + 1);

		if (bMap[el]) {
			if (el === '[') {
				bOpen++;
				bStart = true;

			} else {
				bOpen--;
			}

			continue;
		}

		if (bStart && el !== '.') {
			this.error('invalid syntax');
			return error;

		} else {
			bStart = false;
		}

		if (sys[el] && (el !== ADV_LEFT_BLOCK || next !== LEFT_BLOCK)) {
			if (!tag) {
				tag = 'div';
			}

			action = el;

			if (el === '.') {
				if (bOpen) {
					for (let j = points.length; j--;) {
						let point = points[j];

						if (point) {
							if (point.stage < bOpen) {
								let tmp = classes[j].replace(parentLinkRgxp, point.val),
									pos = point.from;

								while (points[pos] != null) {
									let parent = points[pos];
									tmp = tmp.replace(parentLinkRgxp, parent.val);
									pos = parent.from;
								}

								points.push({
									stage: bOpen,
									val: tmp,
									from: j
								});

								break;
							}

						} else {
							points.push({
								stage: bOpen,
								val: classes[j],
								from: j
							});

							break;
						}
					}

				} else {
					points.push(null);
				}

				classes.push('');

			} else if (el === ':') {
				if (!inline) {
					inline = pseudo[pseudo.length - 1] === 'inline';
				}

				pseudo.push('');
			}

			continue;
		}

		switch (action) {
			case '#':
				id += el;
				break;

			case '.':
				classes[classes.length - 1] += el;
				break;

			case ':':
				pseudo[pseudo.length - 1] += el;
				break;

			default:
				tag += el;
		}
	}

	if (bOpen) {
		this.error('invalid syntax');
		return error;
	}

	var ref = this.bemRef;

	for (let i = -1; ++i < classes.length;) {
		let el = classes[i];

		if (parentLinkRgxp.test(el)) {
			if (points[i]) {
				el = el.replace(parentLinkRgxp, points[i].val);
			}

			if (ref) {
				el = `${s}'${this.replaceTplVars(ref, true)}'${FILTER}bem '${this.replaceTplVars(el.substring(1), true)}'${e}`;
			}

		} else if (el) {
			ref = el;
		}

		classes[i] = this.replaceTplVars(el);
	}

	this.bemRef = ref;

	if (!inline) {
		inline = pseudo[pseudo.length - 1] === 'inline';
	}

	return {
		tag: this.replaceTplVars(tag),
		id: this.replaceTplVars(id),
		classes: classes,
		pseudo: pseudo,
		inline: inline
	};
};

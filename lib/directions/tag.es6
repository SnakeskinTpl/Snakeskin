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

			let parts = command.split(' '),
				desc = this.returnTagDesc(parts[0]);

			let params = this.structure.params;

			params.tag = desc.tag;
			params.block = inlineTagMap[desc.tag] !== void 0 ?
				!inlineTagMap[desc.tag] : !desc.inline;

			let groups = this.splitAttrsGroup(parts.slice(1).join(' ')),
				dom = !this.domComment && this.renderMode === 'dom';

			let str = `
				__TMP__ = {
					'class': ''
				};
			`;

			if (dom) {
				str += `
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
				str += `
					__TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '${desc.classes.join(' ')}';
				`;
			}

			if (dom) {
				str += `
					if (__TMP__['class']) {
						__NODE__.className = __TMP__['class'];
					}

					${this.returnPushNodeDecl(!params.block)}
				`;

			} else {
				str += this.wrap(`
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

/**
 * Анализировать заданную строку декларации тега
 * и вернуть объект-описание
 *
 * @param {string} str - исходная строка
 * @return {{tag: string, id: string, classes: !Array, pseudo: !Array, inline: boolean}}
 */
DirObj.prototype.returnTagDesc = function (str) {
	var action = '';
	var tag = '',
		id = '',
		inline = false;

	var pseudo = [],
		classes = [];

	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	var sys = {
		'#': true,
		'.': true,
		':': true
	};

	for (let i = -1; ++i < str.length;) {
		let el = str.charAt(i);

		if (sys[el]) {
			if (!tag) {
				tag = 'div';
			}

			action = el;

			if (el === '.') {
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
			case '#': {
				id += el;

			} break;

			case '.': {
				classes[classes.length - 1] += el;

			} break;

			case ':': {
				pseudo[pseudo.length - 1] += el;

			} break;

			default: {
				tag += el;
			}
		}
	}

	var ref = this.bemRef,
		newRef = '';

	for (let i = classes.length; i--;) {
		let el = classes[i];

		if (el.charAt(0) === '&') {
			if (ref) {
				el = `${s}'${this.replaceTplVars(ref, true)}'|bem '${this.replaceTplVars(el.substring(1), true)}'${e}`;
			}

		} else if (!newRef && el) {
			newRef = el;
		}

		classes[i] = this.replaceTplVars(el);
	}

	if (newRef) {
		this.bemRef = newRef;
	}

	if (!inline) {
		inline = pseudo[pseudo.length - 1] === 'inline';
	}

	return {
		ref: ref,
		tag: this.replaceTplVars(tag),
		id: this.replaceTplVars(id),
		classes: classes,
		pseudo: pseudo,
		inline: inline
	};
};

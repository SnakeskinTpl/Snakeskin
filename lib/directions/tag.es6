var tagRgxp = /^([^\s]+?\(|\()/;
var inlineTagMap = {
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
		this.space = true;
		this.startDir(null, {
			bemRef: this.bemRef
		});

		if (this.isReady()) {
			if (command) {
				command = command.replace(tagRgxp, 'div $1');

			} else {
				command = 'div';
			}

			let parts = command.split(' '),
				desc = this.returnTagDesc(parts[0]);

			let params = this.structure.params;
			params.tag = desc.tag;
			params.block = !inlineTagMap[desc.tag];

			let groups = this.splitAttrsGroup(parts.slice(1).join(' '));

			let str = `
				__TMP__ = {
					'class': ''
				};

				${this.wrap(`'<${desc.tag}'`)}
			`;

			for (let i = -1; ++i < groups.length;) {
				let el = groups[i];
				str += this.returnAttrDecl(el.attr, el.group, el.separator, true);
			}

			if (desc.id) {
				str += this.wrap(`' id="${desc.id}"'`);
			}

			if (desc.classes.length) {
				str += `
					__TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '${desc.classes.join(' ')}';
				`;
			}

			str += this.wrap(`' class="' + __TMP__['class'] + '"${!params.block ? '/' : ''}>'`);
			this.append(str);
		}
	},

	function () {
		var params = this.structure.params;
		this.bemRef = params.bemRef;

		if (params.block) {
			this.append(this.wrap(`'</${params.tag}>'`));
		}
	}
);

/**
 * Анализировать заданную строку декларации тега
 * и вернуть объект-описание
 *
 * @param {string} str - исходная строка
 * @return {{tag: string, id: string, classes: !Array}}
 */
DirObj.prototype.returnTagDesc = function (str) {
	var action = '';
	var tag = '',
		id = '',
		classes = [];

	for (let i = -1; ++i < str.length;) {
		let el = str.charAt(i);

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

		switch (action) {
			case '#': {
				id += el;
			} break;

			case '.': {
				classes[classes.length - 1] += el;
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
				el = `#{'${this.replaceTplVars(ref, true)}'|bem '${this.replaceTplVars(el.substring(1), true)}'}`;
			}

		} else if (!newRef && el) {
			newRef = el;
		}

		classes[i] = this.replaceTplVars(el);
	}

	if (newRef) {
		this.bemRef = newRef;
	}

	return {
		ref: ref,
		tag: this.replaceTplVars(tag),
		id: this.replaceTplVars(id),
		classes: classes
	};
};

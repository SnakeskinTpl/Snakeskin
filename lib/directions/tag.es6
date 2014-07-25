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
		notEmpty: true,
		text: true,
		replacers: {
			'<': (cmd) => cmd.replace('<', 'tag ')
		}
	},

	function (command) {
		this.startDir();
		if (this.isSimpleOutput()) {
			let parts = command.split(' '),
				desc = returnTagDesc(parts[0]);

			let params = this.structure.params;

			params.tag = desc.tag;
			params.block = !inlineTagMap[desc.tag];

			let groups = splitAttrGroup(parts.slice(1).join(' '));
			let str = `
				__TMP__ = {
					'class': ''
				};

				${this.wrap(`'<${desc.tag}'`)}
			`;

			for (let i = 0; i < groups.length; i++) {
				let el = groups[i];
				str += this.returnTagAttrDecl(el.attr, el.group, el.separator);
			}

			if (desc.id) {
				str += this.wrap(`' id="${desc.id}"'`);
			}

			if (desc.classes.length) {
				str += `
					__TMP__['class'] += (__TMP__['class'] ? ' ' : '') + '${desc.classes.join(' ')}';
					${this.wrap(`' class="' + __TMP__['class'] + '"'`)}
				`;
			}

			str += this.wrap(`'${!params.block ? '/' : ''}>'`);
			this.save(str);
		}
	},

	function () {
		if (this.isSimpleOutput()) {
			let params = this.structure.params;

			if (params.block) {
				this.save(this.wrap(`'</${params.tag}>'`));
			}
		}
	}
);

/**
 * Вернуть строку декларации XML атрибутов
 *
 * @param {string} command - исходная команда
 * @param {?string=} [opt_group] - название группы
 * @param {?string=} [opt_separator='-'] - разделитель группы
 * @return {string}
 */
DirObj.prototype.returnTagAttrDecl = function (command, opt_group, opt_separator) {
	opt_group = opt_group || '';
	opt_separator = opt_separator || '-';
	var parts = command.split(';'),
		res = '';

	for (let i = 0; i < parts.length; i++) {
		let arg = parts[i].split('=>');

		if (arg.length !== 2) {
			this.error(`invalid "${this.name}" declaration`);
			return '';
		}

		res += `
			__STR__ = \'\';
			__J__ = 0;
		`;

		if (opt_group) {
			arg[0] = opt_group + opt_separator + arg[0];

		} else {
			arg[0] = arg[0].charAt(0) === '-' ?
				`data-${arg[0].slice(1)}` : arg[0];
		}

		arg[0] = `'${this.replaceTplVars(arg[0].trim())}'`;
		let vals = arg[1].split(',');

		for (let j = 0; j < vals.length; j++) {
			let val = this.prepareOutput(`'${this.replaceTplVars(vals[j].trim())}'`, true) || '';

			res += `
				if ((${val}) != null && (${val}) !== '') {
					__STR__ += __J__ ? ' ' + ${val} : ${val};
					__J__++;
				}
			`;
		}

		res += `
			if ((${arg[0]}) != null && (${arg[0]}) != '' && __STR__) {
				if (__TMP__[(${arg[0]})] != null) {
					__TMP__[(${arg[0]})] += __STR__;

				} else {
					${this.wrap(`' ' + ${arg[0]} + ' = "' + __STR__ + '"'`)}
				}
			}
		`;
	}

	return res;
};

/**
 * Анализировать заданную строку на декларацию тега
 * и вернуть объект-описание
 *
 * @param {string} str - исходная строка
 * @return {{tag: string, id: string, classes: !Array}}
 */
function returnTagDesc(str) {
	var action = '';

	var tag = '',
		id = '',
		classes = [];

	for (let i = 0; i < str.length; i++) {
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

	return {
		tag: tag,
		id: id,
		classes: classes
	};
}
